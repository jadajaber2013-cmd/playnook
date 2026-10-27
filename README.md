# Plinkora — a free browser games website

A fast, colourful games site (in the style of CrazyGames / Poki) built with plain HTML, CSS and
vanilla JavaScript. There are **no frameworks, no npm packages and no paid services**. It runs free on
Cloudflare Pages.

**How it works:** every game is a folder in `/games`. A small build script turns those folders into
the whole website: homepage, category pages, game pages, sitemap, search and SEO tags. To add a game,
you drop in a folder and push to GitHub. The site rebuilds and deploys itself.

> "Plinkora" is the site name. Change it (and everything else about the site) in **`site.config.js`**.

---

## What's inside

```
site.config.js        ← THE settings file: site name, URL, email, categories, AdSense
games/
  snake/
    index.html        ← the game itself
    meta.json         ← title, category, description, how to play, tags
    thumbnail.png     ← 400×300 picture shown on the cards
  ...
new-game-prompt.md    ← copy-paste prompt for making new games with Claude Code
LICENSES.md           ← license of every game (generated automatically)
scripts/              ← build, add-game, thumbnail, local server, link checker
src/                  ← page templates, styles and site JavaScript
.github/workflows/    ← auto build + deploy on every push
dist/                 ← the finished website (created by the build; never edit it)
```

The rule is simple: **you only ever edit `site.config.js` and the files inside `/games`.**
Everything else is generated for you.

The site ships with **56 original games** across all six categories: arcade shooters and runners,
puzzles (Sudoku, sliding tiles, match-3, block puzzles…), racing (kart, drift, night drive…), sports
(penalty kicks, hoops, mini golf, bowling…), kids' learning games, and strategy games with computer
opponents (four in a row, checkers, mancala, tower defense…). Every game works with both keyboard
and touch. Thumbnails are drawn by `scripts/lib/thumbs-art.js` (`npm run thumbnail -- --all --force`
redraws them).

---

## 1. Run it on your computer

You need **Node.js 18 or newer**. Download the "LTS" version from <https://nodejs.org> and install it.

Open a terminal in this folder and run:

```bash
npm run dev
```

Then open **http://localhost:8080** in your browser. Press `Ctrl + C` in the terminal to stop it.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the site into `/dist` |
| `npm run dev` | Builds, then starts the local preview server |
| `npm start` | Starts the preview server without rebuilding |
| `npm test` | Builds and checks every page for broken links |
| `npm run add-game` | Creates a new game folder (asks you a few questions) |
| `npm run thumbnail -- snake` | Makes a placeholder thumbnail for a game |

No `npm install` is needed, because there are no dependencies.

---

## 2. Add a game

### Option A: the add-game command

```bash
npm run add-game
```

It asks for the **title**, **category**, **description**, how-to-play text and tags. Then it creates
`games/<your-game>/` with `meta.json`, a placeholder `thumbnail.png`, and a working starter
`index.html` (a small "catch the stars" game). Replace that `index.html` with your own game code.

### Option B: let Claude Code make the whole game

Open Claude Code in this folder and type:

```bash
claude "Make a new game called Space Dodge in /games/space-dodge/ following the format in new-game-prompt.md"
```

`new-game-prompt.md` lists every rule a game must follow: keyboard + touch controls, mobile
friendly, no external files, the meta.json format, and so on.

### After adding a game

1. Run `npm run dev` and open the game's page to try it.
2. If you like, replace `thumbnail.png` with a 400×300 screenshot.
3. Push to GitHub (step 3). The site updates in about a minute.

### meta.json fields

| Field | Required | Example |
| --- | --- | --- |
| `title` | ✅ | `"Space Dodge"` |
| `category` | ✅ | `"Arcade"` (must match a category in `site.config.js`) |
| `description` | ✅ | 2–3 sentences. Shown on the game page and in Google. |
| `instructions` | ✅ | A list of short "how to play" lines |
| `tags` | | `["space", "dodge"]`. These help search. |
| `added` | | `"2026-10-27"`. Games from the last 30 days get a **New** badge and lead the New row. |
| `popularity` | | `0`–`100`. Higher numbers show first in the Popular row. |
| `license` | | `"Original"` (default), `"MIT"`, `"CC0-1.0"`, … |
| `author` / `source` | | Required when the license isn't `Original`. `source` must be a link. |

The build **stops with a clear message** if a game is broken: a missing field, an unknown category,
a non-open license, or gambling/betting words. `LICENSES.md` is rewritten on every build from these
fields.

---

## 3. Put the code on GitHub

1. Create a free account at <https://github.com>. Then click **New repository**, give it a name
   (for example `my-games-site`) and click **Create repository**. Don't tick "Add a README".
2. Install Git from <https://git-scm.com> if you don't have it.
3. In a terminal in this folder, run these commands one at a time. Replace the URL with the one
   GitHub shows you.

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "First version of my games site"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/YOUR-NAME/my-games-site.git
```

```bash
git push -u origin main
```

From now on, publishing changes takes three commands:

```bash
git add . && git commit -m "Add Space Dodge" && git push
```

---

## 4. Deploy free on Cloudflare Pages (automatic on every push)

The included GitHub Action (`.github/workflows/deploy.yml`) builds the site and uploads it to
Cloudflare every time you push. It needs two secrets.

**a) Create a free Cloudflare account** at <https://dash.cloudflare.com/sign-up>.

**b) Find your Account ID.** In the Cloudflare dashboard, open **Workers & Pages**. Your
**Account ID** is in the right-hand sidebar. (It is also the long code in the dashboard URL.) Copy it.

**c) Create an API token.** Click your profile icon → **My Profile** → **API Tokens** →
**Create Token** → **Create Custom Token**:
- Name: `GitHub deploy`
- Permissions: **Account** → **Cloudflare Pages** → **Edit**
- Click **Continue to summary** → **Create Token**, then copy the token. It is only shown once.

**d) Add both values to GitHub.** In your repository, go to **Settings** → **Secrets and variables** →
**Actions** → **New repository secret**. Add two secrets:
- `CLOUDFLARE_API_TOKEN` = the token
- `CLOUDFLARE_ACCOUNT_ID` = the account ID

**e) Deploy.** Push any change, or go to the **Actions** tab → **Build and deploy** → **Run workflow**.
On the first run it creates the Pages project named in `site.config.js` (`cloudflareProject`).
Your site goes live at:

```
https://<cloudflareProject>.pages.dev
```

**f)** Put that address in `site.config.js` → `url`, then push again. SEO tags and the sitemap use it.

> If the name is already used by someone else, Cloudflare adds a short suffix (for example
> `https://yourname-3we.pages.dev`). The exact address is printed at the end of the
> "Deploy to Cloudflare Pages" step in the Action log, and in Cloudflare → Workers & Pages.

> If the Action says "NOT deployed because a secret is missing", step d isn't finished yet.
> If the project name is already taken on Cloudflare, change `cloudflareProject` to something unique.

**Alternative without GitHub Actions:** in Cloudflare go to Workers & Pages → Create → Pages →
**Connect to Git**, pick your repo, and set build command `npm run build` and output directory `dist`.
Cloudflare then builds on every push itself. Use this *or* the Action, not both. If you pick this,
delete `.github/workflows/deploy.yml`.

---

## 5. Connect your own domain

**Free option:** your site already has a free, real HTTPS address: `https://<cloudflareProject>.pages.dev`.
If you want a free domain name of your own, you can register one like `plinkora.eu.org` at
<https://nic.eu.org> (free, but approval can take days or weeks). When it's approved, point it at
Cloudflare (step 2 below) and change `url` in `site.config.js`. Note that AdSense usually
wants a top-level domain you own (like `.com`), so for ads a paid domain (~$10/year) is the safer choice.

**Paid option:**

1. Buy a domain from any registrar (Cloudflare Registrar sells at cost).
2. In Cloudflare: **Workers & Pages** → your project → **Custom domains** → **Set up a custom domain**,
   then type your domain (for example `plinkora.com`) and follow the steps. If the domain is on
   Cloudflare, the DNS is set up for you. If not, add the CNAME record it shows at your registrar.
3. Optionally add `www.yourdomain.com` too.
4. Update `url` in `site.config.js` to `https://yourdomain.com` and push.
5. Submit `https://yourdomain.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

---

## 6. Turn on Google AdSense

The site is AdSense-friendly out of the box. It has About, Privacy Policy and Contact pages,
original content, a cookie banner, and no gambling games.

1. Before you apply, set your real `contactEmail` and `owner` in `site.config.js` and add a few
   more games. AdSense prefers sites with plenty of content.
2. Apply at <https://adsense.google.com> with your custom domain (AdSense does not accept
   `*.pages.dev` addresses).
3. When AdSense gives you your publisher ID (`ca-pub-…`), open `site.config.js`:

```js
ads: {
  enabled: true,
  client: "ca-pub-1234567890123456",
  slots: { header: "1111111111", sidebar: "2222222222", belowGame: "3333333333" }
}
```

   - `slots` are the ad-unit IDs from AdSense → **Ads** → **By ad unit** (create "Display ads").
     If you leave a slot empty (`""`), that spot shows nothing. You can then use **Auto ads** from
     the AdSense dashboard instead.
4. Push. The build automatically:
   - adds the ad units in the three spots (header banner, sidebar, below the game),
   - creates `/ads.txt` with your publisher ID,
   - loads the AdSense script **only after** the visitor answers the cookie banner. If they click
     "Only essential", only non-personalised ads are requested.

**Important:**
- **Europe/UK/Switzerland.** Google requires a *Google-certified* consent message (CMP) for visitors
  there. The built-in banner is simple and not certified. The easy free fix is to turn on
  AdSense → **Privacy & messaging** → **European regulations** message. Google then shows its own
  consent popup to those visitors.
- **Kids content.** If your site is aimed mainly at children, tell AdSense to treat it as
  child-directed. Google's rules for this are stricter.
- Never click your own ads.

### Free analytics (optional)

Cloudflare Web Analytics is free and uses no cookies. In Cloudflare → **Analytics & Logs** →
**Web Analytics** → add your site, copy the token, and paste it into `cloudflareAnalyticsToken` in
`site.config.js`.

---

## Rules for games on this site

- Only **original games** or games with a **clear open license** (MIT, CC0, etc.). Record the
  source in `meta.json`. `LICENSES.md` and the About page update automatically.
- **No gambling, betting, casino or real-money games.** The build refuses them.
- Games must work with **keyboard and touch**.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm` is not recognised | Install Node.js from nodejs.org, then open a **new** terminal. |
| Build says a game needs fixing | Read the message. It names the folder and the exact problem. |
| Port 8080 is busy | Run `PORT=3000 npm start` (Mac/Linux) or `set PORT=3000 && npm start` (Windows cmd). |
| Game doesn't react to keys | Click inside the game first so it has focus. |
| Site didn't update after push | Check the **Actions** tab on GitHub for a red ❌ and open it to see why. |

## Speed

Pages are static HTML with inlined CSS and one small deferred script. Images are lazy-loaded, games
load only when the player clicks **Play**, and assets get long-term caching via `dist/_headers`.
Expect Lighthouse scores in the 90s. Large game files (big images or sounds) are what will slow
down a game page, so keep each game small.
