// Thumbnail art for the bundled games (400×300 canvas; the title band covers y ≥ 230).
// Each function draws a small scene with the Img helpers from png.js.

const sky = (img, a, b) => img.gradient(a, b, false);
const cloud = (img, x, y, s = 1, col = "#ffffffdd") => { img.circle(x, y, 16 * s, col); img.circle(x + 20 * s, y - 8 * s, 20 * s, col); img.circle(x + 40 * s, y, 15 * s, col); };
const car = (img, x, y, col) => { img.roundRect(x - 18, y - 30, 36, 60, 9, col); img.rect(x - 14, y - 16, 28, 12, "#1c2a4a"); img.rect(x - 13, y + 10, 26, 8, "#1c2a4a"); img.rect(x - 22, y - 22, 5, 14, "#222"); img.rect(x + 17, y - 22, 5, 14, "#222"); img.rect(x - 22, y + 8, 5, 14, "#222"); img.rect(x + 17, y + 8, 5, 14, "#222"); };
const ball = (img, x, y, r, col, hi = "#ffffff88") => { img.circle(x, y, r, col); img.circle(x - r * 0.3, y - r * 0.3, r * 0.3, hi); };
const blob = (img, x, y, r, col) => { img.circle(x, y, r, col); img.rect(x - r, y, r * 2, r * 0.5, col); img.circle(x - r * 0.35, y - r * 0.25, r * 0.22, "#fff"); img.circle(x + r * 0.35, y - r * 0.25, r * 0.22, "#fff"); img.circle(x - r * 0.3, y - r * 0.22, r * 0.1, "#111"); img.circle(x + r * 0.4, y - r * 0.22, r * 0.1, "#111"); };

module.exports = {
  "chess"(img) {
    img.gradient("#2d2346", "#120e22");
    for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) img.rect(c * 40, r * 40, 40, 40, (r + c) % 2 ? "#a87c5a" : "#efe0c4");
    const base = (x, y, col, w) => { img.roundRect(x - w, y - 10, w * 2, 12, 4, col); img.roundRect(x - w * 0.7, y - 18, w * 1.4, 10, 3, col); };
    // white king
    base(130, 205, "#ffffff", 32); img.polygon([[106, 190], [154, 190], [144, 110], [116, 110]], "#ffffff"); img.roundRect(108, 96, 44, 18, 6, "#ffffff");
    img.rect(126, 62, 8, 34, "#ffffff"); img.rect(116, 72, 28, 8, "#ffffff");
    // black queen
    base(270, 205, "#1f1a2e", 32); img.polygon([[246, 190], [294, 190], [284, 120], [256, 120]], "#1f1a2e"); img.roundRect(250, 106, 40, 18, 6, "#1f1a2e");
    for (const dx of [-18, -9, 0, 9, 18]) img.circle(270 + dx, 96 - (dx === 0 ? 8 : Math.abs(dx) === 9 ? 4 : 0), 6, "#1f1a2e");
    // pawns
    for (const [x, col] of [[200, "#ffffff"], [345, "#1f1a2e"], [55, "#1f1a2e"]]) { base(x, 210, col, 20); img.polygon([[x - 12, 195], [x + 12, 195], [x + 7, 160], [x - 7, 160]], col); img.circle(x, 152, 14, col); }
    img.ring(130, 140, 70, 4, "#ffd23f88");
  },
  "asteroid-dodge"(img) {
    sky(img, "#0b0626", "#2a1460");
    for (let i = 0; i < 40; i++) img.circle((i * 97) % 400, (i * 53) % 230, 1 + (i % 3) * 0.6, "#ffffffaa");
    [[90, 70, 30], [300, 50, 22], [250, 150, 36], [60, 170, 18]].forEach(([x, y, r]) => { img.circle(x, y, r, "#8a7a6e"); img.circle(x + r * 0.3, y - r * 0.2, r * 0.25, "#6e6158"); img.circle(x - r * 0.3, y + r * 0.3, r * 0.15, "#6e6158"); });
    img.polygon([[170, 160], [190, 110], [210, 160]], "#e8ecff"); img.rect(178, 160, 24, 30, "#e8ecff"); img.polygon([[178, 172], [164, 196], [178, 190]], "#ff5d73"); img.polygon([[202, 172], [216, 196], [202, 190]], "#ff5d73");
    img.circle(190, 150, 6, "#3a86ff"); img.polygon([[182, 190], [190, 222], [198, 190]], "#ff9f1c"); img.star(330, 190, 14, "#ffd23f");
  },
  "brick-bash"(img) {
    sky(img, "#1b2350", "#10162f");
    const cols = ["#ff5d73", "#ff9f1c", "#ffd23f", "#2ec4b6", "#3a86ff"];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) if ((r + c) % 6) img.roundRect(22 + c * 52, 18 + r * 24, 48, 20, 5, cols[r]);
    img.roundRect(150, 205, 100, 14, 7, "#e8ecff"); ball(img, 230, 170, 10, "#ffd23f");
    img.line(230, 170, 260, 200, 3, "#ffd23f55");
  },
  "star-defender"(img) {
    sky(img, "#0b0626", "#05030f");
    for (let i = 0; i < 50; i++) img.rect((i * 71) % 400, (i * 37) % 230, 2, 4, "#c8d2ff88");
    [[80, 50, "#ff5d73"], [160, 40, "#b15cff"], [240, 50, "#2ec4b6"], [320, 40, "#ff9f1c"], [120, 95, "#ffd23f"], [280, 95, "#4dabf7"]].forEach(([x, y, c]) => { img.circle(x, y, 22, c); img.rect(x - 22, y, 44, 6, c); img.circle(x, y - 6, 11, "#ffffffcc"); });
    img.polygon([[200, 160], [228, 215], [200, 203], [172, 215]], "#e8ecff"); img.polygon([[200, 160], [208, 200], [192, 200]], "#7c5cff");
    for (let y = 120; y < 150; y += 14) img.roundRect(198, y, 4, 10, 2, "#7cf7ff");
  },
  "buzzy-bee"(img) {
    sky(img, "#6cc3ff", "#d9f3ff"); cloud(img, 50, 50); cloud(img, 280, 70, 0.8);
    img.roundRect(290, -10, 60, 90, 10, "#2f9e44"); img.roundRect(284, 70, 72, 18, 7, "#237a35");
    img.roundRect(290, 165, 60, 80, 10, "#2f9e44"); img.roundRect(284, 160, 72, 18, 7, "#237a35");
    for (let i = 0; i < 5; i++) img.circle(320 + Math.cos(i * 1.26) * 9, 125 + Math.sin(i * 1.26) * 9, 7, "#ff8fc7"); img.circle(320, 125, 6, "#ffd23f");
    img.circle(150, 105, 34, "#ffd23f"); img.rect(132, 74, 9, 62, "#2b2b2b"); img.rect(152, 74, 9, 62, "#2b2b2b");
    img.circle(130, 75, 18, "#ffffffcc"); img.circle(160, 70, 16, "#ffffffaa"); img.circle(172, 98, 10, "#fff"); img.circle(175, 98, 5, "#111");
  },
  "mole-pop"(img) {
    sky(img, "#9be27b", "#5cb845");
    [[100, 110], [300, 110], [200, 190]].forEach(([x, y], i) => { img.circle(x, y - 20, 34, i === 1 ? "#ffcc33" : "#8d5b3c"); img.circle(x, y - 6, 16, i === 1 ? "#fff0a8" : "#d9a77f"); img.circle(x - 12, y - 32, 6, "#fff"); img.circle(x + 12, y - 32, 6, "#fff"); img.circle(x - 11, y - 31, 3, "#111"); img.circle(x + 13, y - 31, 3, "#111"); img.circle(x, y - 14, 6, "#ff8fa3"); img.rect(x - 50, y + 4, 100, 26, "#4a2f1d"); img.roundRect(x - 54, y + 8, 108, 16, 8, "#6b4a2f"); });
    img.roundRect(250, 20, 22, 70, 6, "#a0662e"); img.roundRect(215, 8, 90, 34, 10, "#868e96"); img.star(330, 60, 12, "#fff");
  },
  "fruit-catcher"(img) {
    sky(img, "#7fd0ff", "#e6f7ff");
    for (let i = 0; i < 3; i++) { img.rect(60 + i * 140, 0, 16, 40, "#8b5a2b"); img.circle(68 + i * 140, 10, 54, "#3fae4a"); }
    ball(img, 120, 110, 18, "#ff4d6d"); img.rect(118, 88, 4, 8, "#5a3"); ball(img, 220, 80, 16, "#ff9f1c"); ball(img, 290, 140, 14, "#b15cff"); img.circle(280, 136, 10, "#b15cff");
    img.polygon([[150, 175], [250, 175], [238, 225], [162, 225]], "#c98a46"); img.roundRect(144, 168, 112, 12, 6, "#e0a35c"); img.line(170, 180, 175, 222, 3, "#9a6630"); img.line(230, 180, 225, 222, 3, "#9a6630");
  },
  "desert-dash"(img) {
    sky(img, "#ff9a5a", "#ffe2a8"); img.circle(300, 60, 36, "#fff2b0");
    img.polygon([[0, 170], [100, 120], [220, 165], [330, 115], [400, 150], [400, 230], [0, 230]], "#f2c48d"); img.rect(0, 180, 400, 50, "#f7d08a");
    img.roundRect(270, 120, 20, 62, 10, "#2f9e44"); img.roundRect(256, 138, 12, 22, 5, "#2f9e44"); img.roundRect(292, 130, 12, 24, 5, "#2f9e44");
    img.circle(110, 150, 18, "#fd7e14"); img.circle(132, 138, 13, "#fd7e14"); img.polygon([[124, 128], [127, 112], [134, 128]], "#fd7e14"); img.polygon([[134, 128], [141, 113], [142, 130]], "#fd7e14");
    img.polygon([[94, 146], [70, 130], [76, 150]], "#f76707"); img.circle(140, 142, 4, "#fff"); img.circle(136, 136, 2.5, "#222"); img.rect(100, 165, 6, 15, "#e8590c"); img.rect(116, 165, 6, 15, "#e8590c");
  },
  "paddle-duel"(img) {
    sky(img, "#2a1450", "#14244a");
    for (let y = 10; y < 225; y += 24) img.rect(198, y, 4, 14, "#ffffff44");
    img.ring(200, 115, 46, 3, "#ffffff33");
    img.roundRect(30, 70, 16, 80, 8, "#ff7a8c"); img.roundRect(354, 90, 16, 80, 8, "#ffd23f");
    for (let i = 0; i < 6; i++) img.circle(150 + i * 14, 140 - i * 8, 3 + i, "#7cf7ff" + ["22", "33", "44", "66", "88", "aa"][i]); ball(img, 240, 92, 11, "#fff");
  },
  "bubble-shooter"(img) {
    sky(img, "#2b1d6b", "#140f33");
    const cols = ["#ff5d73", "#ffd23f", "#2ec4b6", "#3a86ff", "#b15cff"];
    for (let r = 0; r < 4; r++) for (let c = 0; c < (r % 2 ? 9 : 10); c++) ball(img, 22 + c * 40 + (r % 2 ? 20 : 0), 20 + r * 34, 19, cols[(r * 3 + c * 2) % 5]);
    img.circle(200, 225, 40, "#3a2c7a"); img.line(200, 210, 230, 160, 14, "#6c5ce7"); ball(img, 200, 205, 19, "#ffd23f");
    for (let i = 1; i < 6; i++) img.circle(200 + i * 12, 205 - i * 20, 3, "#ffffff88");
  },
  "trail-blazer"(img) {
    img.gradient("#07061c", "#130f3a");
    for (let i = 0; i <= 400; i += 25) img.rect(i, 0, 1, 230, "#ffffff0d"); for (let j = 0; j <= 230; j += 25) img.rect(0, j, 400, 1, "#ffffff0d");
    img.line(40, 180, 160, 180, 7, "#00e5ff"); img.line(160, 180, 160, 70, 7, "#00e5ff"); img.line(160, 70, 260, 70, 7, "#00e5ff");
    img.line(360, 40, 300, 40, 7, "#ff4fa3"); img.line(300, 40, 300, 150, 7, "#ff4fa3"); img.line(300, 150, 200, 150, 7, "#ff4fa3");
    img.circle(260, 70, 9, "#fff"); img.circle(200, 150, 9, "#fff"); img.ring(260, 70, 16, 3, "#00e5ff66"); img.ring(200, 150, 16, 3, "#ff4fa366");
  },
  "sliding-tiles"(img) {
    sky(img, "#2b1055", "#7597de"); img.roundRect(110, 10, 180, 180, 14, "#ffffff22");
    for (let i = 0; i < 15; i++) { const x = 118 + (i % 4) * 44, y = 18 + Math.floor(i / 4) * 44; img.roundRect(x, y, 40, 40, 8, i < 6 ? "#2ec4b6" : `#${["7c5cff", "9d6bff", "b15cff", "c06bff"][i % 4]}`); img.text(String(i + 1), x + 20, y + 13, 2, "#fff"); }
  },
  "light-switch"(img) {
    img.gradient("#1d1a3f", "#07061a");
    const on = [0, 2, 6, 7, 8, 12, 14, 16, 18, 22];
    for (let i = 0; i < 25; i++) { const x = 105 + (i % 5) * 40, y = 12 + Math.floor(i / 5) * 42; const lit = on.includes(i); img.roundRect(x, y, 34, 36, 8, lit ? "#3a2c00" : "#1e1b3a"); img.circle(x + 17, y + 18, 9, lit ? "#ffd23f" : "#ffffff14"); if (lit) img.circle(x + 17, y + 18, 14, "#ffd23f33"); }
  },
  "sudoku"(img) {
    img.gradient("#eef2ff", "#fde7f3"); img.roundRect(100, 8, 200, 214, 10, "#1c1638"); img.rect(106, 14, 188, 202, "#fff");
    for (let i = 1; i < 9; i++) { img.rect(106 + i * 21, 14, i % 3 ? 1 : 3, 202, "#1c1638"); img.rect(106, 14 + i * 22.4, 188, i % 3 ? 1 : 3, "#1c1638"); }
    const nums = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
    for (let i = 0; i < 81; i++) if (nums[i] !== ".") img.text(nums[i], 116 + (i % 9) * 21, 20 + Math.floor(i / 9) * 22.4, 2, i % 7 ? "#1c1638" : "#3a5bd9");
  },
  "gem-sweeper"(img) {
    img.gradient("#3d2a1a", "#1a1208");
    const open = new Set([12, 13, 14, 20, 21, 22, 23, 28, 29, 30, 31, 37, 38]);
    for (let i = 0; i < 48; i++) { const x = 60 + (i % 8) * 36, y = 8 + Math.floor(i / 8) * 36; img.roundRect(x, y, 32, 32, 5, open.has(i) ? "#e8d5b5" : "#7a5a3a"); if (open.has(i) && i % 3 === 0) img.text(String(1 + (i % 2)), x + 16, y + 9, 2, i % 2 ? "#2b8a3e" : "#3a86ff"); }
    img.polygon([[73, 132], [86, 120], [86, 144]], "#e03131"); img.rect(86, 120, 3, 30, "#ddd");
    img.polygon([[283, 46], [298, 32], [313, 46], [298, 66]], "#7cf7ff");
  },
  "word-scramble"(img) {
    img.gradient("#0f9b8e", "#1e5f9e");
    "PUZZLE".split("").forEach((ch, i) => { const x = 40 + i * 56, y = 40 + (i % 2) * 20; img.roundRect(x, y + 4, 48, 48, 10, "#b9d6f0"); img.roundRect(x, y, 48, 48, 10, "#fff"); img.text(ch, x + 24, y + 13, 4, "#1e5f9e"); });
    "LEZUPZ".split("").forEach((ch, i) => { const x = 60 + i * 48, y = 150; img.roundRect(x, y, 40, 40, 8, "#ffffff33"); img.text(ch, x + 20, y + 11, 3, "#fff"); });
  },
  "pipe-flow"(img) {
    img.gradient("#13284a", "#0a1528");
    for (let i = 0; i < 24; i++) img.rect(80 + (i % 6) * 40, 10 + Math.floor(i / 6) * 52, 40, 52, (i % 2) ^ (Math.floor(i / 6) % 2) ? "#13274a" : "#112241");
    img.line(100, 36, 220, 36, 14, "#4dabf7"); img.line(220, 36, 220, 140, 14, "#4dabf7"); img.line(220, 140, 300, 140, 14, "#4dabf7"); img.line(140, 36, 140, 190, 14, "#8a94a8"); img.line(260, 88, 300, 88, 14, "#8a94a8");
    img.circle(100, 36, 15, "#ffd23f"); img.circle(300, 140, 12, "#51cf66"); img.line(130, 36, 200, 36, 3, "#d0ebff");
  },
  "color-flood"(img) {
    const cols = ["#ff5d73", "#ffd23f", "#51cf66", "#4dabf7", "#b15cff", "#ff9f1c"];
    let s = 7; const r = () => (s = (s * 16807) % 2147483647) % 6;
    for (let y = 0; y < 10; y++) for (let x = 0; x < 14; x++) img.rect(x * 29, y * 23, 29, 23, x + y < 7 ? cols[3] : cols[r()]);
    img.rect(0, 0, 220, 6, "#ffffff00");
  },
  "pixel-logic"(img) {
    img.gradient("#fff4e6", "#e7f5ff");
    const pic = [".#.#.", "#####", "#####", ".###.", "..#.."];
    img.roundRect(120, 10, 210, 210, 14, "#fff");
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) img.rect(170 + c * 30, 54 + r * 30, 28, 28, pic[r][c] === "#" ? "#ff4f7b" : "#f1effb");
    ["1 1", "5", "5", "3", "1"].forEach((t, i) => img.text(t, 145, 62 + i * 30, 2, "#3a2a8a")); ["2", "4", "4", "4", "2"].forEach((t, i) => img.text(t, 184 + i * 30, 30, 2, "#3a2a8a"));
  },
  "gem-swap"(img) {
    img.gradient("#3b1f6e", "#120a2a");
    const cols = ["#ff4f7b", "#ffd23f", "#51cf66", "#4dabf7", "#b15cff", "#ff9f1c"];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { const x = 25 + c * 50, y = 25 + r * 52, k = (r * 5 + c * 3 + (c > 3 ? 1 : 0)) % 6; if (k % 2) img.circle(x, y, 20, cols[k]); else img.polygon([[x, y - 22], [x + 18, y], [x, y + 22], [x - 18, y]], cols[k]); img.circle(x - 6, y - 8, 5, "#ffffff99"); }
    img.star(330, 60, 20, "#fff");
  },
  "block-fit"(img) {
    img.gradient("#1f2a5a", "#101632"); img.roundRect(100, 8, 200, 200, 12, "#ffffff12");
    const cols = ["#ff5d73", "#ffd23f", "#51cf66", "#4dabf7", "#b15cff"];
    const filled = [[0, 0, 0], [0, 1, 0], [1, 0, 0], [3, 2, 1], [3, 3, 1], [4, 3, 1], [7, 0, 2], [7, 1, 2], [7, 2, 2], [7, 3, 2], [7, 4, 2], [7, 5, 2], [7, 6, 2], [6, 6, 3], [5, 6, 3], [2, 5, 4], [2, 6, 4], [3, 5, 4]];
    filled.forEach(([r, c, k]) => { img.roundRect(104 + c * 24.5, 12 + r * 24.5, 22, 22, 4, cols[k]); img.rect(108 + c * 24.5, 15 + r * 24.5, 14, 4, "#ffffff55"); });
    img.rect(104, 12 + 7 * 24.5, 196, 22, "#ffffff44");
  },
  "lane-racer"(img) {
    img.rect(0, 0, 400, 300, "#3fae4a"); img.rect(100, 0, 200, 230, "#495057"); img.rect(103, 0, 4, 230, "#fff"); img.rect(293, 0, 4, 230, "#fff");
    for (let l = 1; l < 4; l++) for (let y = 0; y < 230; y += 40) img.rect(98 + l * 50, y, 4, 22, "#ffffffcc");
    car(img, 125, 60, "#4dabf7"); car(img, 225, 30, "#ffd23f"); car(img, 275, 110, "#b15cff"); car(img, 175, 180, "#ff4f7b");
    img.circle(50, 50, 24, "#2b8a3e"); img.circle(350, 150, 24, "#2b8a3e"); img.circle(40, 170, 20, "#2b8a3e");
  },
  "drift-circuit"(img) {
    img.rect(0, 0, 400, 300, "#3a9d4a");
    img.ring(200, 120, 105, 46, "#e03131"); img.ring(200, 120, 101, 38, "#5c6070");
    img.ring(200, 120, 82, 1, "#ffffff55");
    for (let i = 0; i < 6; i++) img.rect(296 + (i % 2) * 6, 110 + Math.floor(i / 2) * 6, 6, 6, i % 2 ? "#111" : "#fff");
    img.line(120, 200, 180, 210, 5, "#2228"); img.line(124, 194, 182, 204, 5, "#2228");
    img.roundRect(176, 190, 40, 22, 6, "#ff4f7b"); img.rect(192, 193, 8, 16, "#1c2a4a"); img.circle(160, 205, 12, "#dddddd99");
  },
  "river-rush"(img) {
    img.rect(0, 0, 400, 300, "#3d9a4a"); img.polygon([[110, 0], [290, 0], [320, 230], [80, 230]], "#c9a26a"); img.polygon([[122, 0], [278, 0], [306, 230], [94, 230]], "#1c7ed6");
    for (let i = 0; i < 6; i++) img.line(140 + (i * 37) % 120, 20 + i * 36, 160 + (i * 37) % 120, 18 + i * 36, 2, "#ffffff55");
    img.circle(160, 70, 18, "#868e96"); img.circle(155, 65, 8, "#adb5bd"); img.roundRect(210, 110, 70, 18, 9, "#8b5a2b");
    img.polygon([[200, 140], [214, 170], [210, 210], [190, 210], [186, 170]], "#e8590c"); img.circle(200, 172, 7, "#ffd8a8"); img.line(170, 165, 230, 180, 3, "#5c3d1e");
    img.circle(40, 60, 22, "#2b8a3e"); img.circle(360, 130, 22, "#2b8a3e");
  },
  "kart-duel"(img) {
    img.rect(0, 0, 400, 300, "#e9b45f");
    img.ring(200, 115, 110, 50, "#3a86ff"); img.ring(200, 115, 106, 42, "#555a66");
    const kart = (_, x, y, col) => { img.rect(x - 14, y - 14, 8, 6, "#222"); img.rect(x + 6, y - 14, 8, 6, "#222"); img.rect(x - 14, y + 8, 8, 6, "#222"); img.rect(x + 6, y + 8, 8, 6, "#222"); img.roundRect(x - 16, y - 9, 32, 18, 6, col); img.circle(x - 2, y, 6, "#fff"); };
    kart(img, 110, 50, "#ff4f7b"); kart(img, 160, 34, "#4dabf7"); kart(img, 260, 36, "#ffd23f"); kart(img, 300, 60, "#51cf66");
    img.roundRect(185, 190, 34, 30, 6, "#ffb000"); img.polygon([[192, 197], [201, 205], [192, 213]], "#fff"); img.polygon([[203, 197], [212, 205], [203, 213]], "#fff");
    img.text("1ST", 60, 150, 4, "#ffffff"); img.circle(340, 180, 14, "#2f9e44");
  },
  "warp-racer"(img) {
    img.rect(0, 0, 400, 300, "#03010a");
    [110, 80, 56, 38, 26, 18].forEach((r, i) => img.ring(200, 110, r, Math.max(1.5, 4 - i * 0.5), ["#ff4fa3", "#b15cff", "#7c5cff", "#4dabf7", "#2ec4b6", "#7cf7ff"][i]));
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; img.line(200 + Math.cos(a) * 18, 110 + Math.sin(a) * 18, 200 + Math.cos(a) * 130, 110 + Math.sin(a) * 130, 1.5, "#ffffff22"); }
    img.ring(250, 100, 14, 4, "#50c8ff"); img.polygon([[170, 60], [200, 40], [195, 72]], "#ff4664");
    img.polygon([[200, 180], [232, 214], [200, 206], [168, 214]], "#e8ecff"); img.polygon([[192, 212], [200, 228], [208, 212]], "#7cf7ff");
  },
  "tap-sprint"(img) {
    sky(img, "#74c0fc", "#d0ebff"); img.rect(0, 40, 400, 50, "#495057");
    for (let i = 0; i < 40; i++) img.circle(5 + i * 10, 55 + (i % 3) * 10, 4, ["#ff5d73", "#ffd23f", "#4dabf7", "#51cf66"][i % 4]);
    img.rect(0, 90, 400, 140, "#d9480f"); for (let l = 0; l < 4; l++) img.rect(0, 92 + l * 35, 400, 2, "#fff");
    const runner = (_, x, y, col) => { img.line(x, y - 22, x + 10, y - 8, 4, "#5a3b22"); img.line(x, y - 22, x - 10, y - 6, 4, "#5a3b22"); img.roundRect(x - 6, y - 40, 12, 20, 4, col); img.circle(x + 2, y - 46, 6, "#8a5a36"); };
    runner(img, 140, 124, "#4dabf7"); runner(img, 200, 159, "#ff4f7b"); runner(img, 120, 194, "#ffd23f"); runner(img, 170, 229, "#51cf66");
    for (let i = 0; i < 8; i++) img.rect(330, 92 + i * 17.5, 8, 17.5, i % 2 ? "#111" : "#fff");
  },
  "night-drive"(img) {
    img.gradient("#0b0420", "#5a1a6e"); img.circle(200, 120, 56, "#ff4fa3");
    for (let i = 0; i < 5; i++) img.rect(140, 82 + i * 8, 120, 2 + i * 0.6, "#0b0420");
    img.polygon([[0, 120], [60, 90], [120, 120], [200, 95], [280, 120], [340, 92], [400, 120], [400, 130], [0, 130]], "#1a0b33");
    img.polygon([[188, 120], [212, 120], [400, 230], [0, 230]], "#2a2440"); img.polygon([[186, 120], [190, 120], [10, 230], [0, 230]], "#7cf7ff"); img.polygon([[210, 120], [214, 120], [400, 230], [390, 230]], "#ff4fa3");
    for (let i = 0; i < 4; i++) { const t = i / 4, y = 125 + t * t * 105, w = 2 + t * 6; img.rect(200 - w / 2, y, w, 6 + t * 12, "#ffffffcc"); }
    img.polygon([[150, 225], [160, 196], [240, 196], [250, 225]], "#ff4f7b"); img.rect(158, 212, 22, 5, "#ff2244"); img.rect(220, 212, 22, 5, "#ff2244");
  },
  "slalom-ski"(img) {
    img.gradient("#eaf2ff", "#ffffff");
    [[90, 40, "#e03131"], [250, 90, "#1c7ed6"], [130, 150, "#e03131"]].forEach(([x, y, c]) => { for (const s of [-1, 1]) { const fx = x + s * 40; img.rect(fx - 1.5, y - 30, 3, 30, "#555"); img.polygon([[fx, y - 30], [fx + s * 18, y - 24], [fx, y - 18]], c); } });
    [[330, 60], [40, 140], [320, 190]].forEach(([x, y]) => { img.polygon([[x, y - 40], [x + 18, y], [x - 18, y]], "#2b8a3e"); img.rect(x - 3, y, 6, 8, "#6b4420"); img.polygon([[x, y - 40], [x + 6, y - 30], [x - 6, y - 30]], "#fff"); });
    img.line(210, 120, 240, 200, 2, "#b8c8e8"); img.line(220, 120, 250, 200, 2, "#b8c8e8");
    img.line(195, 140, 215, 180, 3, "#1c1638"); img.line(205, 136, 225, 176, 3, "#1c1638"); img.roundRect(200, 132, 16, 22, 5, "#e03131"); img.circle(206, 124, 7, "#ffd8a8"); img.circle(206, 121, 7, "#ffd23f");
  },
  "penalty-kick"(img) {
    sky(img, "#1c3a6e", "#4a7fc0"); img.rect(0, 120, 400, 180, "#2b8a3e");
    for (let i = 0; i < 4; i++) img.rect(0, 140 + i * 24, 400, 12, "#2f9e44");
    img.rect(70, 40, 260, 90, "#ffffff22"); for (let i = 0; i <= 13; i++) img.rect(70 + i * 20, 40, 1, 90, "#ffffff44"); for (let j = 0; j <= 4; j++) img.rect(70, 40 + j * 22.5, 260, 1, "#ffffff44");
    img.rect(66, 36, 8, 94, "#fff"); img.rect(326, 36, 8, 94, "#fff"); img.rect(66, 36, 268, 8, "#fff");
    img.line(200, 80, 160, 60, 10, "#ffd23f"); img.line(200, 80, 240, 60, 10, "#ffd23f"); img.roundRect(190, 72, 20, 36, 6, "#ffd23f"); img.circle(200, 66, 9, "#c68a5a");
    ball(img, 200, 200, 22, "#fff", "#ddd"); img.circle(200, 200, 8, "#222"); img.circle(285, 70, 6, "#ffffffcc");
  },
  "hoop-shot"(img) {
    img.gradient("#2a1d52", "#6b3fa0"); img.rect(0, 200, 400, 100, "#c98a46");
    img.roundRect(300, 30, 12, 110, 3, "#fff"); img.rect(306, 80, 8, 120, "#888");
    img.line(250, 100, 300, 100, 5, "#ff6b2b");
    for (let i = 0; i <= 4; i++) img.line(250 + i * 12.5, 100, 258 + i * 9, 140, 1.5, "#ffffffcc");
    ball(img, 160, 80, 22, "#f76707"); img.line(138, 80, 182, 80, 2, "#7a2e00"); img.line(160, 58, 160, 102, 2, "#7a2e00");
    for (let i = 1; i < 6; i++) img.circle(160 - i * 18, 80 + i * i * 4, 3, "#ffffff77");
  },
  "mini-golf"(img) {
    img.rect(0, 0, 400, 300, "#6b4420"); img.roundRect(14, 12, 372, 210, 16, "#51cf66");
    for (let i = 0; i < 6; i++) img.rect(18, 16 + i * 34, 364, 17, "#4cc461");
    img.roundRect(150, 90, 120, 14, 5, "#a0662e"); img.roundRect(40, 140, 90, 50, 14, "#228be6"); img.circle(300, 160, 18, "#ff4f7b");
    img.circle(320, 50, 9, "#1a1a1a"); img.rect(320, 6, 3, 44, "#555"); img.polygon([[323, 6], [346, 14], [323, 22]], "#ff4f7b");
    img.circle(90, 60, 7, "#fff"); for (let i = 1; i < 6; i++) img.circle(90 + i * 22, 60 - i * 2, 2.5, "#ffffffaa");
  },
  "air-hockey"(img) {
    img.rect(0, 0, 400, 300, "#0b1b3a"); img.roundRect(70, 6, 260, 220, 26, "#e7f5ff");
    img.rect(80, 114, 240, 4, "#ff8787"); img.ring(200, 116, 34, 3, "#74c0fc"); img.rect(160, 6, 80, 8, "#1c2a4a");
    const mal = (x, y, c) => { img.circle(x, y, 24, c); img.circle(x, y, 16, "#ffffff44"); img.circle(x, y, 10, c); };
    mal(200, 50, "#ffd23f"); mal(170, 180, "#ff4f7b");
    img.circle(240, 120, 12, "#212529"); img.circle(240, 120, 7, "#495057"); for (let i = 1; i < 4; i++) img.circle(240 - i * 10, 130 + i * 10, 8 - i * 2, "#ff4f7b33");
  },
  "bowling-alley"(img) {
    img.gradient("#1a1033", "#2b2244"); img.polygon([[150, 0], [250, 0], [330, 230], [70, 230]], "#e9b47a");
    for (let i = 0; i < 6; i++) img.line(160 + i * 16, 0, 90 + i * 44, 230, 1, "#c08a50");
    [[200, 30], [188, 44], [212, 44], [176, 58], [200, 58], [224, 58]].forEach(([x, y]) => { img.roundRect(x - 6, y - 12, 12, 22, 6, "#fff"); img.rect(x - 6, y - 4, 12, 3, "#e03131"); });
    ball(img, 205, 170, 26, "#5b3fcf"); img.circle(198, 160, 4, "#1a1033"); img.circle(210, 158, 4, "#1a1033"); img.circle(204, 168, 4, "#1a1033");
    img.text("STRIKE!", 200, 100, 3, "#ffd23f");
  },
  "archery"(img) {
    sky(img, "#74c0fc", "#e7f5ff"); img.rect(0, 190, 400, 40, "#51cf66"); cloud(img, 40, 40);
    ["#fff", "#222", "#4dabf7", "#ff5d73", "#ffd23f"].forEach((c, i) => img.circle(300, 110, 70 - i * 14, c));
    img.line(140, 140, 296, 110, 4, "#5c3d1e"); img.polygon([[296, 104], [310, 110], [296, 116]], "#888"); img.rect(136, 134, 10, 12, "#ff4f7b");
    img.line(70, 80, 70, 180, 5, "#8b5a2b"); img.line(84, 120, 300, 112, 1, "#ffffff00");
    img.rect(30, 30, 3, 60, "#666"); img.polygon([[33, 30], [70, 40], [33, 50]], "#ff4f7b");
  },
  "hurdle-dash"(img) {
    sky(img, "#4dabf7", "#d0ebff"); img.rect(0, 40, 400, 40, "#495057"); for (let i = 0; i < 40; i++) img.circle(5 + i * 10, 52 + (i % 2) * 12, 4, ["#ff5d73", "#ffd23f", "#51cf66", "#b15cff"][i % 4]);
    img.rect(0, 80, 400, 70, "#37b24d"); img.rect(0, 150, 400, 60, "#d9480f"); img.rect(0, 150, 400, 2, "#fff"); img.rect(0, 208, 400, 2, "#fff"); img.rect(0, 210, 400, 20, "#37b24d");
    [80, 260].forEach((hx) => { img.rect(hx - 14, 150, 4, 40, "#adb5bd"); img.rect(hx + 10, 150, 4, 40, "#adb5bd"); img.rect(hx - 16, 146, 32, 10, "#fff"); img.rect(hx - 6, 146, 12, 10, "#e03131"); });
    img.line(170, 120, 196, 112, 5, "#5a3b22"); img.line(170, 120, 150, 132, 5, "#5a3b22"); img.roundRect(160, 92, 16, 28, 5, "#7c5cff"); img.circle(172, 84, 8, "#8a5a36"); img.line(166, 100, 190, 92, 4, "#5a3b22");
  },
  "bounce-volley"(img) {
    sky(img, "#4dabf7", "#d0ebff"); img.circle(340, 40, 26, "#fff3b0"); img.rect(0, 170, 400, 20, "#1c7ed6"); img.rect(0, 190, 400, 40, "#f2d38a");
    img.rect(197, 130, 6, 60, "#555"); img.rect(193, 126, 14, 6, "#fff");
    const bl = (x, c) => { img.circle(x, 190, 44, c); img.rect(x - 44, 190, 88, 40, "#f2d38a"); img.circle(x + (x < 200 ? 16 : -16), 170, 9, "#fff"); img.circle(x + (x < 200 ? 18 : -14), 170, 4, "#111"); };
    bl(100, "#ff4f7b"); bl(300, "#4dabf7"); ball(img, 160, 80, 14, "#fff"); img.ring(160, 80, 12, 3, "#ffd23f");
  },
  "balloon-pop"(img) {
    sky(img, "#74c0fc", "#e7f5ff"); cloud(img, 30, 160, 0.8);
    [[80, 80, "#ff4f6d"], [150, 50, "#4dabf7"], [220, 95, "#51cf66"], [290, 60, "#ffd23f"], [340, 120, "#b15cff"], [120, 150, "#ff9f1c"]].forEach(([x, y, c]) => { img.line(x, y + 30, x + 4, y + 70, 1.5, "#ffffffaa"); img.circle(x, y, 28, c); img.polygon([[x - 5, y + 30], [x + 5, y + 30], [x, y + 24]], c); img.circle(x - 9, y - 10, 6, "#ffffff77"); });
    for (let i = 0; i < 8; i++) img.rect(240 + Math.cos(i) * 30, 180 + Math.sin(i) * 20, 6, 6, ["#ff4f6d", "#ffd23f", "#51cf66"][i % 3]);
  },
  "doodle-pad"(img) {
    img.rect(0, 0, 400, 300, "#fff4e6"); img.roundRect(20, 10, 360, 210, 14, "#fff");
    for (let i = 0; i < 40; i++) img.circle(60 + i * 7, 150 - Math.sin(i / 5) * 50, 7, `#${["ff4f6d", "ff9f1c", "ffd23f", "51cf66", "4dabf7", "7c5cff"][Math.floor(i / 7) % 6]}`);
    img.star(300, 70, 26, "#ffd23f"); img.circle(110, 60, 22, "#ff8fc7"); img.circle(110, 60, 8, "#ffd23f");
    img.line(250, 200, 330, 120, 12, "#ffb000"); img.polygon([[322, 112], [342, 104], [334, 124]], "#f5d0a9");
  },
  "shape-sorter"(img) {
    img.gradient("#fff0f6", "#e7f5ff"); img.roundRect(40, 10, 320, 90, 18, "#d9a066");
    img.circle(100, 55, 26, "#6b4420"); img.star(200, 55, 30, "#6b4420"); img.polygon([[300, 30], [326, 78], [274, 78]], "#6b4420");
    img.circle(100, 170, 30, "#ff4f6d"); img.star(200, 165, 34, "#ffd23f"); img.polygon([[300, 140], [330, 196], [270, 196]], "#51cf66");
    for (const [x, y] of [[100, 165], [200, 160], [300, 175]]) { img.circle(x - 8, y - 4, 5, "#fff"); img.circle(x + 8, y - 4, 5, "#fff"); img.circle(x - 7, y - 3, 2.5, "#1c1638"); img.circle(x + 9, y - 3, 2.5, "#1c1638"); }
  },
  "counting-fun"(img) {
    img.gradient("#d3f9d8", "#fff3bf"); img.roundRect(30, 10, 340, 150, 24, "#fff");
    for (let i = 0; i < 6; i++) { const x = 80 + (i % 3) * 110, y = 55 + Math.floor(i / 3) * 60; img.circle(x, y, 22, "#ffd23f"); img.circle(x - 7, y - 4, 4, "#1c1638"); img.circle(x + 7, y - 4, 4, "#1c1638"); img.polygon([[x - 5, y + 4], [x + 5, y + 4], [x, y + 12]], "#ff9f1c"); }
    [4, 5, 6, 7].forEach((n, i) => { img.roundRect(70 + i * 70, 172, 54, 50, 12, n === 6 ? "#51cf66" : "#fff"); img.text(String(n), 97 + i * 70, 184, 4, n === 6 ? "#fff" : "#1c1638"); });
  },
  "color-echo"(img) {
    img.gradient("#2b1d52", "#0e0820");
    img.polygon([[200, 10], [290, 100], [200, 110]], "#51cf66"); img.polygon([[300, 115], [210, 205], [210, 120]], "#ff4f6d"); img.polygon([[190, 120], [190, 210], [100, 120]], "#ffd23f"); img.polygon([[100, 110], [190, 15], [190, 110]], "#4dabf7");
    img.circle(200, 112, 34, "#1a1238"); img.text("7", 200, 102, 4, "#fff"); img.circle(255, 70, 30, "#51cf6655");
  },
  "odd-one-out"(img) {
    img.gradient("#e5dbff", "#d0ebff"); img.roundRect(90, 6, 220, 220, 18, "#fff");
    for (let i = 0; i < 16; i++) { const x = 118 + (i % 4) * 52, y = 34 + Math.floor(i / 4) * 52; img.roundRect(x - 22, y - 22, 44, 44, 10, i === 9 ? "#b2f2bb" : "#f8f9fa"); img.circle(x, y, 16, i === 9 ? "#ff922b" : "#ff4f6d"); img.rect(x - 1, y - 20, 3, 7, "#5a3"); }
    img.ring(170, 138, 26, 4, "#7c5cff");
  },
  "alphabet-catch"(img) {
    img.gradient("#99e9f2", "#e3fafc"); img.rect(0, 200, 400, 30, "#8ce99a");
    "ABC".split("").forEach((ch, i) => { const x = 90 + i * 110, y = 40 + i * 25; img.roundRect(x - 26, y - 26, 52, 52, 12, "#fff"); img.text(ch, x, y - 14, 4, ["#ff4f6d", "#4dabf7", "#51cf66"][i]); });
    img.circle(200, 180, 46, "#7c5cff"); img.rect(154, 180, 92, 30, "#7c5cff"); img.circle(184, 164, 11, "#fff"); img.circle(216, 164, 11, "#fff"); img.circle(186, 165, 5, "#1c1638"); img.circle(218, 165, 5, "#1c1638");
    img.circle(200, 192, 14, "#1c1638"); img.polygon([[166, 140], [158, 116], [180, 134]], "#7c5cff"); img.polygon([[234, 140], [242, 116], [220, 134]], "#7c5cff");
  },
  "four-in-a-row"(img) {
    img.gradient("#1e3a8a", "#0b1638"); img.roundRect(70, 18, 260, 210, 16, "#3a86ff");
    const b = [".......", "...y...", "..ry...", ".ryy...", "rryrr..", "yryyr.."];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) { const ch = b[r][c]; img.circle(96 + c * 35, 40 + r * 34, 14, ch === "r" ? "#e03131" : ch === "y" ? "#f59f00" : "#0b1638"); }
    img.line(96, 176, 201, 74, 5, "#ffffffcc");
  },
  "flip-discs"(img) {
    img.gradient("#0b3d2e", "#062019"); img.roundRect(90, 6, 220, 220, 14, "#1b5e44");
    for (let i = 0; i < 64; i++) img.roundRect(96 + (i % 8) * 26.5, 12 + Math.floor(i / 8) * 26.5, 24, 24, 4, "#2f9e6e");
    const d = { 27: 1, 28: 2, 35: 2, 36: 1, 29: 1, 37: 1, 20: 2, 44: 2, 19: 1 };
    Object.entries(d).forEach(([i, v]) => { const x = 108 + (i % 8) * 26.5, y = 24 + Math.floor(i / 8) * 26.5; img.circle(x, y, 10, v === 1 ? "#111" : "#f1f3f5"); img.circle(x - 3, y - 3, 3, v === 1 ? "#555" : "#fff"); });
  },
  "checkers"(img) {
    img.gradient("#5c3d1e", "#2b1a0b");
    for (let i = 0; i < 48; i++) { const c = i % 8, r = Math.floor(i / 8); img.rect(40 + c * 40, 0 + r * 40, 40, 40, (r + c) % 2 ? "#8b5a2b" : "#f1d9b5"); }
    const pc = (c, r, red, king) => { const x = 60 + c * 40, y = 20 + r * 40; img.circle(x + 1, y + 3, 15, "#0006"); img.circle(x, y, 15, red ? "#c92a2a" : "#16181b"); img.circle(x, y - 3, 15, red ? "#ff6b6b" : "#495057"); if (king) img.star(x, y - 3, 8, "#ffd23f"); };
    pc(1, 0, false); pc(3, 0, false); pc(5, 0, false, true); pc(2, 1, false); pc(4, 3, true, true); pc(1, 4, true); pc(3, 4, true); pc(6, 3, false);
  },
  "dots-and-boxes"(img) {
    img.rect(0, 0, 400, 300, "#fdf6e3");
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
      const x = 80 + c * 60, y = 20 + r * 60;
      if (c < 4 && (r + c) % 3) img.line(x, y, x + 60, y, 5, (r + c) % 2 ? "#e8590c" : "#1c7ed6");
      if (r < 3 && (r * c) % 2 === 0) img.line(x, y, x, y + 60, 5, (r + c) % 2 ? "#1c7ed6" : "#e8590c");
    }
    img.rect(83, 23, 54, 54, "#e8590c33"); img.star(110, 50, 16, "#e8590c"); img.rect(203, 83, 54, 54, "#1c7ed633"); img.circle(230, 110, 12, "#1c7ed6");
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) img.circle(80 + c * 60, 20 + r * 60, 6, "#1c1638");
  },
  "tower-guard"(img) {
    for (let i = 0; i < 64; i++) img.rect((i % 10) * 40, Math.floor(i / 10) * 40, 40, 40, (i + Math.floor(i / 10)) % 2 ? "#51a447" : "#5cb350");
    img.rect(0, 40, 160, 40, "#d9b88a"); img.rect(120, 40, 40, 160, "#d9b88a"); img.rect(120, 160, 200, 40, "#d9b88a"); img.rect(280, 80, 40, 120, "#d9b88a"); img.rect(280, 80, 120, 40, "#d9b88a");
    const tw = (x, y, c) => { img.roundRect(x - 14, y - 12, 28, 26, 5, "#adb5bd"); img.circle(x, y - 2, 8, c); img.line(x, y - 2, x + 14, y - 10, 6, c); };
    tw(80, 120, "#8b5a2b"); tw(220, 120, "#495057"); tw(240, 220, "#4dabf7");
    blob(img, 140, 100, 13, "#b15cff"); blob(img, 200, 180, 13, "#ff5d73"); blob(img, 60, 60, 11, "#51cf66");
    img.roundRect(360, 70, 34, 50, 4, "#868e96"); img.polygon([[356, 72], [377, 50], [398, 72]], "#e03131");
  },
  "mancala"(img) {
    img.gradient("#3d2a1a", "#1e140b"); img.roundRect(20, 40, 360, 150, 60, "#b07a44");
    img.roundRect(34, 60, 44, 110, 22, "#5c3d1e"); img.roundRect(322, 60, 44, 110, 22, "#5c3d1e");
    const cols = ["#ff6b6b", "#ffd43b", "#69db7c", "#4dabf7", "#da77f2"];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { const x = 104 + c * 38, y = 85 + r * 60; img.circle(x, y, 17, "#5c3d1e"); for (let k = 0; k < 4; k++) img.circle(x + Math.cos(k * 1.6) * 7, y + Math.sin(k * 1.6) * 7, 4.5, cols[(c + k + r) % 5]); }
    for (let k = 0; k < 7; k++) img.circle(344 + (k % 2) * 8 - 4, 80 + k * 12, 5, cols[k % 5]);
  },
  "sea-battle"(img) {
    img.gradient("#0b3a5c", "#061a2b");
    for (let i = 0; i < 70; i++) img.roundRect(60 + (i % 10) * 28, 4 + Math.floor(i / 10) * 32, 26, 30, 3, "#1c6ea4");
    img.roundRect(116, 70, 110, 26, 10, "#8a9bb0"); img.rect(150, 58, 30, 14, "#6c7a8c"); img.rect(170, 48, 5, 12, "#6c7a8c");
    [[144, 74], [172, 74]].forEach(([x, y]) => { img.roundRect(x, y - 4, 26, 30, 3, "#c92a2a"); img.circle(x + 13, y + 10, 8, "#ffd23f"); img.circle(x + 13, y + 12, 5, "#ff9f1c"); });
    [[256, 10], [88, 170], [284, 140]].forEach(([x, y]) => img.circle(x + 13, y + 15, 5, "#d0ebff"));
  }
};
