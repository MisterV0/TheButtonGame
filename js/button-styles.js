/* =====================================================================
   BUTTON-STYLES.JS: the list of button skins players can choose
   =====================================================================

   Every style uses the same button. Only its look (CSS) changes.
   A style needs TWO things:
     1. One block in this file (below).
     2. One block of CSS in css/buttons.css, named like the cssClass here.

   {
     id: "neon",                     // unique name, lowercase, no spaces
     name: "Neon",                   // what players see in the carousel
     cssClass: "btn-style--neon",    // must match the CSS block in css/buttons.css
     locked: false,                  // true = shown with a padlock, can't be picked
     unlockHint: ""                  // shown when locked, e.g. "Reach level 20"
   },

   HOW TO ADD A STYLE
   1. Copy the example above (from { to },) and paste it at the end of the list.
   2. Change id, name and cssClass.
   3. In css/buttons.css, copy one of the existing style blocks, rename it
      to your cssClass, and change the colors.

   HOW TO REMOVE A STYLE
   Delete its block here (from { to },). You can leave its CSS; it does no harm.

   The FIRST unlocked style in the list is the default for new players.

   SHARE PICTURE: the result picture players share shows their button.
   A new style appears there as the Classic button, until someone adds
   a drawing for it in js/share.js (see drawButton).
   ===================================================================== */

window.BUTTON_STYLES = [
  {
    id: "classic",
    name: "Classic",
    cssClass: "btn-style--classic",
    locked: false,
    unlockHint: ""
  },
  {
    id: "panic",
    name: "Panic",
    cssClass: "btn-style--panic",
    locked: false,
    unlockHint: ""
  },
  {
    id: "comic",
    name: "Comic Pop",
    cssClass: "btn-style--comic",
    locked: false,
    unlockHint: ""
  }
];
