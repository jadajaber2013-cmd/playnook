#!/usr/bin/env node
// Creates a new game folder with meta.json, a starter index.html and a thumbnail.
//
// Interactive:  npm run add-game
// One line:     npm run add-game -- --title "Space Dodge" --category Arcade --description "Dodge the asteroids!"
//               (optional: --instructions "Line one|Line two" --tags "space,dodge")

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { slugify, GAMES_DIR, ROOT } = require("./lib/games");
const { drawThumbnail } = require("./lib/thumbs");
const config = require(path.join(ROOT, "site.config.js"));

function parseArgs() {
  const out = {}, a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) if (a[i].startsWith("--")) out[a[i].slice(2)] = a[i + 1] && !a[i + 1].startsWith("--") ? a[++i] : "true";
  return out;
}

async function main() {
  const args = parseArgs();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((res) => rl.question(q, (a) => res(a.trim())));
  const cats = config.categories.map((c) => c.name);

  console.log("\n🎮 Add a new game\n");

  let title = args.title;
  while (!title) title = await ask("Game title: ");
  const slug = slugify(title);
  if (!slug) { console.error("❌ That title has no letters or numbers in it."); process.exit(1); }
  const dir = path.join(GAMES_DIR, slug);
  if (fs.existsSync(dir)) { console.error(`❌ games/${slug}/ already exists. Pick another title or delete that folder.`); process.exit(1); }

  let category = args.category && cats.find((c) => c.toLowerCase() === args.category.toLowerCase());
  while (!category) {
    if (args.category) { console.log(`"${args.category}" is not a category.`); delete args.category; }
    console.log("Categories: " + cats.map((c, i) => `${i + 1}) ${c}`).join("  "));
    const a = await ask("Category (number or name): ");
    category = cats[Number(a) - 1] || cats.find((c) => c.toLowerCase() === a.toLowerCase());
  }

  let description = args.description;
  while (!description) description = await ask("Short description (1–2 sentences): ");

  let instructions = args.instructions;
  if (!instructions && !args.title) instructions = await ask("How to play (optional, separate lines with |): ");
  instructions = (instructions || "Use the arrow keys or WASD to move.|On phones and tablets, tap or swipe.|Press P to pause.").split("|").map((s) => s.trim()).filter(Boolean);

  let tags = args.tags;
  if (tags === undefined && !args.title) tags = await ask("Tags (optional, comma separated): ");
  tags = (tags || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  rl.close();

  const meta = {
    title,
    category,
    description,
    instructions,
    tags,
    added: new Date().toISOString().slice(0, 10),
    popularity: 50,
    license: "Original",
    source: "Original work"
  };

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
  const tplPath = path.join(__dirname, "templates", "starter-game.html");
  fs.writeFileSync(path.join(dir, "index.html"), fs.readFileSync(tplPath, "utf8").replace(/\{\{TITLE\}\}/g, title.replace(/[<>&"]/g, "")));
  const color = config.categories.find((c) => c.name === category).color;
  fs.writeFileSync(path.join(dir, "thumbnail.png"), drawThumbnail({ slug, title, color }));

  console.log(`
✅ Created games/${slug}/
   • index.html     ← replace with your game (a working starter is inside)
   • meta.json      ← title, category, description, how to play, tags
   • thumbnail.png  ← placeholder; replace with a 400×300 PNG screenshot if you like

Next steps:
   npm run dev       (build + open http://localhost:8080/games/${slug}/)
   git add . && git commit -m "Add ${title}" && git push
`);
}

main().catch((e) => { console.error(e); process.exit(1); });
