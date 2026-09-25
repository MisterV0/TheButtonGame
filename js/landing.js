/* =====================================================================
   LANDING.JS: makes the landing page interactive
   =====================================================================
   - the button style carousel
   - the difficulty choice
   - the ⓘ explanation and the language menu
   - the Personal Bests modal (trophy button)
   - the friend banner (when the page is opened from a shared link)

   You normally don't need to edit this file.
   Styles live in js/button-styles.js, texts in index.html.
   ===================================================================== */

var SWIPE_MIN_DISTANCE_PX = 40;   // how far a finger must slide to count as a swipe
var PRESS_ANIMATION_MS = 90;      // how long the preview button stays pushed in
var MAX_SHARED_LEVELS = 9999;     // shared links with a bigger number are ignored

var carouselIndex = 0;            // which style the carousel is showing
var pressTimerId = null;


// ---------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------

// Runs once when the page has loaded
function initLanding() {
  initCarousel();
  initDifficulty();
  setUpPopup("difficulty-info-toggle", "difficulty-info");
  setUpPopup("lang-toggle", "lang-menu");
  initComingSoonLanguages();
  initBestsModal();
  initFriendBanner();
}


// ---------------------------------------------------------------------
// Button style carousel
// ---------------------------------------------------------------------

// Opens the carousel on the saved style and connects the arrows and swipes
function initCarousel() {
  carouselIndex = window.BUTTON_STYLES.indexOf(loadButtonStyle());
  buildCarouselDots();
  showCarouselStyle(false);

  document.getElementById("style-prev").addEventListener("click", function () {
    moveCarousel(-1);
  });
  document.getElementById("style-next").addEventListener("click", function () {
    moveCarousel(1);
  });

  initCarouselPointer();
}

// Creates one dot per style under the carousel
function buildCarouselDots() {
  var dots = document.getElementById("style-dots");
  dots.textContent = "";
  for (var i = 0; i < window.BUTTON_STYLES.length; i++) {
    var dot = document.createElement("span");
    dot.className = "carousel__dot";
    dots.appendChild(dot);
  }
}

// Moves one style left (-1) or right (+1), going round at the ends
function moveCarousel(step) {
  var count = window.BUTTON_STYLES.length;
  carouselIndex = (carouselIndex + step + count) % count;
  showCarouselStyle(true);
}

// Shows the current style in the preview, and saves it if it isn't locked
function showCarouselStyle(animate) {
  var style = window.BUTTON_STYLES[carouselIndex];
  var preview = document.getElementById("style-preview");
  var hint = document.getElementById("style-hint");

  preview.className = "game-button " + style.cssClass;
  document.getElementById("style-name").textContent = style.locked
    ? style.name + " (" + window.TEXT.lockedLabel + ")"
    : style.name;

  document.getElementById("style-stage").classList.toggle("is-locked", style.locked);
  document.getElementById("style-lock").hidden = !style.locked;
  hint.textContent = style.unlockHint;
  hint.hidden = !(style.locked && style.unlockHint);

  var dots = document.getElementById("style-dots").children;
  for (var i = 0; i < dots.length; i++) {
    dots[i].classList.toggle("is-active", i === carouselIndex);
  }

  if (!style.locked) {
    saveButtonStyle(style.id);
  }
  if (animate) {
    restartAnimation(preview, "is-popping");
  }
}

// Handles taps (press the preview, or shake if locked) and sideways swipes on the preview
function initCarouselPointer() {
  var stage = document.getElementById("style-stage");
  var startX = null;
  var startY = null;

  stage.addEventListener("pointerdown", function (event) {
    startX = event.clientX;
    startY = event.clientY;
    pressPreview();
  });

  stage.addEventListener("pointerup", function (event) {
    if (startX === null) {
      return;
    }
    var movedX = event.clientX - startX;
    var movedY = event.clientY - startY;
    startX = null;
    if (Math.abs(movedX) > SWIPE_MIN_DISTANCE_PX && Math.abs(movedX) > Math.abs(movedY)) {
      moveCarousel(movedX < 0 ? 1 : -1);
    }
  });

  stage.addEventListener("pointercancel", function () {
    startX = null;
  });
}

// Pushes the preview button in for a moment, or shakes it if the style is locked
function pressPreview() {
  var style = window.BUTTON_STYLES[carouselIndex];
  var preview = document.getElementById("style-preview");

  if (style.locked) {
    restartAnimation(document.getElementById("style-stage"), "is-shaking");
    return;
  }

  preview.classList.add("is-pressed");
  clearTimeout(pressTimerId);
  pressTimerId = setTimeout(function () {
    preview.classList.remove("is-pressed");
  }, PRESS_ANIMATION_MS);
}


// ---------------------------------------------------------------------
// Difficulty
// ---------------------------------------------------------------------

// Selects the saved difficulty, and saves any new choice
function initDifficulty() {
  var saved = loadDifficulty();
  var radios = document.querySelectorAll('input[name="difficulty"]');

  for (var i = 0; i < radios.length; i++) {
    radios[i].checked = radios[i].value === saved;
    radios[i].addEventListener("change", function (event) {
      saveDifficulty(event.target.value);
      showDifficultyInfo(event.target.value);
    });
  }
  showDifficultyInfo(saved);
}

// Shows only the selected difficulty's explanation in the ⓘ popup
function showDifficultyInfo(difficulty) {
  var paragraphs = document.querySelectorAll("#difficulty-info [data-difficulty]");
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].hidden = paragraphs[i].getAttribute("data-difficulty") !== difficulty;
  }
}


// ---------------------------------------------------------------------
// Popups (the ⓘ explanation and the language menu)
// ---------------------------------------------------------------------

// Makes a button open and close a popup. It also closes on a tap outside or with Esc.
function setUpPopup(toggleId, popupId) {
  var toggle = document.getElementById(toggleId);
  var popup = document.getElementById(popupId);

  toggle.addEventListener("click", function () {
    setPopupOpen(toggle, popup, popup.hidden);
  });

  document.addEventListener("pointerdown", function (event) {
    var clickedInside = popup.contains(event.target) || toggle.contains(event.target);
    if (!popup.hidden && !clickedInside) {
      setPopupOpen(toggle, popup, false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !popup.hidden) {
      setPopupOpen(toggle, popup, false);
      toggle.focus();
    }
  });
}

// Shows or hides a popup and tells screen readers its state
function setPopupOpen(toggle, popup, open) {
  popup.hidden = !open;
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
}

// Makes "Coming soon" languages give a gentle shake instead of doing anything
function initComingSoonLanguages() {
  var items = document.querySelectorAll(".lang__item.is-soon");
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener("click", function (event) {
      restartAnimation(event.currentTarget, "is-shaking");
    });
  }
}


// ---------------------------------------------------------------------
// Personal Bests modal
// ---------------------------------------------------------------------

// Connects the trophy button, the ✕, and a tap outside the modal
function initBestsModal() {
  var dialog = document.getElementById("bests-dialog");

  document.getElementById("bests-open").addEventListener("click", function () {
    renderBests();
    dialog.showModal();
  });
  document.getElementById("bests-close").addEventListener("click", function () {
    dialog.close();
  });
  // A tap on the dark area around the modal lands on the dialog itself: close it
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  // Esc closes it too (the browser does that by itself)
}

// Fills the Personal Bests table with the saved runs, or shows the empty message
function renderBests() {
  var runs = loadBestRuns();
  var rows = document.getElementById("bests-rows");

  rows.textContent = "";
  for (var i = 0; i < runs.length; i++) {
    rows.appendChild(buildBestsRow(runs[i], i + 1));
  }

  document.getElementById("bests-table").hidden = runs.length === 0;
  document.getElementById("bests-empty").hidden = runs.length > 0;
}

// Builds one table row: rank, levels, Easy/Hard badge, presses, time
function buildBestsRow(run, rank) {
  var row = document.createElement("tr");

  var rankBadge = document.createElement("span");
  rankBadge.className = "bests__rank" + (rank === 1 ? " bests__rank--first" : "");
  rankBadge.textContent = rank;
  row.appendChild(buildCell(rankBadge));

  var levels = document.createElement("span");
  levels.className = "bests__levels";
  levels.textContent = run.levels;
  row.appendChild(buildCell(levels));

  var mode = document.createElement("span");
  mode.className = "difficulty-badge difficulty-badge--" + run.difficulty;
  mode.textContent = window.TEXT.difficultyNames[run.difficulty];
  row.appendChild(buildCell(mode));

  row.appendChild(buildCell(document.createTextNode(run.presses)));
  row.appendChild(buildCell(document.createTextNode(formatRunTime(run.timeMs))));
  return row;
}

// Wraps something in a table cell
function buildCell(content) {
  var cell = document.createElement("td");
  cell.appendChild(content);
  return cell;
}


// ---------------------------------------------------------------------
// Friend banner (…/?l=12&d=hard)
// ---------------------------------------------------------------------

// Shows the challenge banner if the page was opened from a valid shared link
function initFriendBanner() {
  var challenge = readSharedChallenge();
  if (challenge === null) {
    return;
  }

  var text = document.getElementById("friend-banner-text");
  fillWithBoldValues(text, window.TEXT.friendBanner, runSentenceValues(challenge.levels, challenge.difficulty));
  document.getElementById("friend-banner").hidden = false;

  document.getElementById("friend-banner-accept").addEventListener("click", function () {
    saveDifficulty(challenge.difficulty);
    window.location.href = "game.html";
  });
  document.getElementById("friend-banner-close").addEventListener("click", function () {
    document.getElementById("friend-banner").hidden = true;
    removeChallengeFromAddress();
  });
}

// Reads ?l= and &d= from the address. Returns null if they're missing or invalid.
function readSharedChallenge() {
  var params = new URLSearchParams(window.location.search);
  var levelsText = params.get("l");
  var difficulty = params.get("d");

  var levelsIsWholeNumber = levelsText !== null && /^[0-9]{1,4}$/.test(levelsText);
  var difficultyIsKnown = difficulty === "easy" || difficulty === "hard";
  if (!levelsIsWholeNumber || !difficultyIsKnown) {
    return null;
  }

  var levels = Number(levelsText);
  if (levels > MAX_SHARED_LEVELS) {
    return null;
  }
  return { levels: levels, difficulty: difficulty };
}

// Removes ?l=…&d=… from the address bar, so the banner doesn't come back on reload
function removeChallengeFromAddress() {
  try {
    window.history.replaceState(null, "", window.location.pathname);
  } catch (error) {
    // Not important if the browser refuses
  }
}

// Writes a text from text.js into an element, with the {placeholder} values in bold
function fillWithBoldValues(element, template, values) {
  element.textContent = "";
  var parts = template.split(/(\{\w+\})/); // keeps the {placeholders} as separate parts

  for (var i = 0; i < parts.length; i++) {
    var name = parts[i].slice(1, -1);
    var isPlaceholder = /^\{\w+\}$/.test(parts[i]) && name in values;

    if (isPlaceholder && name !== "times") {
      var bold = document.createElement("strong");
      bold.textContent = values[name];
      element.appendChild(bold);
    } else if (isPlaceholder) {
      element.appendChild(document.createTextNode(values[name]));
    } else {
      element.appendChild(document.createTextNode(parts[i]));
    }
  }
}


// ---------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------

// Plays a CSS animation again from the start, even if it just played
function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth; // forces the browser to notice the class was removed
  element.classList.add(className);
}


initLanding();
