#!/usr/bin/env node
// Builds the whole website into /dist from site.config.js and the /games folders.
// Run with: npm run build

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { loadGames, catSlug, ROOT } = require("./lib/games");
const { drawThumbnail, drawShareImage } = require("./lib/thumbs");
const { makeTemplates } = require("../src/templates");

const DIST = path.join(ROOT, "dist");
const SRC = path.join(ROOT, "src");
const started = Date.now();

const config = require(path.join(ROOT, "site.config.js"));
config.url = String(config.url || "").replace(/\/+$/, "");
config.ads = config.ads || { enabled: false };

// ---------- 1. Read and check games ----------
const { games, errors, warnings } = loadGames(config);
warnings.forEach((w) => console.warn("⚠️  " + w));
if (errors.length) {
  console.error("\n❌ The build stopped because some games need fixing:\n");
  errors.forEach((e) => console.error("   • " + e));
  console.error("");
  process.exit(1);
}
if (!games.length) console.warn("⚠️  No games found in /games yet.");

// ---------- 2. Fresh output folder ----------
fs.rmSync(DIST, { recursive: true, force: true });
const write = (rel, content) => {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const copyDir = (from, to, skip = []) => {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (skip.includes(entry.name) || entry.name.startsWith(".")) continue;
    const a = path.join(from, entry.name), b = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
};

// ---------- 3. Assets ----------
const css = fs.readFileSync(path.join(SRC, "style.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{}:;,>])\s*/g, "$1")
  .replace(/;}/g, "}")
  .trim();
const js = fs.readFileSync(path.join(SRC, "app.js"), "utf8");
const jsFile = `app.${crypto.createHash("md5").update(js).digest("hex").slice(0, 8)}.js`;
write(`assets/${jsFile}`, js);
write("assets/favicon.svg", fs.readFileSync(path.join(SRC, "favicon.svg")));
write("assets/share.png", drawShareImage(config.name, config.categories.map((c) => c.color)));

// ---------- 4. Templates ----------
const today = new Date().toISOString().slice(0, 10);
const NEW_DAYS = 30;
const tpl = makeTemplates(config, {
  css,
  jsFile,
  catSlug,
  games,
  year: new Date().getFullYear(),
  today,
  isNew: (g) => (Date.now() - Date.parse(g.added)) / 864e5 <= NEW_DAYS
});

// ---------- 5. Game pages ----------
for (const g of games) {
  copyDir(g.dir, path.join(DIST, "games", g.slug, "play"), ["meta.json", "thumbnail.png"]);
  const thumb = path.join(g.dir, "thumbnail.png");
  const color = (config.categories.find((c) => c.name === g.category) || {}).color;
  write(`games/${g.slug}/thumbnail.png`, g.hasThumb ? fs.readFileSync(thumb) : drawThumbnail({ slug: g.slug, title: g.title, color }));
  write(`games/${g.slug}/index.html`, tpl.game(g, games));
}

// ---------- 6. Other pages ----------
write("index.html", tpl.home(games));
const sitemapPaths = ["/"];
for (const c of config.categories) {
  const list = games.filter((g) => g.category === c.name);
  write(`category/${catSlug(c.name)}/index.html`, tpl.category(c, list));
  if (list.length) sitemapPaths.push(`/category/${catSlug(c.name)}/`);
}
write("about/index.html", tpl.about(games));
write("privacy/index.html", tpl.privacy());
write("contact/index.html", tpl.contact());
write("404.html", tpl.notFound());
games.forEach((g) => sitemapPaths.push(`/games/${g.slug}/`));
sitemapPaths.push("/about/", "/privacy/", "/contact/");

// ---------- 7. Search index, sitemap, robots, headers ----------
write("search-index.json", JSON.stringify(games.map((g) => ({ slug: g.slug, title: g.title, category: g.category, tags: g.tags }))));

const lastmod = (p) => {
  const g = games.find((x) => p === `/games/${x.slug}/`);
  return g ? g.added : today;
};
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths.map((p) => `  <url><loc>${config.url}${p}</loc><lastmod>${lastmod(p)}</lastmod></url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *
Allow: /

Sitemap: ${config.url}/sitemap.xml
`);

if (config.ads.enabled && /^ca-pub-\d{10,}$/.test(config.ads.client) && !/^ca-pub-0+$/.test(config.ads.client))
  write("ads.txt", `google.com, ${config.ads.client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`);

// Cloudflare Pages reads this file to set caching and security headers.
write("_headers", `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/games/*/thumbnail.png
  Cache-Control: public, max-age=604800

# The raw game files should not appear in Google on their own — only the game pages.
/games/*/play/
  X-Robots-Tag: noindex

/games/*/play/*
  X-Robots-Tag: noindex
`);

// ---------- 8. LICENSES.md (kept in the repo, regenerated every build) ----------
const licenses = `# Game licenses

> This file is generated automatically by \`npm run build\` from each game's \`meta.json\`.
> Do not edit it by hand — change the \`license\`, \`author\` and \`source\` fields in the game's meta.json instead.

Only original games or games with a clear open license (MIT, CC0, etc.) are allowed on this site.
Gambling, betting and real-money games are never allowed.

| Game | Folder | Author | License | Source |
| --- | --- | --- | --- | --- |
${games.map((g) => `| ${g.title} | \`games/${g.slug}/\` | ${g.author} | ${g.license} | ${g.source} |`).join("\n")}

## Site code

The website code (build scripts, templates and styles) is original work by ${config.owner}.
`;
fs.writeFileSync(path.join(ROOT, "LICENSES.md"), licenses);

// ---------- Done ----------
if (/example\.com|pages\.dev/.test(config.url + config.contactEmail))
  console.log("ℹ️  Tip: set your real `url` and `contactEmail` in site.config.js before launching.");
console.log(`✅ Built ${games.length} games, ${config.categories.length} categories and ${sitemapPaths.length} sitemap URLs into /dist in ${Date.now() - started} ms.`);
