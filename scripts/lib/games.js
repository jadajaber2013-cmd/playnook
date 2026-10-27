// Reads every /games/<slug>/ folder, checks its meta.json, and returns a clean list.
// All the rules for what a valid game looks like live here.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const GAMES_DIR = path.join(ROOT, "games");

// Licenses we accept. "Original" means you made it yourself.
const ALLOWED_LICENSES = ["Original", "MIT", "CC0-1.0", "0BSD", "Unlicense", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "Zlib", "CC-BY-4.0"];

// Gambling / real-money words. A game containing these will stop the build.
const BANNED_WORDS = ["casino", "gamble", "gambling", "bet", "bets", "betting", "wager", "poker", "roulette", "blackjack", "slot machine", "slots", "lottery", "jackpot", "sportsbook", "bookmaker", "real money", "real-money", "cash prize", "crypto"];

const slugify = (s) => String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const catSlug = (name) => slugify(name);

function loadGames(config) {
  const errors = [], warnings = [], games = [];
  const catNames = config.categories.map((c) => c.name);
  if (!fs.existsSync(GAMES_DIR)) return { games, errors: ["The /games folder is missing."], warnings };

  for (const slug of fs.readdirSync(GAMES_DIR).sort()) {
    const dir = path.join(GAMES_DIR, slug);
    if (slug.startsWith(".") || slug.startsWith("_") || !fs.statSync(dir).isDirectory()) continue;
    const where = `games/${slug}`;
    const err = (m) => errors.push(`${where}: ${m}`);

    if (slug !== slugify(slug)) { err(`folder name must be lowercase letters, numbers and dashes only (try "${slugify(slug)}").`); continue; }
    if (!fs.existsSync(path.join(dir, "index.html"))) { err("missing index.html (the game itself)."); continue; }
    const metaPath = path.join(dir, "meta.json");
    if (!fs.existsSync(metaPath)) { err("missing meta.json. Run `npm run add-game` to create one."); continue; }

    let meta;
    try { meta = JSON.parse(fs.readFileSync(metaPath, "utf8")); }
    catch (e) { err(`meta.json is not valid JSON (${e.message}). Check for missing commas or quotes.`); continue; }

    const before = errors.length;
    for (const f of ["title", "category", "description", "instructions"])
      if (!meta[f] || (Array.isArray(meta[f]) && !meta[f].length)) err(`meta.json needs a "${f}".`);
    if (meta.category && !catNames.includes(meta.category)) err(`category "${meta.category}" is not one of: ${catNames.join(", ")}.`);
    if (meta.tags && !Array.isArray(meta.tags)) err(`"tags" must be a list, like ["fun", "retro"].`);

    const license = meta.license || "Original";
    if (!ALLOWED_LICENSES.includes(license)) err(`license "${license}" is not allowed. Use one of: ${ALLOWED_LICENSES.join(", ")}.`);
    if (license !== "Original" && !/^https?:\/\//.test(meta.source || "")) err(`games with a "${license}" license need a "source" link to where the code came from.`);

    const text = [meta.title, meta.description, ...(meta.tags || [])].join(" ").toLowerCase();
    const hit = BANNED_WORDS.find((w) => new RegExp(`\\b${w.replace(/[-\s]/g, "[-\\s]")}\\b`).test(text));
    if (hit) err(`mentions "${hit}". Gambling, betting and real-money games are not allowed on this site.`);
    if (errors.length > before) continue;

    let added = meta.added;
    if (!added || isNaN(Date.parse(added))) {
      added = new Date(fs.statSync(metaPath).mtime).toISOString().slice(0, 10);
      warnings.push(`${where}: no valid "added" date in meta.json, using ${added}.`);
    }
    const hasThumb = fs.existsSync(path.join(dir, "thumbnail.png"));
    if (!hasThumb) warnings.push(`${where}: no thumbnail.png — a placeholder was generated. Run \`npm run thumbnail -- ${slug}\` to save one.`);

    games.push({
      slug,
      dir,
      title: String(meta.title).trim(),
      category: meta.category,
      categorySlug: catSlug(meta.category),
      description: String(meta.description).trim(),
      instructions: Array.isArray(meta.instructions) ? meta.instructions.map(String) : String(meta.instructions).split(/\n+/).map((s) => s.trim()).filter(Boolean),
      tags: (meta.tags || []).map((t) => String(t).trim()).filter(Boolean),
      added,
      popularity: Number(meta.popularity) || 0,
      license,
      author: meta.author || config.owner,
      source: meta.source || "Original work",
      hasThumb
    });
  }
  return { games, errors, warnings };
}

module.exports = { loadGames, slugify, catSlug, ROOT, GAMES_DIR, ALLOWED_LICENSES };
