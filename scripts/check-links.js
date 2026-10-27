#!/usr/bin/env node
// Checks every page in /dist for broken internal links and images. Run with: npm test

const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "..", "dist");
const broken = [];
let pages = 0, links = 0;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

function exists(urlPath, fromFile) {
  const clean = urlPath.split("#")[0].split("?")[0];
  if (!clean) return true;
  const target = clean.startsWith("/") ? path.join(DIST, clean) : path.join(path.dirname(fromFile), clean);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) return fs.existsSync(path.join(target, "index.html"));
  return fs.existsSync(target);
}

for (const file of walk(DIST)) {
  pages++;
  const html = fs.readFileSync(file, "utf8");
  const re = /\s(?:href|src|data-src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (/^(https?:|mailto:|data:|javascript:|#)/.test(url)) continue;
    links++;
    if (!exists(url, file)) broken.push(`${path.relative(DIST, file)} → ${url}`);
  }
}

if (broken.length) {
  console.error(`❌ ${broken.length} broken link(s):`);
  broken.forEach((b) => console.error("   " + b));
  process.exit(1);
}
console.log(`✅ Checked ${links} internal links on ${pages} pages — no broken links.`);
