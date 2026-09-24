/* =====================================================================
   STORAGE.JS: everything the game remembers on this device
   =====================================================================

   All saving and loading happens in this file, using the browser's
   localStorage. Nothing is sent anywhere: it stays on the player's device.

   What is saved:
   - tbg.buttonStyle        the chosen button style (e.g. "classic")
   - tbg.difficulty         the chosen difficulty ("easy" or "hard")
   - tbg.bestRuns           the Personal Bests (top 5 runs, Easy and Hard together)
   - tbg.seenFirstGameHint  "yes" once the player has seen the first-game tip

   You normally don't need to edit this file.
   ===================================================================== */

var STORAGE_KEYS = {
  buttonStyle: "tbg.buttonStyle",
  difficulty: "tbg.difficulty",
  bestRuns: "tbg.bestRuns",
  seenFirstGameHint: "tbg.seenFirstGameHint"
};

// Reads a saved value, or returns the fallback if nothing is saved or storage is blocked
function readSaved(key, fallback) {
  try {
    var value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

// Saves a value, and silently does nothing if storage is blocked
function writeSaved(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Storage can be blocked (e.g. some private modes). The game still works.
  }
}

// Returns the first button style that isn't locked (the default for new players)
function getDefaultButtonStyle() {
  for (var i = 0; i < window.BUTTON_STYLES.length; i++) {
    if (!window.BUTTON_STYLES[i].locked) {
      return window.BUTTON_STYLES[i];
    }
  }
  return window.BUTTON_STYLES[0];
}

// Finds a button style by its id, or returns null if it doesn't exist
function findButtonStyle(id) {
  for (var i = 0; i < window.BUTTON_STYLES.length; i++) {
    if (window.BUTTON_STYLES[i].id === id) {
      return window.BUTTON_STYLES[i];
    }
  }
  return null;
}

// Returns the saved button style, falling back to the default if it's missing or locked
function loadButtonStyle() {
  var style = findButtonStyle(readSaved(STORAGE_KEYS.buttonStyle, ""));
  if (style === null || style.locked) {
    return getDefaultButtonStyle();
  }
  return style;
}

// Saves the chosen button style
function saveButtonStyle(styleId) {
  writeSaved(STORAGE_KEYS.buttonStyle, styleId);
}

// Returns the saved difficulty ("easy" or "hard"), falling back to "easy"
function loadDifficulty() {
  var difficulty = readSaved(STORAGE_KEYS.difficulty, "easy");
  if (!window.CONFIG.difficulties[difficulty]) {
    return "easy";
  }
  return difficulty;
}

// Saves the chosen difficulty
function saveDifficulty(difficulty) {
  writeSaved(STORAGE_KEYS.difficulty, difficulty);
}


// ---------------------------------------------------------------------
// Personal Bests
// A saved run looks like:
//   { levels: 12, difficulty: "hard", presses: 57, timeMs: 83000, finishedAt: 1790000000000 }
// ---------------------------------------------------------------------

// Returns the saved best runs, best first (an empty list if there are none)
function loadBestRuns() {
  var runs;
  try {
    runs = JSON.parse(readSaved(STORAGE_KEYS.bestRuns, "[]"));
  } catch (error) {
    return []; // saved data was damaged: start fresh
  }
  if (!Array.isArray(runs)) {
    return [];
  }

  var validRuns = [];
  for (var i = 0; i < runs.length; i++) {
    if (isValidRun(runs[i])) {
      validRuns.push(runs[i]);
    }
  }
  sortRuns(validRuns);
  return validRuns;
}

// Checks that a saved run has every part it needs (protects against damaged data)
function isValidRun(run) {
  return run !== null &&
    typeof run === "object" &&
    typeof run.levels === "number" &&
    typeof run.presses === "number" &&
    typeof run.timeMs === "number" &&
    typeof run.finishedAt === "number" &&
    Boolean(window.CONFIG.difficulties[run.difficulty]);
}

// Puts runs in ranking order: most levels first; on a tie, the older run stays ahead
function sortRuns(runs) {
  runs.sort(function (a, b) {
    if (a.levels !== b.levels) {
      return b.levels - a.levels;
    }
    return a.finishedAt - b.finishedAt;
  });
}

// Saves a finished run if it makes the top list. Returns true if it did ("NEW BEST!").
function saveRunIfBest(run) {
  if (run.levels < 1) {
    return false; // runs with 0 levels are never saved
  }

  var runs = loadBestRuns();
  runs.push(run);
  sortRuns(runs);
  runs = runs.slice(0, window.CONFIG.leaderboardSize);

  var madeTheList = runs.indexOf(run) !== -1;
  if (madeTheList) {
    writeSaved(STORAGE_KEYS.bestRuns, JSON.stringify(runs));
  }
  return madeTheList;
}


// ---------------------------------------------------------------------
// First-game hint
// ---------------------------------------------------------------------

// True if the player has already seen the first-game tip
function hasSeenFirstGameHint() {
  return readSaved(STORAGE_KEYS.seenFirstGameHint, "") === "yes";
}

// Remembers that the player has seen the first-game tip
function markFirstGameHintSeen() {
  writeSaved(STORAGE_KEYS.seenFirstGameHint, "yes");
}


// ---------------------------------------------------------------------
// Helpers for showing runs (used by the landing page, the game and sharing)
// ---------------------------------------------------------------------

// Turns milliseconds into m:ss (e.g. 83000 → "1:23")
function formatRunTime(ms) {
  var totalSeconds = Math.floor(ms / 1000);
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Fills the {placeholders} of a text from text.js, e.g. {levels} → 12
function fillPlaceholders(template, values) {
  return template.replace(/\{(\w+)\}/g, function (placeholder, name) {
    return name in values ? String(values[name]) : placeholder;
  });
}

// Returns the values a run sentence needs: {levels}, {times} and {difficulty}
function runSentenceValues(levels, difficulty) {
  return {
    levels: levels,
    times: levels === 1 ? window.TEXT.timesWordOne : window.TEXT.timesWordMany,
    difficulty: window.TEXT.difficultyNames[difficulty]
  };
}
