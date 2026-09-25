/* =====================================================================
   CONFIG.JS: all the tuning numbers for the game
   =====================================================================

   HOW TO EDIT THIS FILE
   - Change a number, save the file, and reload the page. That's it.
   - Keep the commas at the end of lines exactly where they are.
   - Text after // is a comment. It is only there to explain things.

   THE THINGS YOU WILL CHANGE MOST OFTEN ARE THE LEVEL TIMERS, right below.

   Example: to give Easy players 8 seconds per level, change
       easy: 5,
   to
       easy: 8,
   ===================================================================== */

window.CONFIG = {

  // ⏱ LEVEL TIMERS: how long every level lasts, in SECONDS.
  // Change these two numbers to make the game easier or harder.
  // Decimals are fine (e.g. 6.5). Every level of a run lasts exactly this long.
  // Keep it at 4 or more: players need time to read the question AND tap up to 12 times.
  levelTimeSeconds: {
    easy: 5,
    hard: 5
    // extreme: decided later
  },

  // DIFFICULTIES: how each mode behaves.
  difficulties: {

    easy: {
      // Which kind of question is picked, as a share of 1.
      // 1 = easy questions, 2 = hard questions. 0.7 means 70% of the time.
      conditionWeights: { 1: 0.7, 2: 0.3 },
      instantFail: true,          // true = pressing too many times ends the run immediately
      showLiveCounter: true,      // true = shows how many times you pressed, under the button
      showLevelDetailsAtEnd: true // true = end screen shows "Required: X · You pressed: Y"
    },

    hard: {
      conditionWeights: { 1: 0.15, 2: 0.7, 3: 0.15 },
      instantFail: true,
      showLiveCounter: false,
      // OWNER DECISION PENDING: consider revealing the correct answer on Hard too.
      // Change false to true to do it.
      showLevelDetailsAtEnd: false
    }

    // extreme (future, not playable in v1.0):
    // { conditionWeights: { 3: 1 }, instantFail: false, showLiveCounter: false, showLevelDetailsAtEnd: false }
  },

  // How many best runs are kept on the landing page (Easy and Hard together).
  leaderboardSize: 5,

  // The address of the website. Used in shared links.
  // If it changes, also change it in the <head> of index.html, in sitemap.xml and in robots.txt.
  siteUrl: "https://elbutton.netlify.app"
};
