#!/usr/bin/env node
// (Re)creates games/<slug>/thumbnail.png from the game's title.
// Usage: npm run thumbnail -- <slug>        (one game)
//        npm run thumbnail -- --all         (every game missing a thumbnail)
//        npm run thumbnail -- --all --force (overwrite every thumbnail)

const fs = require("fs");
const path = require("path");
const { GAMES_DIR, ROOT } = require("./lib/games");
const { drawThumbnail } = require("./lib/thumbs");
const config = require(path.join(ROOT, "site.config.js"));

const args = process.argv.slice(2);
const force = args.includes("--force");
const slugs = args.includes("--all")
  ? fs.readdirSync(GAMES_DIR).filter((s) => fs.existsSync(path.join(GAMES_DIR, s, "meta.json")))
  : args.filter((a) => !a.startsWith("--"));

if (!slugs.length) { console.log("Usage: npm run thumbnail -- <game-folder-name>   or   npm run thumbnail -- --all"); process.exit(1); }

for (const slug of slugs) {
  const dir = path.join(GAMES_DIR, slug), out = path.join(dir, "thumbnail.png");
  if (!fs.existsSync(path.join(dir, "meta.json"))) { console.error(`❌ games/${slug}/meta.json not found.`); process.exitCode = 1; continue; }
  if (fs.existsSync(out) && args.includes("--all") && !force) continue;
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));
  const color = (config.categories.find((c) => c.name === meta.category) || {}).color;
  fs.writeFileSync(out, drawThumbnail({ slug, title: meta.title || slug, color }));
  console.log(`🖼️  wrote games/${slug}/thumbnail.png`);
}
