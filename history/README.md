# The Button Game

A one-button game of reflex and wit. Each level shows an instruction ("Press 3 times", "How many Koreas exist?"), and the player must press the button exactly that many times before the ring runs out. One mistake ends the run.

Made by **Levario** Independent Studio · 2026.

This guide explains every change you might want to make, in plain English. You only need a text editor (like VS Code) and a browser.

---

## What's in this folder

| File or folder | What it is | Will you edit it? |
|---|---|---|
| `index.html` | The main page (title, button picker, How to play…) | Yes, for landing page text |
| `game.html` | The game page | Rarely |
| `js/config.js` | Timers and game rules | **Yes**, for the timers |
| `js/conditions.js` | All the questions | **Yes** |
| `js/text.js` | All the words in the game | Yes |
| `js/button-styles.js` + `css/buttons.css` | The button skins | When adding a style |
| `manifest.webmanifest` | Makes the game installable on phones | Rarely |
| `sitemap.xml` + `robots.txt` | Tell Google which page to list | Only if the address changes |
| `assets/` | Fonts, icons, screenshots, the link preview picture | Rarely |
| `old.html` | The old prototype, kept for reference | **Never upload it** |
| Everything else in `js/` and `css/` | The machinery | No |

After any change: **save the file, then reload the page** in your browser.

---

## Try it on your computer

Double-click `index.html`. It opens in your browser and the whole game works.

Two things only work once the site is online: the phone's share menu, and link previews in chat apps.

---

## Put it online (Netlify)

**The first time**

1. Make sure the folder only holds the game: move out `old.html` (the old prototype) and your own notes, like `to modify.txt`. Anything in the folder becomes public.
2. Go to **app.netlify.com/drop** and drag the whole folder onto the page.
3. In your new site, go to **Site configuration → Change site name** and type `elbutton`. Your address becomes `https://elbutton.netlify.app`.
   If that name is taken, pick another one, then follow "Change the site address" below.

**To update the site later**

Open your site on Netlify, go to **Deploys**, and drag the folder onto the page again (still without `old.html` or your notes).

---

## Change the level timers

Open `js/config.js`. The timers are at the very top:

```js
levelTimeSeconds: {
  easy: 6,
  hard: 5
},
```

- These are **seconds**. Every level lasts exactly this long.
- Decimals are fine (`6.5`).
- Don't go below 4: players need time to read **and** tap up to 12 times.

The same file also controls which kind of question each mode picks, the live counter, and instant fail. Every line has a comment explaining it.

---

## Add, edit or remove a question

Open `js/conditions.js`. Each question is one line:

```js
{ id: "e051", level: 1, answer: 3, text: "Wheels on a tricycle.", note: "Tricycle = 3 wheels." },
```

| Part | Meaning |
|---|---|
| `id` | A unique name. `e` = easy, `h` = hard, `x` = extreme, then a number no other question uses |
| `level` | `1` easy, `2` hard, `3` extreme (extreme isn't playable yet) |
| `answer` | How many presses are correct. `0` means "don't press" |
| `text` | What the player reads. 60 characters maximum |
| `note` | Only for you: why the answer is right |

- **To add one:** copy a line, paste it next to the others of the same level, and change the values. Keep the comma at the end.
- **To remove one:** delete its whole line.
- **If the text needs a quote mark,** use a single one inside: `"Letters in 'CAT'."`

**Rules for a good question**
- Only **one** correct answer anywhere in the world. Avoid things that change by country or school: continents, oceans, planets, rainbow colors, months, seasons, weekend days.
- Answers from 0 to 12 (extreme can go up to 15).

---

## Change the landing page text

Open `index.html` and search for **`EDIT:`**. Every piece of text you can change has one of these notes above it: the title, the tagline, How to play, the Personal Bests window, the footer, and more.

- **Taglines:** three alternative taglines are written in a note right under the current one. Swap them freely.
- **The ⓘ explanation:** don't write exact seconds there. They'd be wrong as soon as you change the timers.
- The **page title and description** (what Google shows) are at the top of the file.

---

## Change the words in the game

Open `js/text.js`. Change only what's between the quotes:

```js
playAgain: "Play again",
```

Words in `{curly braces}` are filled in by the game (for example `{levels}` becomes `12`). Keep them as they are.

---

## Add a button style

1. In `js/button-styles.js`, copy a style block and change its `id`, `name` and `cssClass`.
2. In `css/buttons.css`, copy a whole style block (for example everything under **CLASSIC**), rename it to your `cssClass`, and change the colors.

To show a style with a padlock, set `locked: true` and write an `unlockHint` (for example `"Reach level 20"`).

In the picture players share, a new style appears as the Classic button until someone adds a drawing for it in `js/share.js`.

---

## Change the site address

The site lives at **https://elbutton.netlify.app**. The address is written in **four files**. If it ever changes, change it in all of them:

1. `js/config.js`: the `siteUrl` line (used for shared links).
2. `index.html`, in the lines near the top that contain `elbutton.netlify.app`: `canonical`, `og:url`, `og:image` and `twitter:image`. Link previews need the full address, which is why it's repeated there.
3. `sitemap.xml`
4. `robots.txt`

Tip: use your editor's "Find in Folder" and "Replace All" for `elbutton.netlify.app` to change everything at once.

---

## Help Google find the site

`sitemap.xml` lists the page Google should show in search results (only the main page: the game page is kept out on purpose). `robots.txt` tells search engines where that list is.

To get listed sooner:
1. Go to **Google Search Console** (search.google.com/search-console) and add `https://elbutton.netlify.app` as a property ("URL prefix").
2. Prove it's yours with the **HTML file** option: download the small file Google gives you, put it in this folder, and upload the folder to Netlify again.
3. In **Sitemaps**, submit `sitemap.xml`.

When you make big changes to the main page, update the date inside `sitemap.xml` (`<lastmod>`).

---

## Switch the app icon

There are two icon designs in `assets/icons/`:
- **`last-second`**: the button seen from above, with a sliver of time left on the ring (the current one).
- **`smashed`**: the cracked button with a KRAK! burst.

To switch, replace `last-second` with `smashed` in three places:
1. The icon lines near the top of `index.html`
2. The same lines in `game.html`
3. `manifest.webmanifest`

---

## Languages

The globe menu (bottom left) shows English plus four languages marked "Coming soon". It only shows that more languages are planned: nothing gets translated.

- **To change the list:** edit it in `index.html` (search for `EDIT: language list`).
- **Adding real languages later:** not decided yet. If Google ranking matters, the best way is a separate copy of the page for each language (for example `/it/index.html`), rather than switching the text on the same page.

---

## Personal Bests

- The top 5 runs are saved **in the player's browser, on that device**. They don't move between phones or computers.
- Clearing the browser's website data erases them.
- Runs with 0 levels, and runs that were quit, are never saved.

---

## Pictures

| Picture | Where | Size to keep |
|---|---|---|
| Showcase screenshots | `assets/screenshots/landing.webp`, `game.webp`, `end.webp` | 600 × 1067 |
| Link preview (WhatsApp, X…) | `assets/og-image.png` | 1200 × 630, PNG |
| App icons | `assets/icons/` | See the file names |

To replace one, save the new picture with **the same name and size**. If you change the game's design, the screenshots should be retaken so they still match.

---

## Good to know (limitations)

- **Link previews are the same for everyone.** A shared link shows the same picture and title for every player, because the site is simple static pages. Personal previews ("Your friend beat the button 12 times") would need a small server function on Netlify later.
- **Personal Bests stay on one device** (see above).
- **No offline mode yet.** The game needs a connection to load the first time.
- **Sharing and link previews only work online**, not when you open the file on your computer.

---

## Fonts

The game uses **Bangers** (comic titles) and **Nunito** (everything else), stored in `assets/fonts/`. Both are free under the SIL Open Font License. The license files are in the same folder.
