/* =====================================================================
   SHARE.JS: the result image and sharing
   =====================================================================
   When a run ends, the Share button opens a sheet with a picture of the
   result (drawn here, 1080 × 1080) and three ways to share it:
   - Share           the phone's own share menu (picture + message + link)
   - Download image  saves the picture (handy on computers)
   - Copy link       copies the challenge link for friends

   Words come from js/text.js. The site address comes from js/config.js.
   You normally don't need to edit this file.

   BUTTON STYLES: the picture shows the player's button. Classic, Panic and
   Comic Pop each have a drawing below (see drawButton). A style you add
   later is drawn like Classic until a drawing is added for it here.
   ===================================================================== */

var SHARE_IMAGE_SIZE = 1080;
var SHARE_FILE_NAME = "the-button-game.png";

// Colors of the picture. Always the light theme, so it looks the same for everyone.
var SHARE_COLORS = {
  paper: "#FFF6E5",
  dots: "rgba(27, 27, 31, 0.07)",
  ink: "#1B1B1F",
  soft: "#5C564C",
  red: "#E5322D",
  redDark: "#A11D19",
  redLight: "#FF7B6B",
  yellow: "#FFD23F",
  track: "#F6EBD6",
  white: "#FFFFFF"
};

var DISPLAY_FONT = "Bangers, Impact, 'Arial Black', sans-serif";
var BODY_FONT = "Nunito, system-ui, -apple-system, 'Segoe UI', sans-serif";

// What the share sheet is currently showing
var shareState = {
  run: null,
  file: null,
  imageUrl: ""
};


// ---------------------------------------------------------------------
// The share sheet
// ---------------------------------------------------------------------

// Connects the share sheet buttons (called once by game.js)
function initShare() {
  var sheet = document.getElementById("share-sheet");

  document.getElementById("share-close").addEventListener("click", function () {
    sheet.close();
  });
  // A tap on the dark area around the sheet lands on the dialog itself: close it
  sheet.addEventListener("click", function (event) {
    if (event.target === sheet) {
      sheet.close();
    }
  });

  document.getElementById("share-native").addEventListener("click", shareWithPhone);
  document.getElementById("share-download").addEventListener("click", downloadShareImage);
  document.getElementById("share-copy").addEventListener("click", copyShareLink);
}

// Draws the result picture for a run, then opens the share sheet
function openShareSheet(run, styleId) {
  shareState.run = run;

  drawShareImage(run, styleId).then(function (blob) {
    if (shareState.imageUrl) {
      URL.revokeObjectURL(shareState.imageUrl); // free the previous picture
    }
    shareState.imageUrl = URL.createObjectURL(blob);
    shareState.file = new File([blob], SHARE_FILE_NAME, { type: "image/png" });

    var image = document.getElementById("share-image");
    image.src = shareState.imageUrl;
    image.alt = window.TEXT.shareImageAlt;

    // The Share button only appears where the device can share pictures (most phones)
    document.getElementById("share-native").hidden = !canShareFiles(shareState.file);
    document.getElementById("share-sheet").showModal();
  });
}

// True if this device can share a picture through its own share menu
function canShareFiles(file) {
  try {
    return Boolean(navigator.canShare) && navigator.canShare({ files: [file] });
  } catch (error) {
    return false;
  }
}

// Opens the phone's share menu with the picture, the message and the link
function shareWithPhone() {
  navigator.share({
    files: [shareState.file],
    text: buildShareMessage(shareState.run) + " " + buildShareLink(shareState.run)
  }).catch(function () {
    // The player closed the share menu without sharing: nothing to do
  });
}

// Saves the picture as a PNG file
function downloadShareImage() {
  var link = document.createElement("a");
  link.href = shareState.imageUrl;
  link.download = SHARE_FILE_NAME;
  document.getElementById("share-sheet").appendChild(link);
  link.click();
  link.remove();
}

// Copies the challenge link, then says "Copied!"
function copyShareLink() {
  var link = buildShareLink(shareState.run);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(function () {
      showToast(window.TEXT.copied);
    }, function () {
      copyWithOldMethod(link);
    });
  } else {
    copyWithOldMethod(link);
  }
}

// The older way of copying, for browsers without the modern clipboard
function copyWithOldMethod(text) {
  var box = document.createElement("textarea");
  box.value = text;
  box.setAttribute("readonly", "");
  box.style.position = "fixed";
  box.style.opacity = "0";
  document.getElementById("share-sheet").appendChild(box);
  box.select();

  var copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }
  box.remove();
  showToast(copied ? window.TEXT.copied : window.TEXT.copyFailed);
}

// Shows a short message at the bottom of the screen for a moment
function showToast(message) {
  var toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("is-showing");
  void toast.offsetWidth; // forces the browser to notice, so the animation plays again
  toast.classList.add("is-showing");
}

// Builds the link friends open, e.g. https://elbutton.netlify.app/?l=12&d=hard
function buildShareLink(run) {
  var siteUrl = window.CONFIG.siteUrl.replace(/\/+$/, ""); // without a slash at the end
  return siteUrl + "/?l=" + run.levels + "&d=" + run.difficulty;
}

// Builds the message sent with the picture, e.g. "I beat the button 12 times on Hard…"
function buildShareMessage(run) {
  return fillPlaceholders(window.TEXT.shareMessage, runSentenceValues(run.levels, run.difficulty));
}


// ---------------------------------------------------------------------
// The result picture (1080 × 1080)
// ---------------------------------------------------------------------

// Draws the whole picture and returns it as a PNG (a Promise that gives a Blob)
function drawShareImage(run, styleId) {
  return waitForFonts().then(function () {
    var canvas = document.createElement("canvas");
    canvas.width = SHARE_IMAGE_SIZE;
    canvas.height = SHARE_IMAGE_SIZE;
    var ctx = canvas.getContext("2d");

    drawPaper(ctx);
    drawHeadline(ctx, run);
    drawBottomRow(ctx, run, styleId);

    return new Promise(function (resolve) {
      canvas.toBlob(resolve, "image/png");
    });
  });
}

// Makes sure the comic fonts are loaded before drawing (a canvas can't wait by itself)
function waitForFonts() {
  if (!document.fonts || !document.fonts.load) {
    return Promise.resolve();
  }
  return Promise.all([
    document.fonts.load("100px Bangers"),
    document.fonts.load("900 40px Nunito")
  ]).catch(function () {
    // If a font can't load, the picture is drawn with the backup fonts
  });
}

// Paper-colored background with faint halftone dots
function drawPaper(ctx) {
  ctx.fillStyle = SHARE_COLORS.paper;
  ctx.fillRect(0, 0, SHARE_IMAGE_SIZE, SHARE_IMAGE_SIZE);

  ctx.fillStyle = SHARE_COLORS.dots;
  for (var y = 12; y < SHARE_IMAGE_SIZE; y += 24) {
    for (var x = 12; x < SHARE_IMAGE_SIZE; x += 24) {
      circlePath(ctx, x, y, 2.6);
      ctx.fill();
    }
  }
}

// The top part: "I BEAT THE BUTTON", the big number in a burst, "TIMES"
function drawHeadline(ctx, run) {
  var middle = SHARE_IMAGE_SIZE / 2;

  drawComicText(ctx, window.TEXT.shareImageTop, middle, 150, {
    size: 116, fill: SHARE_COLORS.ink, shadow: SHARE_COLORS.red, shadowOffset: 6, maxWidth: 980
  });

  drawBurst(ctx, middle, 425, 208, 160, 16);

  // The more digits, the smaller the number, so it stays inside the burst
  var digits = String(run.levels).length;
  var numberSize = digits <= 2 ? 250 : (digits === 3 ? 190 : 150);
  drawComicText(ctx, String(run.levels), middle, 425, {
    size: numberSize, fill: SHARE_COLORS.red, outline: 12, shadow: SHARE_COLORS.ink, shadowOffset: 9
  });

  var timesWord = run.levels === 1 ? window.TEXT.shareImageTimesOne : window.TEXT.shareImageTimesMany;
  drawComicText(ctx, timesWord, middle, 700, {
    size: 116, fill: SHARE_COLORS.ink, shadow: SHARE_COLORS.red, shadowOffset: 6
  });
}

// The bottom row, centered: the player's button, then the difficulty and total time next to it
function drawBottomRow(ctx, run, styleId) {
  var rowY = 898;
  var ringRadius = 116;
  var ringOuterRadius = ringRadius + 12; // the ring's outline sticks out a little
  var gap = 44;

  var difficultyName = window.TEXT.difficultyNames[run.difficulty].toUpperCase();
  var timeText = window.TEXT.totalTimeLabel + ": " + formatRunTime(run.timeMs);
  var isHard = run.difficulty === "hard";

  // Measure the details, so the whole row can be centered
  ctx.font = "60px " + DISPLAY_FONT;
  var pillWidth = ctx.measureText(difficultyName).width + 60 * 0.9 + 6;
  ctx.font = "900 44px " + BODY_FONT;
  var timeWidth = ctx.measureText(timeText).width;
  var detailsWidth = Math.max(pillWidth, timeWidth);

  var rowWidth = ringOuterRadius * 2 + gap + detailsWidth;
  var left = (SHARE_IMAGE_SIZE - rowWidth) / 2;
  var buttonX = left + ringOuterRadius;
  var detailsLeft = left + ringOuterRadius * 2 + gap;

  drawTimerRing(ctx, buttonX, rowY, ringRadius);
  drawButton(ctx, styleId, buttonX, rowY, 88);

  drawPill(ctx, difficultyName, detailsLeft, rowY - 42, {
    size: 60,
    font: DISPLAY_FONT,
    fill: isHard ? SHARE_COLORS.red : SHARE_COLORS.yellow,
    textColor: isHard ? SHARE_COLORS.white : SHARE_COLORS.ink
  });

  ctx.textAlign = "left";
  ctx.fillStyle = SHARE_COLORS.ink;
  ctx.font = "900 44px " + BODY_FONT;
  ctx.fillText(timeText, detailsLeft, verticalCenterBaseline(ctx, timeText, rowY + 48));
}


// ---------------------------------------------------------------------
// Drawing the button (one drawing per style)
// ---------------------------------------------------------------------

// Draws the player's button. Unknown styles are drawn like Classic.
function drawButton(ctx, styleId, cx, cy, radius) {
  if (styleId === "panic") {
    drawPanicButton(ctx, cx, cy, radius);
  } else if (styleId === "comic") {
    drawComicButton(ctx, cx, cy, radius);
  } else {
    drawClassicButton(ctx, cx, cy, radius);
  }
}

// Classic: dark housing with a red mushroom dome
function drawClassicButton(ctx, cx, cy, r) {
  var line = r * 0.05;
  var depth = r * 0.1;

  circlePath(ctx, cx + r * 0.06, cy + r * 0.06, r);
  ctx.fillStyle = SHARE_COLORS.ink;
  ctx.fill();

  var housing = ctx.createRadialGradient(cx, cy - r * 0.3, r * 0.1, cx, cy, r);
  housing.addColorStop(0, "#4A4750");
  housing.addColorStop(1, "#242228");
  circlePath(ctx, cx, cy, r);
  ctx.fillStyle = housing;
  ctx.fill();
  outline(ctx, line);

  drawDome(ctx, cx, cy - depth * 0.5, r * 0.74, depth, line, SHARE_COLORS.redDark);
}

// Panic: yellow and black hazard stripes around a red dome
function drawPanicButton(ctx, cx, cy, r) {
  var line = r * 0.05;
  var depth = r * 0.08;
  var stripe = r * 0.1;

  circlePath(ctx, cx + r * 0.06, cy + r * 0.06, r);
  ctx.fillStyle = SHARE_COLORS.ink;
  ctx.fill();

  // Stripes, cut to the circle
  ctx.save();
  circlePath(ctx, cx, cy, r);
  ctx.clip();
  ctx.fillStyle = SHARE_COLORS.yellow;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = SHARE_COLORS.ink;
  for (var x = -r * 2; x < r * 2; x += stripe * 2) {
    ctx.fillRect(x, -r * 2, stripe, r * 4);
  }
  ctx.restore();
  circlePath(ctx, cx, cy, r);
  outline(ctx, line);

  // Black rim
  circlePath(ctx, cx, cy, r * 0.78);
  ctx.fillStyle = SHARE_COLORS.ink;
  ctx.fill();
  outline(ctx, line);

  drawDome(ctx, cx, cy - depth * 0.4, r * 0.64, depth, line, "#7A110E");
}

// Comic Pop: flat red circle, halftone dots, thick outline, hard shadow
function drawComicButton(ctx, cx, cy, r) {
  var shift = r * 0.08;

  circlePath(ctx, cx + shift, cy + shift, r);
  ctx.fillStyle = SHARE_COLORS.ink;
  ctx.fill();

  circlePath(ctx, cx, cy, r);
  ctx.fillStyle = SHARE_COLORS.red;
  ctx.fill();

  // Halftone dots, cut to the circle
  ctx.save();
  circlePath(ctx, cx, cy, r);
  ctx.clip();
  ctx.fillStyle = "rgba(120, 10, 8, 0.35)";
  var step = r * 0.12;
  for (var y = cy - r; y <= cy + r; y += step) {
    for (var x = cx - r; x <= cx + r; x += step) {
      circlePath(ctx, x, y, step * 0.32);
      ctx.fill();
    }
  }
  ctx.restore();

  circlePath(ctx, cx, cy, r);
  outline(ctx, r * 0.07);

  // White shine arc at the top left
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.7, Math.PI * 1.08, Math.PI * 1.42);
  ctx.lineWidth = r * 0.07;
  ctx.lineCap = "round";
  ctx.strokeStyle = SHARE_COLORS.white;
  ctx.stroke();
  ctx.lineCap = "butt";
}

// The red dome used by Classic and Panic: its dark side, its top, and the white shine
function drawDome(ctx, cx, cy, radius, depth, line, sideColor) {
  circlePath(ctx, cx, cy + depth, radius);
  ctx.fillStyle = sideColor;
  ctx.fill();
  outline(ctx, line);

  var top = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.4, radius * 0.05, cx, cy, radius);
  top.addColorStop(0, SHARE_COLORS.redLight);
  top.addColorStop(0.45, SHARE_COLORS.red);
  top.addColorStop(1, SHARE_COLORS.redDark);
  circlePath(ctx, cx, cy, radius);
  ctx.fillStyle = top;
  ctx.fill();
  outline(ctx, line);

  ctx.save();
  ctx.translate(cx - radius * 0.26, cy - radius * 0.55);
  ctx.rotate(-24 * Math.PI / 180);
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.32, radius * 0.19, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fill();
  ctx.restore();
}

// The timer ring around the button, with only a red sliver of time left
function drawTimerRing(ctx, cx, cy, radius) {
  var width = 16;

  circlePath(ctx, cx, cy, radius);
  ctx.lineWidth = width + 8;
  ctx.strokeStyle = SHARE_COLORS.ink;
  ctx.stroke();

  circlePath(ctx, cx, cy, radius);
  ctx.lineWidth = width;
  ctx.strokeStyle = SHARE_COLORS.track;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + 0.55);
  ctx.lineWidth = width;
  ctx.strokeStyle = SHARE_COLORS.red;
  ctx.stroke();
}


// ---------------------------------------------------------------------
// Small drawing helpers
// ---------------------------------------------------------------------

// Starts a circle shape (then fill or outline it)
function circlePath(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}

// Draws the ink outline of the current shape
function outline(ctx, width) {
  ctx.lineWidth = width;
  ctx.strokeStyle = SHARE_COLORS.ink;
  ctx.stroke();
}

// Starts a rectangle shape with rounded corners
function roundRectPath(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

// Draws comic text centered on (x, y): optional shadow, optional ink outline, then the color.
// If maxWidth is given, the text shrinks to fit.
function drawComicText(ctx, text, x, y, style) {
  var size = style.size;
  ctx.font = size + "px " + DISPLAY_FONT;
  var box = ctx.measureText(text);
  var inkWidth = box.actualBoundingBoxLeft + box.actualBoundingBoxRight;
  if (style.maxWidth && inkWidth > style.maxWidth) {
    size = Math.floor(size * style.maxWidth / inkWidth);
    ctx.font = size + "px " + DISPLAY_FONT;
    box = ctx.measureText(text);
  }

  // Place the text by the real outline of its letters (not their boxes), so it looks centered.
  // The shadow sits down-right, so everything moves up-left by half of it.
  var shift = (style.shadowOffset || 0) / 2;
  var left = x - (box.actualBoundingBoxRight - box.actualBoundingBoxLeft) / 2 - shift;
  var baseline = y + (box.actualBoundingBoxAscent - box.actualBoundingBoxDescent) / 2 - shift;

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";

  if (style.shadow) {
    var offset = style.shadowOffset;
    if (style.outline) {
      ctx.lineWidth = style.outline;
      ctx.strokeStyle = style.shadow;
      ctx.strokeText(text, left + offset, baseline + offset);
    }
    ctx.fillStyle = style.shadow;
    ctx.fillText(text, left + offset, baseline + offset);
  }
  if (style.outline) {
    ctx.lineWidth = style.outline;
    ctx.strokeStyle = SHARE_COLORS.ink;
    ctx.strokeText(text, left, baseline);
  }
  ctx.fillStyle = style.fill;
  ctx.fillText(text, left, baseline);
}

// Returns the baseline that puts a text's letters exactly centered on centerY (uses the current font)
function verticalCenterBaseline(ctx, text, centerY) {
  ctx.textBaseline = "alphabetic";
  var box = ctx.measureText(text);
  return centerY + (box.actualBoundingBoxAscent - box.actualBoundingBoxDescent) / 2;
}

// Draws a rounded label (like a sticker) whose left edge is at x, centered on y
function drawPill(ctx, text, x, y, style) {
  ctx.font = style.size + "px " + style.font;
  var paddingX = style.size * 0.45;
  var width = ctx.measureText(text).width + paddingX * 2;
  var height = style.size * 1.35;
  var top = y - height / 2;

  roundRectPath(ctx, x + 6, top + 6, width, height, height / 2);
  ctx.fillStyle = SHARE_COLORS.ink;
  ctx.fill();

  roundRectPath(ctx, x, top, width, height, height / 2);
  ctx.fillStyle = style.fill;
  ctx.fill();
  outline(ctx, 6);

  ctx.textAlign = "left";
  ctx.fillStyle = style.textColor;
  ctx.fillText(text, x + paddingX, verticalCenterBaseline(ctx, text, y));
}

// Draws a spiky comic burst (the star shape behind the big number), with a hard shadow
function drawBurst(ctx, cx, cy, outerRadius, innerRadius, spikes) {
  burstPath(ctx, cx + 10, cy + 10, outerRadius, innerRadius, spikes);
  ctx.fillStyle = SHARE_COLORS.ink;
  ctx.fill();

  burstPath(ctx, cx, cy, outerRadius, innerRadius, spikes);
  ctx.fillStyle = SHARE_COLORS.yellow;
  ctx.fill();
  ctx.lineJoin = "round";
  outline(ctx, 8);
}

// Starts a spiky burst shape (then fill or outline it)
function burstPath(ctx, cx, cy, outerRadius, innerRadius, spikes) {
  // Slightly uneven spikes look hand-drawn
  var spikeLengths = [1, 0.9, 0.97, 0.86, 1, 0.92, 0.95, 0.88];

  ctx.beginPath();
  for (var i = 0; i < spikes * 2; i++) {
    var angle = -Math.PI / 2 + i * Math.PI / spikes;
    var isTip = i % 2 === 0;
    var radius = isTip ? outerRadius * spikeLengths[(i / 2) % spikeLengths.length] : innerRadius;
    var x = cx + radius * Math.cos(angle);
    var y = cy + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}
