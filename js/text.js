/* =====================================================================
   TEXT.JS: every word on the game page, plus text the code creates
   =====================================================================

   Landing page text is NOT here. It is written directly in index.html
   (look for the <!-- EDIT: ... --> comments). That's better for Google.

   HOW TO EDIT A TEXT
   - Change only what is between the quotes "like this".
   - Keep the quotes, and keep the comma at the end of the line.
   - If your text needs a quote mark inside, use ’ (curly) instead of ".
   - Words in {curly braces} are filled in by the game. Keep them as they are.
     {times} becomes "time" or "times" (see timesWordOne / timesWordMany).

   Example: to rename the "Play again" button, change
       playAgain: "Play again",
   to
       playAgain: "One more try",
   ===================================================================== */

window.TEXT = {

  // ----- Difficulty names (end screen, and later the Personal Bests) -----
  difficultyNames: {
    easy: "Easy",
    hard: "Hard"
  },

  // "1 time" but "12 times"
  timesWordOne: "time",
  timesWordMany: "times",

  // ----- Game screen -----
  levelLabel: "Level",
  getReady: "Get ready…",
  // Shown once, under the question, on a player's very first game
  firstGameHint: "Tip: press, then wait for the ring to run out.",
  buttonLabel: "The button",       // read aloud by screen readers
  quitButtonLabel: "Pause or quit", // read aloud by screen readers (the ✕ button)

  // Comic bursts. One pass word is picked at random each time a level is passed.
  passBursts: ["POW!", "NICE!", "BAM!", "ZING!"],
  failBurst: "KRAK!",

  // ----- Pause dialog (opens with the ✕ button) -----
  pausedTitle: "Paused",
  pausedMessage: "Quit this run? It won’t be saved.",
  keepPlaying: "Keep playing",
  quitRun: "Quit",

  // ----- End screen -----
  gameOverTitle: "Game over",

  lastLevelTitle: "Last Level",
  requiredLabel: "Required:",
  youPressedLabel: "You pressed:",

  yourRunTitle: "Your Run",
  newBest: "NEW BEST!",            // badge when the run enters the Personal Bests
  levelsCompletedLabel: "Levels completed",
  difficultyLabel: "Difficulty",
  totalPressesLabel: "Total presses",
  totalTimeLabel: "Total time",

  share: "Share",
  playAgain: "Play again",
  home: "Home",

  // ----- Share sheet -----
  shareTitle: "Share your run",
  shareImageAlt: "Your result image",
  shareNow: "Share",
  downloadImage: "Download image",
  copyLink: "Copy link",
  copied: "Copied!",
  copyFailed: "Couldn’t copy. Try again.",
  closeLabel: "Close",             // read aloud by screen readers (the ✕ button)

  // The message sent with the image and the link
  shareMessage: "I beat the button {levels} {times} on {difficulty}. Can you beat me?",

  // The words drawn on the result image (the big number goes in between)
  shareImageTop: "I BEAT THE BUTTON",
  shareImageTimesOne: "TIME",
  shareImageTimesMany: "TIMES",

  // ----- Landing page -----
  lockedLabel: "Locked",           // after a locked style's name in the carousel

  // Banner shown when someone opens a friend's shared link
  friendBanner: "Your friend beat the button {levels} {times} on {difficulty}. Can you?"
};
