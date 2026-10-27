// ============================================================
//  SITE SETTINGS — this is the ONE file you edit to customise
//  the site. After changing it, run `npm run build` (or just push
//  to GitHub and the site rebuilds itself).
// ============================================================

module.exports = {
  // Your site's name. Shown in the header, page titles and footer.
  name: "PlayNook",

  // A short slogan shown on the homepage and in search results.
  tagline: "Free browser games. No downloads, no sign-ups — just play.",

  // The full address of your live site, WITHOUT a trailing slash.
  // Change this once you have a domain (or your *.pages.dev address).
  // It is used for SEO tags, the sitemap and robots.txt.
  url: "https://playnook-3we.pages.dev",

  // Shown on the Contact and Privacy pages.
  contactEmail: "hello@example.com",

  // Who runs the site (shown on the About and Privacy pages).
  owner: "The PlayNook team",

  // Language of the site (used in <html lang="..">).
  language: "en",

  // Name of your Cloudflare Pages project. The GitHub Action deploys
  // to this project (it is created automatically on first deploy).
  // Use lowercase letters, numbers and dashes only.
  cloudflareProject: "playnook",

  // The game categories. Every game's meta.json "category" must be
  // one of these names. Order here = order of the filter chips.
  categories: [
    { name: "Arcade",   emoji: "👾", color: "#ff5d73" },
    { name: "Puzzle",   emoji: "🧩", color: "#7c5cff" },
    { name: "Racing",   emoji: "🏎️", color: "#ff9f1c" },
    { name: "Sports",   emoji: "⚽", color: "#2ec4b6" },
    { name: "Kids",     emoji: "🧸", color: "#ffbf00" },
    { name: "Strategy", emoji: "♟️", color: "#3a86ff" }
  ],

  // ---------- Google AdSense ----------
  // 1. Get approved for AdSense.
  // 2. Paste your publisher ID below (looks like "ca-pub-1234567890123456").
  // 3. Optionally paste ad-unit slot IDs (numbers from AdSense > Ads > By ad unit).
  //    If you leave a slot empty, that spot shows no ad (Auto ads still work).
  // 4. Set enabled to true and push.
  ads: {
    enabled: false,
    client: "ca-pub-0000000000000000",
    slots: {
      header: "",     // wide banner under the top bar
      sidebar: "",    // tall ad next to the game (below it on phones)
      belowGame: ""   // banner directly under the game
    }
  },

  // Optional: Google Search Console verification code — just the "content" value from
  // <meta name="google-site-verification" content="...">. Leave "" if you don't use it.
  googleSiteVerification: "jIor2GMG8Vmq-GRRpOqS2h5vA3Q59W8fBCQICXzsvE0",

  // Optional: free, cookie-less Cloudflare Web Analytics.
  // Paste the token from Cloudflare dashboard > Analytics > Web Analytics.
  cloudflareAnalyticsToken: ""
};
