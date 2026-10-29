// Tiny dependency-free image drawing + PNG encoder.
// Used to make thumbnails and the social-share image without any npm packages.
// Shapes are drawn at 2x and scaled down, which gives smooth (anti-aliased) edges.

const zlib = require("zlib");

const SS = 2; // supersampling factor

// 5x7 pixel font: '#' = filled pixel
const FONT = {
  A: ".###.#...##...#######...##...##...#", B: "####.#...##...#####.#...##...#####.",
  C: ".###.#...##....#....#....#...#.###.", D: "####.#...##...##...##...##...#####.",
  E: "######....#....####.#....#....#####", F: "######....#....####.#....#....#....",
  G: ".###.#...##....#.####...##...#.####", H: "#...##...##...#######...##...##...#",
  I: ".###...#....#....#....#....#...###.", J: "..###...#....#....#....#.#..#..##..",
  K: "#...##..#.#.#..##...#.#..#..#.#...#", L: "#....#....#....#....#....#....#####",
  M: "#...###.###.#.##.#.##...##...##...#", N: "#...##...###..##.#.##..###...##...#",
  O: ".###.#...##...##...##...##...#.###.", P: "####.#...##...#####.#....#....#....",
  Q: ".###.#...##...##...##.#.##..#..##.#", R: "####.#...##...#####.#.#..#..#.#...#",
  S: ".#####....#.....###.....#....#####.", T: "#####..#....#....#....#....#....#..",
  U: "#...##...##...##...##...##...#.###.", V: "#...##...##...##...##...#.#.#...#..",
  W: "#...##...##...##.#.##.#.##.#.#.#.#.", X: "#...##...#.#.#...#...#.#.#...##...#",
  Y: "#...##...#.#.#...#....#....#....#..", Z: "#####....#...#...#...#...#....#####",
  0: ".###.#...##..###.#.###..##...#.###.", 1: "..#...##....#....#....#....#...###.",
  2: ".###.#...#....#...#...#...#...#####", 3: "####.....#....#.###.....#....#####.",
  4: "...#...##..#.#.#..#.#####...#....#.", 5: "######....####.....#....##...#.###.",
  6: ".###.#....#....####.#...##...#.###.", 7: "#####....#...#...#...#....#....#...",
  8: ".###.#...##...#.###.#...##...#.###.", 9: ".###.#...##...#.####....#....#.###.",
  "-": "................###................", "!": "..#....#....#....#....#.........#..",
  "?": ".###.#...#....#...#...#.........#..", ".": "................................#..",
  "'": "..#....#...........................", ":": ".......#...................#.......",
  "&": ".##..#..#.#.#...#...#.#.##..#..##.#", "+": ".......#....#..#####..#....#.......",
  " ": "..................................."
};

function parseColor(c) {
  if (Array.isArray(c)) return c;
  let h = c.replace("#", "");
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h.slice(0, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) : 255;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
}

function mix(a, b, t) {
  const A = parseColor(a), B = parseColor(b);
  return [0, 1, 2, 3].map((i) => Math.round(A[i] + (B[i] - A[i]) * t));
}

class Img {
  // width/height are the FINAL size; drawing coordinates use final-size units.
  constructor(width, height, scale = 1) {
    this.width = width;
    this.height = height;
    this.scale = scale; // output pixels per drawing unit (2 = double resolution)
    this.k = SS * scale;
    this.w = width * this.k;
    this.h = height * this.k;
    this.data = new Uint8ClampedArray(this.w * this.h * 4);
  }

  _blend(x, y, col) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4, a = col[3] / 255, d = this.data;
    d[i] = col[0] * a + d[i] * (1 - a);
    d[i + 1] = col[1] * a + d[i + 1] * (1 - a);
    d[i + 2] = col[2] * a + d[i + 2] * (1 - a);
    d[i + 3] = Math.min(255, col[3] + d[i + 3] * (1 - a));
  }

  // Generic: fill every pixel in a box where test(px,py) is true (final units).
  _fill(x0, y0, x1, y1, color, test) {
    const col = parseColor(color);
    const k = this.k;
    const X0 = Math.max(0, Math.floor(x0 * k)), Y0 = Math.max(0, Math.floor(y0 * k));
    const X1 = Math.min(this.w, Math.ceil(x1 * k)), Y1 = Math.min(this.h, Math.ceil(y1 * k));
    for (let y = Y0; y < Y1; y++)
      for (let x = X0; x < X1; x++)
        if (!test || test((x + 0.5) / k, (y + 0.5) / k)) this._blend(x, y, col);
  }

  gradient(c1, c2, diagonal = true) {
    const A = parseColor(c1), B = parseColor(c2);
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const t = diagonal ? (x / this.w + y / this.h) / 2 : y / this.h;
        const c = [0, 1, 2].map((k) => A[k] + (B[k] - A[k]) * t);
        const i = (y * this.w + x) * 4;
        this.data[i] = c[0]; this.data[i + 1] = c[1]; this.data[i + 2] = c[2]; this.data[i + 3] = 255;
      }
  }

  rect(x, y, w, h, color) { this._fill(x, y, x + w, y + h, color); }

  roundRect(x, y, w, h, r, color) {
    this._fill(x, y, x + w, y + h, color, (px, py) => {
      const cx = Math.min(Math.max(px, x + r), x + w - r);
      const cy = Math.min(Math.max(py, y + r), y + h - r);
      return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
    });
  }

  circle(cx, cy, r, color) {
    this._fill(cx - r, cy - r, cx + r, cy + r, color, (px, py) => (px - cx) ** 2 + (py - cy) ** 2 <= r * r);
  }

  ring(cx, cy, r, thick, color) {
    const r2 = r - thick;
    this._fill(cx - r, cy - r, cx + r, cy + r, color, (px, py) => {
      const d = (px - cx) ** 2 + (py - cy) ** 2;
      return d <= r * r && d >= r2 * r2;
    });
  }

  line(x1, y1, x2, y2, thick, color) {
    const r = thick / 2, dx = x2 - x1, dy = y2 - y1, len2 = dx * dx + dy * dy || 1;
    this._fill(Math.min(x1, x2) - r, Math.min(y1, y2) - r, Math.max(x1, x2) + r, Math.max(y1, y2) + r, color, (px, py) => {
      const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
      return (px - x1 - t * dx) ** 2 + (py - y1 - t * dy) ** 2 <= r * r;
    });
  }

  polygon(points, color) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    this._fill(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), color, (px, py) => {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i], [xj, yj] = points[j];
        if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    });
  }

  star(cx, cy, r, color, points = 5) {
    const pts = [];
    for (let i = 0; i < points * 2; i++) {
      const rad = i % 2 ? r * 0.45 : r, a = (Math.PI * i) / points - Math.PI / 2;
      pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
    }
    this.polygon(pts, color);
  }

  // Width in final units of a single text line at pixel size `px`.
  textWidth(str, px) { return str.length * 6 * px - px; }

  // Draw one line of text, horizontally centered on cx. px = size of one font pixel.
  text(str, cx, y, px, color) {
    str = String(str).toUpperCase();
    let x = cx - this.textWidth(str, px) / 2;
    for (const ch of str) {
      const g = FONT[ch] || FONT["?"];
      for (let i = 0; i < 35; i++)
        if (g[i] === "#") this.rect(x + (i % 5) * px, y + Math.floor(i / 5) * px, px, px, color);
      x += 6 * px;
    }
  }

  // Word-wrap text to fit maxWidth. Returns array of lines.
  wrap(str, px, maxWidth) {
    const words = String(str).toUpperCase().split(/\s+/);
    const lines = [];
    let cur = "";
    for (const w of words) {
      const test = cur ? cur + " " + w : w;
      if (this.textWidth(test, px) <= maxWidth || !cur) cur = test;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // Encode as PNG (downsampling the 2x buffer first).
  toPNG() {
    const W = this.width * this.scale, H = this.height * this.scale, raw = Buffer.alloc((W * 3 + 1) * H);
    for (let y = 0; y < H; y++) {
      raw[y * (W * 3 + 1)] = 0;
      for (let x = 0; x < W; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let sy = 0; sy < SS; sy++)
            for (let sx = 0; sx < SS; sx++)
              sum += this.data[((y * SS + sy) * this.w + (x * SS + sx)) * 4 + c];
          raw[y * (W * 3 + 1) + 1 + x * 3 + c] = Math.round(sum / (SS * SS));
        }
      }
    }
    const chunk = (type, body) => {
      const len = Buffer.alloc(4); len.writeUInt32BE(body.length);
      const td = Buffer.concat([Buffer.from(type), body]);
      const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
      return Buffer.concat([len, td, crc]);
    };
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
    ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8-bit RGB
    return Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk("IHDR", ihdr),
      chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
      chunk("IEND", Buffer.alloc(0))
    ]);
  }
}

let CRC_TABLE;
function crc32(buf) {
  if (!CRC_TABLE) {
    CRC_TABLE = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      CRC_TABLE[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 255] ^ (crc >>> 8);
  return crc ^ -1;
}

module.exports = { Img, mix, parseColor };
