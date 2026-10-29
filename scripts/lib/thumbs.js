// Draws game thumbnails (400x300 PNG) and the social-share image.
// Starter games get custom art; any other game gets a colourful placeholder
// with its title, so a missing thumbnail never breaks the site.

const { Img, mix } = require("./png");

const W = 400, H = 300;

// Small seeded random generator so a game's placeholder always looks the same.
function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function darken(hex, t) { return mix(hex, "#0b0820", t); }

function titleBand(img, title) {
  img.rect(0, H - 70, W, 70, "#0b082099");
  let px = 5;
  let lines = img.wrap(title, px, W - 40);
  if (lines.length > 1) { px = 4; lines = img.wrap(title, px, W - 40).slice(0, 2); }
  const lh = 9 * px, top = H - 35 - (lines.length * lh) / 2 + px;
  lines.forEach((l, i) => {
    img.text(l, W / 2 + px * 0.5, top + i * lh + px * 0.5, px, "#00000088");
    img.text(l, W / 2, top + i * lh, px, "#ffffff");
  });
}

const ART = {
  snake(img) {
    img.gradient("#1fd17a", "#0b6e4f");
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 10; x++)
        if ((x + y) % 2) img.rect(x * 40, y * 40, 40, 40, "#ffffff10");
    const body = [[2, 4], [3, 4], [4, 4], [5, 4], [5, 3], [5, 2], [6, 2], [7, 2], [8, 2]];
    body.forEach(([x, y], i) => img.roundRect(x * 40 + 3, y * 40 + 3, 34, 34, 10, mix("#d7ff5e", "#7cff3a", i / body.length)));
    img.circle(8 * 40 + 14, 2 * 40 + 14, 5, "#111");
    img.circle(8 * 40 + 28, 2 * 40 + 14, 5, "#111");
    img.circle(1 * 40 + 20, 1 * 40 + 22, 15, "#ff4d6d");
    img.rect(1 * 40 + 18, 1 * 40 + 2, 4, 8, "#5a3");
  },
  "memory-match"(img) {
    img.gradient("#ffcf5c", "#ff7eb3");
    const cols = ["#7c5cff", "#ffffff", "#7c5cff", "#3a86ff", "#ffffff", "#3a86ff"];
    cols.forEach((c, i) => {
      const x = 40 + (i % 3) * 112, y = 18 + Math.floor(i / 3) * 104;
      img.roundRect(x + 4, y + 6, 96, 92, 14, "#00000033");
      img.roundRect(x, y, 96, 92, 14, c);
      if (c === "#ffffff") {
        if (i === 1) img.star(x + 48, y + 46, 30, "#ffbf00");
        else img.circle(x + 48, y + 46, 26, "#ff4d6d");
      } else img.ring(x + 48, y + 46, 22, 6, "#ffffff55");
    });
  },
  "tic-tac-toe"(img) {
    img.gradient("#3a86ff", "#6a00f4");
    const x0 = 110, y0 = 22, s = 60;
    for (let i = 1; i < 3; i++) {
      img.line(x0 + i * s, y0, x0 + i * s, y0 + 3 * s, 8, "#ffffffcc");
      img.line(x0, y0 + i * s, x0 + 3 * s, y0 + i * s, 8, "#ffffffcc");
    }
    const X = (c, r) => {
      const cx = x0 + c * s + s / 2, cy = y0 + r * s + s / 2;
      img.line(cx - 17, cy - 17, cx + 17, cy + 17, 11, "#ff5d73");
      img.line(cx + 17, cy - 17, cx - 17, cy + 17, 11, "#ff5d73");
    };
    const O = (c, r) => img.ring(x0 + c * s + s / 2, y0 + r * s + s / 2, 21, 8, "#ffd23f");
    X(0, 0); O(1, 0); X(2, 0); O(0, 1); X(1, 1); O(2, 1); X(2, 2);
  },
  "number-merge"(img) {
    img.gradient("#ff9f1c", "#e85d04");
    img.roundRect(95, 12, 210, 210, 14, "#00000033");
    const vals = [2, 4, 8, "", 16, 32, "", 2, "", 64, 128, 4, 2, "", 8, 256];
    const colors = { 2: "#fff3e0", 4: "#ffe0b2", 8: "#ffb74d", 16: "#ff8a65", 32: "#ff7043", 64: "#f4511e", 128: "#ffd54f", 256: "#ffca28" };
    vals.forEach((v, i) => {
      const x = 103 + (i % 4) * 50, y = 20 + Math.floor(i / 4) * 50;
      img.roundRect(x, y, 44, 44, 7, v ? colors[v] : "#ffffff33");
      if (v) img.text(String(v), x + 22, y + 15, String(v).length > 2 ? 2 : 3, v < 8 ? "#6b3f12" : "#ffffff");
    });
  },
  "star-clicker"(img) {
    img.gradient("#2b1055", "#7597de");
    const r = rng("stars");
    for (let i = 0; i < 40; i++) img.circle(r() * W, r() * (H - 70), r() * 2 + 0.6, "#ffffffaa");
    img.circle(200, 112, 92, "#ffd23f22");
    img.circle(200, 112, 74, "#ffd23f33");
    img.star(200, 116, 70, "#c98a00");
    img.star(200, 112, 70, "#ffd23f");
    img.star(200, 112, 40, "#fff3b0");
    img.text("+1", 310, 50, 5, "#ffffff");
    img.text("+1", 92, 150, 4, "#ffffffcc");
  },
  "pixel-jumper"(img) {
    img.gradient("#5ec8ff", "#c6f1ff", false);
    img.circle(330, 50, 26, "#fff7b0");
    [[60, 60], [250, 90]].forEach(([x, y]) => { img.circle(x, y, 18, "#fff"); img.circle(x + 22, y - 6, 22, "#fff"); img.circle(x + 46, y, 17, "#fff"); });
    for (let x = 0; x < W; x += 32) {
      img.rect(x, 200, 32, 32, "#3fbf4a");
      img.rect(x, 210, 32, 22, "#8b5a2b");
      img.rect(x + 2, 214, 12, 6, "#a8743f");
    }
    [[150, 136], [182, 136], [214, 136]].forEach(([x, y]) => { img.rect(x, y, 32, 18, "#c97b3a"); img.rect(x + 2, y + 2, 28, 4, "#e09a5a"); });
    img.circle(198, 112, 8, "#ffd23f"); img.circle(262, 160, 8, "#ffd23f");
    img.roundRect(84, 158, 30, 42, 6, "#ff5d73");
    img.rect(92, 168, 6, 8, "#fff"); img.rect(102, 168, 6, 8, "#fff");
    img.rect(94, 171, 3, 4, "#111"); img.rect(104, 171, 3, 4, "#111");
    img.line(340, 120, 340, 200, 4, "#555");
    img.polygon([[342, 120], [372, 132], [342, 144]], "#ff5d73");
  }
};

Object.assign(ART, require("./thumbs-art"));

function placeholder(img, slug, color) {
  const r = rng(slug);
  img.gradient(color, darken(color, 0.55));
  for (let i = 0; i < 14; i++) {
    const kind = Math.floor(r() * 3), x = r() * W, y = r() * (H - 60), s = 10 + r() * 34, c = "#ffffff" + ["22", "33", "44"][i % 3];
    if (kind === 0) img.circle(x, y, s, c);
    else if (kind === 1) img.roundRect(x, y, s * 1.4, s * 1.4, 8, c);
    else img.star(x, y, s, c);
  }
  img.circle(W / 2, 105, 52, "#ffffff2a");
  img.polygon([[W / 2 - 18, 80], [W / 2 + 26, 105], [W / 2 - 18, 130]], "#ffffff");
}

function drawThumbnail({ slug, title, color = "#7c5cff" }) {
  const img = new Img(W, H, 2); // drawn in 400×300 units, saved at 800×600 for sharp cards on high-DPI screens
  if (ART[slug]) ART[slug](img);
  else placeholder(img, slug, color);
  titleBand(img, title);
  return img.toPNG();
}

// 1200x630 image used when a page is shared on social media.
function drawShareImage(siteName, colors) {
  const img = new Img(1200, 630);
  img.gradient("#7c5cff", "#ff5d73");
  const r = rng(siteName);
  for (let i = 0; i < 26; i++) {
    const c = colors[i % colors.length] + "aa", x = r() * 1200, y = r() * 630, s = 20 + r() * 50;
    if (i % 3 === 0) img.star(x, y, s, c);
    else if (i % 3 === 1) img.circle(x, y, s, c);
    else img.roundRect(x, y, s * 1.5, s * 1.5, 14, c);
  }
  img.roundRect(150, 205, 900, 220, 40, "#0b0820cc");
  let px = 16;
  while (img.textWidth(siteName, px) > 820 && px > 6) px--;
  img.text(siteName, 600, 315 - 3.5 * px, px, "#ffffff");
  img.text("FREE BROWSER GAMES", 600, 470, 6, "#ffffff");
  return img.toPNG();
}

module.exports = { drawThumbnail, drawShareImage, hasCustomArt: (slug) => !!ART[slug] };
