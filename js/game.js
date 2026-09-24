/* =====================================================================
   GAME.JS: the game itself
   =====================================================================
   You normally don't need to edit this file.
   - Timers and rules:  js/config.js
   - Questions:         js/conditions.js
   - Words on screen:   js/text.js
   ===================================================================== */

// Short pauses between moments, in milliseconds (1000 = 1 second)
var START_DELAY_MS = 800;        // "Get ready…" before level 1
var NEXT_LEVEL_DELAY_MS = 700;   // after a passed level, before the next one
var END_SCREEN_DELAY_MS = 1200;  // after failing, before the end screen appears
var END_ACTIONS_ARM_MS = 600;    // end screen buttons ignore taps for this long
var PRESS_ANIMATION_MS = 90;     // how long the button stays pushed in
var VIBRATION_MS = 15;           // phone buzz on each press (Android only)

// Everything about the current run
var game = {
  difficulty: "easy",
  settings: null,          // this difficulty's block from CONFIG.difficulties
  levelTimeMs: 7000,
  styleId: "classic",      // the player's button style (also drawn on the share picture)
  showHint: false,         // true on a player's very first game (the one-time tip)

  phase: "idle",           // "idle" (get ready), "playing", "between" (after a pass), "over"
  level: 1,
  condition: null,         // the question on screen
  presses: 0,              // presses in this level
  totalPresses: 0,         // presses in the whole run

  runStartedAt: 0,         // when level 1 started
  runTimeMs: 0,            // total time, set when the run ends
  pausedAt: 0,             // when the pause started (0 = not paused)
  pausedTotalMs: 0,        // paused time, which doesn't count toward the run time
  levelEndsAt: 0,          // when the current level's time runs out
  levelTimeLeftMs: 0,      // time left, remembered while paused
  levelTimerId: null,
  pendingStep: null,       // a step that was due while paused, run when resuming

  decks: {},               // shuffled questions per level, dealt one by one
  lastConditionId: "",
  history: [],             // one entry per level: question, required, pressed

  finishedRun: null,       // the run summary saved at the end (levels, difficulty, presses, time)
  isNewBest: false         // true if the finished run entered the Personal Bests
};

var ui = {};               // the page elements, found once by findElements()
var pressTimerId = null;


// ---------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------

// Runs once when the page has loaded
function initGame() {
  fillTextSlots();
  findElements();

  game.difficulty = loadDifficulty();
  game.settings = window.CONFIG.difficulties[game.difficulty];
  game.levelTimeMs = getLevelTimeMs(game.difficulty);

  var style = loadButtonStyle();
  game.styleId = style.id;
  ui.button.className = "game-button " + style.cssClass;
  ui.counter.hidden = !game.settings.showLiveCounter;

  connectInputs();
  initShare();
  startRun();
}

// Puts the words from text.js into every element marked data-text or data-aria-text
function fillTextSlots() {
  var textSlots = document.querySelectorAll("[data-text]");
  for (var i = 0; i < textSlots.length; i++) {
    textSlots[i].textContent = window.TEXT[textSlots[i].getAttribute("data-text")];
  }
  var labelSlots = document.querySelectorAll("[data-aria-text]");
  for (var j = 0; j < labelSlots.length; j++) {
    labelSlots[j].setAttribute("aria-label", window.TEXT[labelSlots[j].getAttribute("data-aria-text")]);
  }
}

// Finds the page elements the game needs, once
function findElements() {
  ui.game = document.getElementById("game");
  ui.quitButton = document.getElementById("quit-button");
  ui.levelNumber = document.getElementById("level-number");
  ui.ring = document.getElementById("timer-progress");
  ui.button = document.getElementById("game-button");
  ui.burst = document.getElementById("burst");
  ui.burstText = document.getElementById("burst-text");
  ui.counter = document.getElementById("press-counter");
  ui.instruction = document.getElementById("instruction-text");
  ui.hint = document.getElementById("instruction-hint");

  ui.pauseDialog = document.getElementById("pause-dialog");
  ui.resumeButton = document.getElementById("resume-button");
  ui.quitConfirm = document.getElementById("quit-confirm");

  ui.end = document.getElementById("end-screen");
  ui.endTitle = document.getElementById("end-title");
  ui.endInstruction = document.getElementById("end-instruction");
  ui.endDetails = document.getElementById("end-details");
  ui.endRequired = document.getElementById("end-required");
  ui.endPressed = document.getElementById("end-pressed");
  ui.endActions = document.getElementById("end-actions");
  ui.statLevels = document.getElementById("stat-levels");
  ui.statDifficulty = document.getElementById("stat-difficulty");
  ui.statPresses = document.getElementById("stat-presses");
  ui.statTime = document.getElementById("stat-time");
  ui.newBest = document.getElementById("new-best");
  ui.shareButton = document.getElementById("share-button");
  ui.playAgain = document.getElementById("play-again");
}

// Reads this difficulty's level time from config.js and turns seconds into milliseconds
function getLevelTimeMs(difficulty) {
  var seconds = Number(window.CONFIG.levelTimeSeconds[difficulty]);
  if (!(seconds > 0)) {
    seconds = 7; // safety net if the number in config.js is missing or broken
  }
  return seconds * 1000;
}

// Connects the button, the keyboard, and the pause/end screen buttons
function connectInputs() {
  // pointerdown works for mouse, finger and pen, without double-counting
  ui.button.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return; // ignore right-clicks
    }
    press();
  });

  document.addEventListener("keydown", onKeyDown);

  ui.quitButton.addEventListener("click", pauseGame);
  ui.resumeButton.addEventListener("click", function () {
    ui.pauseDialog.close();
  });
  ui.quitConfirm.addEventListener("click", function () {
    window.location.href = "index.html";
  });
  // The dialog also closes with Esc. Either way, the game resumes.
  ui.pauseDialog.addEventListener("close", resumeGame);

  // Leaving the page mid-level (phone call, app switch) pauses the game
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      pauseGame();
    }
  });

  ui.playAgain.addEventListener("click", startRun);
  ui.shareButton.addEventListener("click", function () {
    openShareSheet(game.finishedRun, game.styleId);
  });
}

// Space or Enter press the button; Esc pauses
function onKeyDown(event) {
  if (ui.pauseDialog.open || game.phase === "over") {
    return; // let the dialog and the end screen buttons work normally
  }
  if (event.key === "Escape") {
    pauseGame();
    return;
  }
  if (event.key !== " " && event.key !== "Enter") {
    return;
  }
  if (event.target === ui.quitButton) {
    return; // Enter on the ✕ opens the pause dialog instead
  }
  event.preventDefault();
  if (!event.repeat) {
    press(); // holding a key down counts as one press, not many
  }
}


// ---------------------------------------------------------------------
// The run
// ---------------------------------------------------------------------

// Starts a new run from level 1
function startRun() {
  clearTimeout(game.levelTimerId);
  game.phase = "idle";
  game.level = 1;
  game.presses = 0;
  game.totalPresses = 0;
  game.pausedAt = 0;
  game.pausedTotalMs = 0;
  game.pendingStep = null;
  game.decks = {};
  game.lastConditionId = "";
  game.history = [];
  game.finishedRun = null;
  game.isNewBest = false;
  game.showHint = !hasSeenFirstGameHint();

  ui.end.hidden = true;
  ui.endActions.classList.remove("is-armed");
  ui.game.hidden = false;
  ui.game.classList.remove("is-quaking");
  hideBurst();
  resetRing();
  showLevelNumber(false);
  showCounter(false);
  showInstruction(window.TEXT.getReady);
  ui.hint.hidden = true;

  runAfter(START_DELAY_MS, startLevel);
}

// Starts the next level: new question, presses back to 0, timer running
function startLevel() {
  if (game.level === 1) {
    game.runStartedAt = Date.now();
    game.pausedTotalMs = 0;
  }

  game.condition = dealCondition();
  game.presses = 0;
  game.history.push({
    id: game.condition.id,
    text: game.condition.text,
    required: game.condition.answer,
    pressed: 0
  });

  hideBurst();
  showLevelNumber(game.level > 1);
  showCounter(false);
  showInstruction(game.condition.text);
  // The one-time tip: only on level 1 of a player's very first game
  ui.hint.hidden = !(game.showHint && game.level === 1);

  game.phase = "playing";
  startLevelTimer(game.levelTimeMs);
  restartRing();
}

// Counts one press of the button
function press() {
  if (game.phase !== "playing" || game.pausedAt !== 0) {
    return; // presses during transitions and pauses don't count
  }

  game.presses++;
  game.totalPresses++;
  game.history[game.history.length - 1].pressed = game.presses;

  animateButtonPress();
  vibrate();
  showCounter(true);

  // Instant fail: pressing more than the answer ends the run right away
  if (game.settings.instantFail && game.presses > game.condition.answer) {
    failLevel();
  }
}

// Called when the level's time runs out: right number of presses passes, anything else fails
function onTimeUp() {
  if (game.presses === game.condition.answer) {
    passLevel();
  } else {
    failLevel();
  }
}

// The level was passed: burst, then the next level
function passLevel() {
  game.phase = "between";
  rememberHintWasSeen();
  showBurst(pickRandom(window.TEXT.passBursts), "pass");
  runAfter(NEXT_LEVEL_DELAY_MS, function () {
    game.level++;
    startLevel();
  });
}

// The level was failed: the run is over
function failLevel() {
  game.phase = "over";
  clearTimeout(game.levelTimerId);
  game.runTimeMs = Date.now() - game.runStartedAt - game.pausedTotalMs;
  rememberHintWasSeen();

  // Save the run to the Personal Bests (only if it makes the top list)
  game.finishedRun = {
    levels: game.level - 1,
    difficulty: game.difficulty,
    presses: game.totalPresses,
    timeMs: game.runTimeMs,
    finishedAt: Date.now()
  };
  game.isNewBest = saveRunIfBest(game.finishedRun);

  freezeRing();
  showBurst(window.TEXT.failBurst, "fail");
  restartAnimation(ui.game, "is-quaking");

  setTimeout(showEndScreen, END_SCREEN_DELAY_MS);
}

// Once level 1 of the first game is over, the one-time tip never shows again
function rememberHintWasSeen() {
  if (game.showHint && game.level === 1) {
    markFirstGameHintSeen();
    game.showHint = false;
  }
}


// ---------------------------------------------------------------------
// Choosing questions
// ---------------------------------------------------------------------

// Deals the next question: picks a level using the weights, then takes the next card from that pile
function dealCondition() {
  var level = pickConditionLevel(game.settings.conditionWeights);
  var deck = game.decks[level];

  // The pile is new or empty: shuffle all questions of that level into a fresh pile
  if (!deck || deck.length === 0) {
    deck = shuffle(getConditionsOfLevel(level));
    // Don't show the same question twice in a row when a pile is reshuffled
    if (deck.length > 1 && deck[deck.length - 1].id === game.lastConditionId) {
      deck.unshift(deck.pop());
    }
    game.decks[level] = deck;
  }

  var condition = deck.pop();
  game.lastConditionId = condition.id;
  return condition;
}

// Picks a question level (1, 2 or 3) at random, following the weights from config.js
function pickConditionLevel(weights) {
  var total = 0;
  var level;
  for (level in weights) {
    if (getConditionsOfLevel(Number(level)).length > 0) {
      total += weights[level];
    }
  }

  var roll = Math.random() * total;
  for (level in weights) {
    if (getConditionsOfLevel(Number(level)).length > 0) {
      roll -= weights[level];
      if (roll < 0) {
        return Number(level);
      }
    }
  }
  return 1; // safety net
}

// Returns all questions of one level from conditions.js
function getConditionsOfLevel(level) {
  var result = [];
  for (var i = 0; i < window.CONDITIONS.length; i++) {
    if (window.CONDITIONS[i].level === level) {
      result.push(window.CONDITIONS[i]);
    }
  }
  return result;
}

// Returns a shuffled copy of a list (every order is equally likely)
function shuffle(list) {
  var copy = list.slice();
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// Returns one random item from a list
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}


// ---------------------------------------------------------------------
// Timer and pause
// ---------------------------------------------------------------------

// Starts the countdown for the current level
function startLevelTimer(durationMs) {
  clearTimeout(game.levelTimerId);
  game.levelEndsAt = Date.now() + durationMs;
  game.levelTimerId = setTimeout(onTimeUp, durationMs);
}

// Runs a step after a short delay; if the game is paused by then, waits for resume
function runAfter(delayMs, step) {
  setTimeout(function () {
    if (game.pausedAt !== 0) {
      game.pendingStep = step;
    } else {
      step();
    }
  }, delayMs);
}

// Pauses the game and opens the "Paused" dialog
function pauseGame() {
  if (game.phase === "over" || game.pausedAt !== 0) {
    return;
  }
  game.pausedAt = Date.now();

  if (game.phase === "playing") {
    game.levelTimeLeftMs = Math.max(0, game.levelEndsAt - game.pausedAt);
    clearTimeout(game.levelTimerId);
    freezeRing();
  }

  if (!ui.pauseDialog.open) {
    ui.pauseDialog.showModal();
  }
}

// Continues the game with the time that was left
function resumeGame() {
  if (game.pausedAt === 0) {
    return;
  }
  if (game.runStartedAt > 0) {
    game.pausedTotalMs += Date.now() - game.pausedAt;
  }
  game.pausedAt = 0;

  // The dialog gives focus back to the ✕. Move it away, so Space presses the button again.
  if (document.activeElement === ui.quitButton) {
    ui.quitButton.blur();
  }

  if (game.phase === "playing") {
    startLevelTimer(game.levelTimeLeftMs);
    unfreezeRing();
  }

  if (game.pendingStep) {
    var step = game.pendingStep;
    game.pendingStep = null;
    step();
  }
}


// ---------------------------------------------------------------------
// End screen
// ---------------------------------------------------------------------

// Fills in and shows the end screen
function showEndScreen() {
  var last = game.history[game.history.length - 1];
  var run = game.finishedRun;

  ui.endInstruction.textContent = last.text;
  ui.endRequired.textContent = last.required;
  ui.endPressed.textContent = last.pressed;
  ui.endDetails.hidden = !game.settings.showLevelDetailsAtEnd;

  ui.statLevels.textContent = run.levels;
  ui.statDifficulty.textContent = window.TEXT.difficultyNames[run.difficulty];
  ui.statPresses.textContent = run.presses;
  ui.statTime.textContent = formatRunTime(run.timeMs);
  ui.newBest.hidden = !game.isNewBest;

  ui.game.hidden = true;
  ui.end.hidden = false;
  ui.end.scrollTop = 0;
  ui.endTitle.focus();

  setTimeout(function () {
    ui.endActions.classList.add("is-armed");
  }, END_ACTIONS_ARM_MS);
}

// ---------------------------------------------------------------------
// What the player sees
// ---------------------------------------------------------------------

// Shows the level number with two digits (01, 02…), with a little bump if it changed
function showLevelNumber(bump) {
  ui.levelNumber.textContent = (game.level < 10 ? "0" : "") + game.level;
  if (bump) {
    restartAnimation(ui.levelNumber, "is-bumping");
  }
}

// Shows the presses so far under the button (Easy only)
function showCounter(bump) {
  ui.counter.textContent = game.presses;
  if (bump) {
    restartAnimation(ui.counter, "is-bumping");
  }
}

// Shows a new instruction text
function showInstruction(text) {
  ui.instruction.textContent = text;
  restartAnimation(ui.instruction, "is-new");
}

// Pushes the button in for a moment
function animateButtonPress() {
  ui.button.classList.add("is-pressed");
  clearTimeout(pressTimerId);
  pressTimerId = setTimeout(function () {
    ui.button.classList.remove("is-pressed");
  }, PRESS_ANIMATION_MS);
}

// A tiny buzz on phones that support it (iPhones don't, and that's fine)
function vibrate() {
  if (!navigator.vibrate) {
    return;
  }
  // Browsers only allow buzzing after the first completed tap on the page
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
    return;
  }
  navigator.vibrate(VIBRATION_MS);
}

// Shows a comic burst: kind is "pass" (POW!) or "fail" (KRAK!)
function showBurst(text, kind) {
  ui.burstText.textContent = text;
  ui.burst.className = "burst burst--" + kind;
  restartAnimation(ui.burst, "is-visible");
}

// Hides the comic burst
function hideBurst() {
  ui.burst.className = "burst";
}

// Fills the timer ring completely, without animating
function resetRing() {
  ui.ring.classList.remove("is-running", "is-paused");
}

// Starts the timer ring emptying over the level time
function restartRing() {
  ui.ring.style.setProperty("--level-time", game.levelTimeMs + "ms");
  ui.ring.classList.remove("is-paused");
  restartAnimation(ui.ring, "is-running");
}

// Stops the timer ring where it is
function freezeRing() {
  ui.ring.classList.add("is-paused");
}

// Lets the timer ring continue from where it stopped
function unfreezeRing() {
  ui.ring.classList.remove("is-paused");
}

// Plays a CSS animation again from the start, even if it just played
function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.getBoundingClientRect(); // forces the browser to notice the class was removed
  element.classList.add(className);
}


initGame();
