# The Button Game — v1.0 Build Specification

> **For the AI coding agent.** Read this whole document before writing any code. Where this spec is explicit, follow it exactly. Where it is silent, choose the simplest solution that a non-technical owner can maintain. If something here is impossible or contradictory, stop and say so instead of guessing.

---

## 0. Context & Principles

- **Product:** a one-button reflex-and-wit game. Each level shows an instruction ("Press 3 times", "How many Koreas exist?"). The player must press the button exactly the right number of times before the timer ends. One mistake ends the run.
- **Owner:** Levario Independent Studio. The owner is **non-technical** and will edit content files by hand.
- **Stack:** HTML, CSS, vanilla JavaScript. **No frameworks, no build step, no npm, no bundler.** The site must work by opening files from a static host (Netlify).
- **Starting point:** the original prototype (game loop, timer ring, button press animation) is saved as `old.html`, for reference only. Reuse its game logic ideas. **Replace its visual design entirely** (see §3), and drop the "OS 2.0" text and the flag row. `index.html` is the new landing page. Nothing links to `old.html`, and it is not deployed (see §11).
- **Local tools are allowed for making assets.** The agent may use tools on the owner's computer (headless Chrome, ImageMagick, curl…) to create PNG images or download font files. The site itself must never depend on them: no build step, no npm packages, and nothing to install to run or edit it.

**Maintainability rules (non-negotiable):**
1. Content (questions, button styles, game text, tuning numbers) lives in separate, heavily commented files. It never lives inside the game logic.
2. Content files are plain JavaScript files that assign to a global (e.g. `window.CONDITIONS = [...]`). **Do not use JSON + `fetch()`**, because it fails when files are opened locally.
3. Every content file begins with a comment block explaining, in plain English, how to add, edit, or remove an entry, with one copy-paste example.
4. No clever code. Prefer readable over short. Add a one-line comment above every function.
5. **Landing page text is written directly in the HTML, never injected by JavaScript.** Search engines and link-preview bots read the HTML without running JavaScript, and text that appears late hurts Lighthouse scores. See §2.3.

---

## 1. File Structure

```
/
├── index.html              Landing page
├── game.html               Game page
├── old.html                Original prototype (reference only, not deployed)
├── manifest.webmanifest    PWA manifest (installable later)
├── css/
│   ├── base.css            Design tokens, reset, typography, shared components
│   ├── landing.css
│   ├── game.css
│   └── buttons.css         One CSS block per button style
├── js/
│   ├── config.js           All tuning numbers (timers, weights, limits)
│   ├── text.js             All game page text + text created by JavaScript
│   ├── conditions.js       All questions / riddles
│   ├── button-styles.js    Registry of button styles
│   ├── storage.js          All localStorage read/write in one place
│   ├── share.js            Result image generation + sharing
│   ├── landing.js
│   └── game.js
├── assets/
│   ├── fonts/              Self-hosted font files + their licenses
│   ├── icons/              App icons (both concepts, all sizes)
│   └── screenshots/        SVG showcase images
└── README.md               Plain-English guide for the owner
```

---

## 2. Content Files (the owner edits these)

### 2.1 `conditions.js` — questions

Each condition:

```js
{
  id: "e001",                 // unique; prefix e = level 1, h = level 2, x = level 3
  level: 1,                   // 1 = easy, 2 = hard, 3 = extreme
  answer: 3,                  // number of presses required (0 allowed)
  text: "Press 3 times.",
  note: "Straight instruction" // optional: why the answer is correct / source
}
```

**Quantity required for v1.0:**
- **50 × level 1**
- **50 × level 2**
- **15 × level 3.** These are written and stored but not playable yet, for the future Extreme mode.

**Level 1: direct or very simple.**
- Direct instructions: "Press 4 times."
- Trivial riddles:
  - "Press once for every day of the week." (7)
  - "Rings in the Audi logo." (4)
  - "Wheels on a tricycle." (3)
- Include a few "Don't press." (0) conditions, about 5% of the pool. They are a signature moment.

**Level 2: indirect, requires thinking.**
- Simple math: "Press (12 ÷ 4) + 2 times." (5)
- General knowledge:
  - "How many Koreas exist?" (2)
  - "Players on a volleyball team on court." (6)
- Mild tricks: "Press the number of letters in 'CAT'." (3)

**Level 3: extreme.** Multi-step logic, trick wording, and larger mental math.

**Hard rules for every condition:**
1. **One indisputable answer worldwide.** Avoid anything that varies by country or education system. Examples to avoid: number of continents, number of oceans, "planets" (Pluto debate), and holiday dates.
2. **Answers must be between 0 and 12.** Level 3 may go up to 15. Nobody enjoys tapping 31 times. The fixed level timers in §2.4 are sized so that reading plus 12 taps fits.
3. Text length: at most 60 characters, so it fits one or two lines on a phone.
4. No duplicate answers-by-wording (e.g. two different ways of saying "Press 3 times" at level 1 are fine, identical text is not).
5. Put the answer in `note` for every riddle so the owner can verify it.

### 2.2 `button-styles.js` — button skins

```js
{
  id: "classic",
  name: "Classic",
  cssClass: "btn-style--classic", // defined in css/buttons.css
  locked: false,
  unlockHint: ""                  // shown later when locked: e.g. "Reach level 20"
}
```

- **Ship 3 styles.** All unlocked for v1.0. Suggested styles:
  - **Classic:** the arcade red mushroom button.
  - **Panic:** a yellow/black hazard stripe ring with a red dome.
  - **Comic Pop:** a flat comic button with a halftone texture and thick outline.
- Each style uses **the same HTML structure**, and only CSS differs. Adding a new style means one entry in the JS file plus one CSS block in `buttons.css`. Document this in the file header.
- Locked styles show in the carousel with a padlock and the unlock hint. They cannot be selected, and tapping one gives a gentle shake.

### 2.3 Where text lives

v1.0 is **English only**, and there is **no translation system**: no `t()` helper and no language keys. How languages will be added is not decided yet (see §14).

**Text on the landing page is written directly in `index.html`.**
- This covers the title, tagline, carousel labels, difficulty names, the ⓘ popover, How to play, the Personal Bests modal (heading, column names, empty state), showcase captions, the language menu, and the footer.
- Mark each editable spot with an HTML comment such as `<!-- EDIT: tagline -->` so the owner can find it.
- Why: search engines and link-preview bots (WhatsApp, Telegram, X…) read the HTML without running JavaScript. Text injected by JS is invisible to them, and it also appears late, which hurts Lighthouse Performance.

**All text on the game page, and any text JavaScript creates, comes from `js/text.js`.**
- The game page has no search value, so all its text lives in one file. That way the owner has a single place to edit game text.
- `game.html` holds empty elements marked `data-text="key"`, and a small helper fills them from `text.js` on load.
- It is a flat English object: `window.TEXT = { playAgain: "Play again", ... }`, grouped by screen with comments.
- It covers the game screen labels, the pause dialog, the end screen, the "NEW BEST!" badge, burst words (POW!, NICE!, KRAK!), the friend banner sentence, the share image text, the share message, and toasts ("Copied!").
- Sentences with numbers use placeholders, e.g. `"Your friend beat the button {levels} times on {difficulty}. Can you?"`.
- **No hardcoded strings in JS.** Everything a player can read either sits in `index.html` or comes from `text.js`.

### 2.4 `config.js` — tuning

```js
window.CONFIG = {

  // ⏱ LEVEL TIMERS: how long every level lasts, in SECONDS.
  // Change these two numbers to make the game easier or harder.
  // Decimals are fine (e.g. 6.5). Every level of a run lasts exactly this long.
  // Keep it at 4 or more: players need time to read the question AND tap up to 12 times.
  levelTimeSeconds: {
    easy: 7,
    hard: 6
    // extreme: decided later
  },

  difficulties: {
    easy: {
      conditionWeights: { 1: 0.7, 2: 0.3 },
      instantFail: true,       // pressing too many times ends the run immediately
      showLiveCounter: true,
      showLevelDetailsAtEnd: true
    },
    hard: {
      conditionWeights: { 1: 0.3, 2: 0.7 },
      instantFail: true,
      showLiveCounter: false,
      showLevelDetailsAtEnd: false
    }
    // extreme (future, not playable in v1.0):
    // { conditionWeights: { 3: 1 }, instantFail: false, showLiveCounter: false, showLevelDetailsAtEnd: false }
  },

  leaderboardSize: 5,          // how many best runs are kept (all difficulties together)
  // Not final yet. If it changes, also change it in the <head> of index.html (see §7).
  siteUrl: "https://thebuttongame.netlify.app"
};
```

The level timers sit at the very top of the file so the owner can find them in seconds. The game converts seconds to milliseconds internally.

**Level time** = `levelTimeSeconds[difficulty]`. That's it.
- It is **the same for every level of the run**, including "Don't press" (0) levels.
- There is **no speed-up** in v1.0. The timer never gets shorter as the run goes on.
- Why the same time for "Don't press" levels: a shorter timer would make the ring move visibly faster and give the trick away.

---

## 3. Visual Design: "Comic, with Apple restraint"

**Direction:** a bold comic-book look (thick black outlines, halftone dots, offset hard shadows, burst shapes) with clean, calm layout and excellent readability. The instruction text must be the most readable thing on screen at all times. Comic decoration never competes with it.

**Tokens (in `base.css` as CSS variables):**
- Colors: paper cream background (`#FFF6E5`-ish), ink black, and one hero red (the button). Add a yellow accent for bursts and a blue for info. Define a dark theme under `prefers-color-scheme: dark`.
- Fonts, **self-hosted** in `assets/fonts/` as `.woff2` files, with fallbacks:
  - **Bangers** or a similar comic display face for titles and big numbers only.
  - A highly readable rounded sans for everything else (e.g. **Nunito**).
  - Download the files once from Google Fonts and include each font's license (`OFL.txt`).
  - **Don't load fonts from Google's servers.** It's slower, and German courts have ruled that it breaks EU privacy law (GDPR) because it sends visitors' IP addresses to Google.
- Outline: 3px ink. Hard shadow: `4px 4px 0 ink`. Radius: 14–20px.

**Motion:**
- Snappy, springy transitions of 150–350ms.
- Respect `prefers-reduced-motion`: disable shakes, bursts, and parallax.

**Feedback:**
- On a correct level, show a small "POW!" / "NICE!" burst.
- On failure, show a comic "KRAK!" burst and a screen shake.
- Use `navigator.vibrate(15)` on each press where supported. Skip silently on iOS.

---

## 4. Landing Page (`index.html`)

Top to bottom:

1. **Hero**
   - Big comic title **"THE BUTTON GAME"**.
   - Beside or under it, a small **"v1.0"** badge inside an explosive comic burst shape (SVG).
2. **Tagline / CTA line**
   - Default: **"It's just one button. How hard can it be?"**
   - Keep these alternates as HTML comments right next to the tagline in `index.html` so the owner can swap:
     - "How long can you resist pressing it?"
     - "Read carefully. Press precisely."
     - "One button. Zero mercy."
3. **Button style carousel**
   - Shows a live preview of the actual button with ‹ › arrows. Swipe also works on touch.
   - Shows the style name and dots indicating position.
   - The selection is saved to localStorage and restored on the next visit.
4. **Difficulty selector:** two segmented options, **Easy** and **Hard**.
   - Next to it is an **ⓘ** button.
   - Tap or click it to open a small popover explaining the difference: timer, question mix, live counter, and end-screen details. It closes on outside tap or Esc.
   - Describe the timer as "more time" / "less time". **Don't write the exact seconds** in the popover, or it goes stale when the owner edits `config.js`.
   - **Do not rely on hover.** It must work on touch.
   - Selection is saved to localStorage.
5. **Primary CTA:** a large "PLAY" button that goes to `game.html`.
6. **How to play:** a visible section with 3 short comic steps. It helps new players, and it gives Google real text to read.
   1. **Read.** Every level gives you an instruction or a riddle.
   2. **Press.** Press the button exactly that many times. Sometimes that's zero.
   3. **Wait.** The level ends when the ring runs out. One press too many: KRAK!
   - Below the steps, one line saying it's free, runs in the browser on phone or computer, and needs no download or sign-up.
   - Stacked on mobile, 3 in a row on desktop.
7. **Showcase:** 3 SVG screenshots (see §9), horizontally scrollable on mobile and in a row on desktop.
8. **Footer:** "Made by **Levario** Independent Studio · 2026".
   - "Levario" links to `https://levario.netlify.app` and opens in a new tab with `rel="noopener"`.
   - It always sits at the bottom of the screen, even when the page is shorter than the screen.

**Personal Bests button:**
- A trophy icon button, fixed at the **bottom-right**. It mirrors the language globe at the bottom-left.
- Tapping it opens the **Personal Bests modal** (see §6). The modal closes with its ✕, Esc, or a tap outside it.

**Language menu (a teaser, not a feature):**
- Its purpose is to show visitors that more languages are coming.
- A small globe icon, fixed at the **bottom-left**.
- Tap it to open a small menu:
  - **English** is active, with a checkmark.
  - 4 more languages, written in their own language, are greyed out with a "Coming soon" label: **Română, Русский, Italiano, Українська** (the same languages as the prototype's flags).
  - Tapping a greyed-out language does nothing except a gentle shake.
- The menu is plain HTML in `index.html`, so the owner can edit the list.
- **Do not build any translation mechanism.** No language switching, no re-rendering, no language keys.

**Shared-link banner:**
- If the URL contains `?l=<number>&d=<easy|hard>`, show a dismissible banner at the top: "Your friend beat the button **12** times on **Hard**. Can you?" The sentence comes from `text.js`.
- The banner's button starts that difficulty.
- **Invalid links are ignored.** If `l` isn't a whole number from 0 to 9999, or `d` isn't `easy` or `hard`, show no banner.

---

## 5. Game Page (`game.html`)

**Layout (mobile-first, centered):**
- Level number at top.
- The button with a circular timer ring around it.
- The instruction text below.
- A small ✕ at the top-left to quit to the landing page, with a confirmation.

**Pause:**
- Tapping ✕ **pauses** the level and opens a dialog: "Paused. Quit this run?" with **Keep playing** and **Quit**.
  - While paused, the timer stops and the question is hidden behind the dialog.
  - **Keep playing** (or Esc) resumes with the time that was left.
  - **Quit** goes to the landing page. The run is not saved.
- The same pause happens automatically if the player leaves the page mid-level (phone call, app switch), so a run isn't lost to an interruption.
- Paused time doesn't count toward the run's total time.

**Flow per level:**
1. Pick a condition based on the difficulty's `conditionWeights`.
   - **No repeats within a run.** Shuffle each pool once per run and deal from it. If a pool runs out, reshuffle.
2. Show the instruction.
3. Start the timer ring. Its length is the difficulty's fixed level time from §2.4, the same for every level.
4. Count presses.
   - **Easy** shows a live counter under the button.
   - **Hard** shows nothing.
5. **Instant fail** (controlled by `instantFail` in `config.js`):
   - **Easy and Hard (`true`):** if presses exceed the answer, fail immediately. Don't make the player wait.
   - **Future Extreme (`false`):** keep counting silently and judge only when the timer ends. The player doesn't learn they've already failed.
   - Read the flag from config. Never hardcode a check on the difficulty name.
6. When the timer ends:
   - If presses equal the answer, the level is passed. Show the burst and go to the next level after about 700ms.
   - Otherwise, the run is over.

**One-time hint:**
- On a player's **very first game only**, level 1 shows a small hint under the instruction: "Tip: press, then wait for the ring to run out."
- Once that level ends (passed or failed), the hint is saved as seen and never shows again on this device.

**Input rules:**
- Use **`pointerdown`** only (not mousedown + touchstart, which double-fire).
- Add `touch-action: manipulation` on the button.
- **Keyboard:** Space or Enter presses the button on desktop.
- Ignore presses during transitions.

**Run tracking (across all levels):**
- Total presses in the run (all levels, including the failed one).
- Total run time, from the first level start to game over.
- Per level: the condition, required presses, and actual presses.

---

## 6. End Screen & Personal Bests

The end screen has **two clearly separated cards**.

**Card A: "Last Level"**
- The instruction that ended the run.
- Easy only: **Required: X · You pressed: Y**.
- Hard: shows the instruction only.
- `// OWNER DECISION PENDING: consider revealing the correct answer on Hard too.` This is controlled by `showLevelDetailsAtEnd` in `config.js`.

**Card B: "Your Run"**
- Levels completed
- Difficulty
- Total presses
- Total time as `m:ss`
- A "NEW BEST!" badge if this run entered the Personal Bests (top `leaderboardSize`, currently 5).

**Actions:**
- **Share** (primary)
- **Play again**
- **Home**

**Personal Bests (localStorage, this device only):**
- Keep only the top `leaderboardSize` (5) runs **overall, Easy and Hard together**.
  - A finished run is saved only if it makes the top 5.
  - The run pushed down to 6th place is deleted. Nothing else is stored.
  - **Runs with 0 levels completed are never saved**, and never show "NEW BEST!".
  - **A quit run is never saved.** Only runs that end with a failed level count.
- Each saved run holds: levels completed, difficulty, total presses, total time, and the exact timestamp it finished.
- **Ranking:** levels completed, high to low.
  - **On a tie, the older run keeps its place.** A new run must beat a best, not match it.
  - Time and presses are shown but **not used for ranking**. With fixed timers, total time depends almost entirely on the number of levels. Total presses depends on which questions came up. Using either would decide ties by luck.
- The list lives in a **modal**, opened by the trophy button on the landing page (see §4). It is **one list** (no tabs). Each row shows rank, levels, difficulty (as a small Easy/Hard badge), presses, and time.
- If there are no runs yet, show a friendly empty state: "No runs yet. The button is waiting."

---

## 7. Share Feature

1. The Share button opens a **preview sheet** showing a generated result image, drawn on a `<canvas>` at 1080×1080.
   - The image is in comic style, with the big text **"I BEAT THE BUTTON 12 TIMES"** (from `text.js`).
   - It also shows the difficulty, total time, the button in the player's chosen style, and the site URL.
2. **Share:** use `navigator.share` with the image file (`navigator.canShare({ files })`) plus the text and link.
3. **Fallback** when sharing isn't supported (most desktops):
   - "Download image" (PNG).
   - "Copy link", which shows a "Copied!" toast.
4. The shared link is `CONFIG.siteUrl + "?l=<levels>&d=<difficulty>"`. It triggers the banner in §4.
5. Add static Open Graph and Twitter meta tags to `index.html`, using a generic 1200×630 promo image in `assets/`.
   - The image must be **PNG**, because chat apps don't show SVG previews. Create it with a local tool (see §0).
   - The tags need full addresses (`https://thebuttongame.netlify.app/assets/...`). They are plain HTML and can't read `config.js`, so the site address lives in **two places**: `config.js` and these tags. The README tells the owner to change both.

> **Known limitation to state in the README:** link previews in chat apps are the same for everyone because the site is static. Personalized link previews need a Netlify Function later.

"Levels completed" is what the share text counts: a player who fails on level 13 has beaten the button 12 times.

---

## 8. Mobile & Desktop Quality Bar

- Must feel native on iPhone SE (375px) up to large desktops.
- Use `100dvh` (not `100vh`) and safe-area insets (`env(safe-area-inset-*)`). The viewport meta tag includes `viewport-fit=cover`.
- **Remove the prototype's global `touchmove` preventDefault.** The landing page must scroll normally.
  - Only the game screen prevents scroll and bounce: `overscroll-behavior: none`, with `touch-action` set on the game area.
- **Remove `user-scalable=no`** from the landing page (accessibility). The game page may keep zoom disabled.
- All tap targets are at least 44×44px.
- Visible focus states for keyboard users.
- Buttons have `aria-label`s, and the popover and menus are accessible.
- **PWA-ready:**
  - Include `manifest.webmanifest` with name, icons, theme color, and `display: standalone`.
  - Use relative paths everywhere.
  - A service worker is **not** required yet.

---

## 9. Showcase Screenshots (SVG)

Create 3 stylized SVGs of the game inside a simple phone frame, saved in `assets/screenshots/`:
1. The landing page with the button carousel.
2. Mid-game: level 07, the instruction "How many Koreas exist?", and the timer ring two-thirds full.
3. The end screen with the two cards.

They must match the real UI's colors and fonts closely. They must be lightweight (under 40KB each) and hand-built as SVG, not embedded bitmaps.

---

## 10. App Icons

Build two icon concepts as SVG. The owner picks one later.

1. **"Smashed Button":** the red button cracked, with comic impact lines and a small "KRAK" burst.
2. **"The Last Second":** the red button seen from above, surrounded by a timer ring with only a sliver left. The concept is urgency in one glance.

For **each** concept, export (PNGs are created from the SVG with a local tool, see §0):
- `favicon.svg`
- 32×32 PNG
- 180×180 `apple-touch-icon`
- 192×192 and 512×512 PNG
- A 512×512 **maskable** version with safe padding

Both concepts must stay recognizable at 16px. Use Concept 2 as the default in `manifest.webmanifest`.

---

## 11. README.md (for the owner)

Write it in plain English with no jargon. Include:
- How to add or edit a question (with an example).
- How to add a button style.
- How to change the level timers (the two numbers at the top of `config.js`).
- How to change the tagline and other landing page text (in `index.html`, look for `EDIT:` comments).
- How to change game text (in `text.js`).
- How to edit the "Coming soon" language list.
- How to change the site address (it lives in two places: `config.js` and the `<head>` of `index.html`).
- How to deploy to Netlify (drag and drop the folder). Move `old.html` out of the folder first.

---

## 12. Build Order & Checkpoints

Build in three phases. **At each checkpoint, stop and wait for the owner** before starting the next phase.

**Phase 1: Playable core**
- `config.js`, `text.js`, `conditions.js` (all 115), `button-styles.js` + `buttons.css`, and `storage.js` (button style + difficulty only).
- The landing page: hero, tagline, carousel, difficulty + popover, PLAY, language menu, and footer.
- The game page, including the pause dialog and the end screen (without Share and "NEW BEST!").
- **Checkpoint:** the owner plays both difficulties to tune the timers, and checks every answer in `conditions.js`.

**Phase 2: Personal Bests, sharing & onboarding**
- Saving best runs, the trophy button and Personal Bests modal, "NEW BEST!", the share sheet and result image, and the friend banner.
- The Open Graph / Twitter tags and the 1200×630 preview image (moved here from Phase 3, because they're tested together with sharing).
- The "How to play" section and the one-time hint.
- **Checkpoint:** the owner tests sharing on a real phone. This needs the site deployed on Netlify, because phone sharing and link previews don't work from a local file.

**Phase 3: Assets & docs**
- Both icon concepts in all sizes, `manifest.webmanifest`, the 3 SVG showcase screenshots on the landing page, and the README.
- Then go through the Definition of Done.

---

## 13. Definition of Done

- [ ] All files in §1 exist. No framework or build step.
- [ ] 50 level-1, 50 level-2, and 15 level-3 conditions, all following the rules in §2.1.
- [ ] Easy and Hard behave exactly as `config.js` says. Changing a number there changes the game.
- [ ] Every level lasts exactly `levelTimeSeconds` for its difficulty, including "Don't press" levels.
- [ ] Instant fail follows the `instantFail` flag.
- [ ] No condition repeats within a run.
- [ ] Button style and difficulty persist after reload.
- [ ] Personal Bests keep only the top 5 runs overall and persist after reload.
- [ ] Personal Bests rank by levels, with the older run first on ties.
- [ ] The share sheet works on iOS Safari and Android Chrome. The download and copy fallback works on desktop.
- [ ] The `?l=&d=` banner appears and works.
- [ ] The trophy button opens the Personal Bests modal, and it closes with ✕, Esc, or a tap outside.
- [ ] The one-time hint appears on the first game only.
- [ ] The landing page scrolls on mobile, and the game screen does not bounce.
- [ ] No console errors. Works when opened locally and on Netlify.
- [ ] Lighthouse: Accessibility ≥ 95, Performance ≥ 90 on mobile.
- [ ] No "OS 2.0" and no flag row. Nothing links to `old.html`.
- [ ] Fonts load from `assets/fonts/`, never from Google's servers.
- [ ] Landing page text is present in the HTML source. With JavaScript turned off, the title, tagline, and all headings are still readable.
- [ ] Text created by JavaScript comes only from `text.js`.
- [ ] The language menu shows English plus "Coming soon" languages, and no translation code exists.

## 14. Out of Scope for v1.0

- **Extreme mode gameplay.** Only the data is included. Its timer is decided later. It will have **no instant fail** (`instantFail: false`).
- **Timer speed-up during a run.** The timer stays the same for every level. If runs on Easy get too long, a later option is to make harder questions more frequent as the run goes on, keeping the timer fixed.
- Global or online leaderboard
- Accounts
- Sound
- **Additional languages and any translation system.** The approach is not decided yet.
  - *Note for later:* if search ranking matters, give each language its own static page (e.g. `/it/index.html`), linked with `hreflang` tags. Don't switch text with JavaScript on one page, because search engines only index one language that way.
- Service worker / offline mode
- Unlock logic for button styles
