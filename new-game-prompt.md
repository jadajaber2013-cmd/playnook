# Prompt: make a new game for this site

Copy everything in the box below into Claude Code (or any AI coding assistant), and
replace the three lines in **CAPITALS** at the top. That's all.

Short version you can type instead:

> Make a new game called **Space Dodge** in `/games/space-dodge/` following the format in `new-game-prompt.md`.

---

```text
Make one new browser game for this website.

GAME TITLE: <your title, e.g. Space Dodge>
CATEGORY: <one of: Arcade, Puzzle, Racing, Sports, Kids, Strategy>
IDEA: <one or two sentences, e.g. "Steer a little rocket left and right to dodge falling asteroids. It gets faster over time.">

Follow these rules exactly:

1. FOLDER
   - Create the folder /games/<slug>/ where <slug> is the title in lowercase with dashes
     (e.g. "Space Dodge" -> /games/space-dodge/).
   - Easiest start: run `npm run add-game -- --title "<title>" --category <Category> --description "<description>"`
     which creates the folder, meta.json, a starter index.html and a placeholder thumbnail.png.
     Then replace index.html with the real game.
   - Do NOT edit any file outside /games/<slug>/. The build script generates everything else.

2. index.html (the game)
   - One self-contained HTML file with inline <style> and <script>. Plain HTML, CSS and vanilla
     JavaScript only. No frameworks, no build step, no CDN links, no external fonts, no network
     requests, no analytics, no ads, no iframes. Extra local files (images/sounds) in the same
     folder are fine, but keep the total small (under 500 KB).
   - It runs inside an iframe on the game page and must fill it completely:
     html, body { margin:0; height:100%; overflow:hidden; touch-action:none; user-select:none; }
     Use the viewport meta tag:
     <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
   - Must be responsive: work from 320px-wide phones in portrait up to large desktop screens.
     Listen to the window "resize" event. For canvas games, scale by devicePixelRatio (max 2)
     so it looks sharp.
   - Controls MUST work with BOTH keyboard and touch:
       * Keyboard: arrow keys AND WASD for movement, Space/Enter for the main action,
         P to pause. Call preventDefault() on arrow keys and Space so the page doesn't scroll.
       * Touch/mouse: use Pointer Events (pointerdown/pointermove/pointerup). Add on-screen
         buttons for touch devices when needed, shown with @media (pointer: coarse).
   - Show a start screen ("Tap or press Space to start") with one line of instructions,
     a score display, and a game-over screen with "play again".
   - Pause automatically when the tab is hidden (document "visibilitychange").
   - Save the high score / progress in localStorage using a key that starts with the slug,
     e.g. "space-dodge-best". Wrap localStorage in try/catch.
   - Use requestAnimationFrame for animation with a delta-time cap (e.g. Math.min(dt, 0.05)).
   - Content rules: family friendly. NO gambling, betting, casino, loot boxes, real money,
     crypto, violence against people, or adult content. Original code only — do not copy
     another game's code, name, characters or art.

3. meta.json (exact format)
   {
     "title": "Space Dodge",
     "category": "Arcade",
     "description": "2–3 friendly sentences describing the game for the game page and Google.",
     "instructions": [
       "Short sentence for each control or rule.",
       "Mention keyboard AND touch controls."
     ],
     "tags": ["space", "dodge", "reflex"],
     "added": "YYYY-MM-DD (today's date)",
     "popularity": 50,
     "license": "Original",
     "source": "Original work"
   }
   - "category" must be one of the categories in site.config.js.
   - "popularity" (0–100) controls the order in the "Popular" row. Leave 50 if unsure.
   - If the game is based on open-source code, set "license" to its license (e.g. "MIT" or
     "CC0-1.0"), add "author": "<original author>", and set "source" to the URL of the original code.

4. thumbnail.png
   - 400×300 PNG. If you can't make a nice one, run `npm run thumbnail -- <slug>` to generate a
     colourful placeholder with the title on it.

5. CHECK YOUR WORK
   - Run `npm test` (it builds the site and checks for broken links). Fix any errors it prints.
   - Run `npm run dev` and open http://localhost:8080/games/<slug>/ — click Play, then test the
     game with the keyboard, and with the browser's mobile/touch emulation.
```
