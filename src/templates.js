// HTML templates for every generated page. The build script fills them in.
// You normally never need to touch this file: change site.config.js instead.

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const truncate = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…");

function makeTemplates(config, ctx) {
  const abs = (p) => config.url + p;
  const catBySlug = Object.fromEntries(config.categories.map((c) => [ctx.catSlug(c.name), c]));
  const catColor = (name) => (config.categories.find((c) => c.name === name) || {}).color || "#7c5cff";

  // ---------- Ads ----------
  function adSlot(position) {
    if (!config.ads.enabled) return "";
    const slot = (config.ads.slots || {})[position];
    if (!slot) return "";
    const fmt = position === "sidebar" ? 'data-ad-format="auto"' : 'data-ad-format="horizontal" data-full-width-responsive="true"';
    return `<div class="ad ad-${position}"><span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(config.ads.client)}" data-ad-slot="${esc(slot)}" ${fmt}></ins></div>`;
  }

  // ---------- Shared layout ----------
  function layout({ title, description, path, image, type = "website", ld = [], body, noindex = false, headExtra = "" }) {
    const fullTitle = title ? `${title} | ${config.name}` : `${config.name} – ${config.tagline}`;
    const img = abs(image || "/assets/share.png");
    const adsOn = config.ads.enabled && config.ads.client;
    return `<!doctype html>
<html lang="${esc(config.language)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<script>document.documentElement.classList.add("js")</script>
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(truncate(description, 160))}">
<link rel="canonical" href="${esc(abs(path))}">
${noindex ? '<meta name="robots" content="noindex,follow">\n' : ""}${config.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(config.googleSiteVerification)}">\n` : ""}<meta name="theme-color" content="#7c5cff">
<meta property="og:site_name" content="${esc(config.name)}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title || config.name)}">
<meta property="og:description" content="${esc(truncate(description, 200))}">
<meta property="og:url" content="${esc(abs(path))}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title || config.name)}">
<meta name="twitter:description" content="${esc(truncate(description, 200))}">
<meta name="twitter:image" content="${esc(img)}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/share.png">
<meta name="mobile-web-app-capable" content="yes">
${adsOn ? '<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>\n' : ""}<style>${ctx.css}</style>
${ld.map(jsonld).join("\n")}
${headExtra}<script src="/assets/${ctx.jsFile}" defer></script>
</head>
<body${adsOn ? ` data-ad-client="${esc(config.ads.client)}"` : ""}>
<a class="skip" href="#main">Skip to content</a>
<header class="topbar">
  <div class="wrap topbar-in">
    <a class="logo" href="/" aria-label="${esc(config.name)} home"><span class="logo-mark" aria-hidden="true">▶</span><span class="logo-text">${esc(config.name)}</span></a>
    <nav class="nav" aria-label="Main"><a href="/#new">New</a><a href="/#popular">Popular</a><a href="/#categories">Categories</a></nav>
    <form class="search" action="/" method="get" role="search">
      <input type="search" name="q" placeholder="Search games…" aria-label="Search games" autocomplete="off" enterkeyhint="search">
      <div class="suggest" hidden></div>
    </form>
  </div>
</header>
${adSlot("header") ? `<div class="wrap">${adSlot("header")}</div>` : ""}
<main id="main" class="wrap">
${body}
</main>
<footer class="footer">
  <div class="wrap footer-in">
    <div>
      <a class="logo" href="/"><span class="logo-mark" aria-hidden="true">▶</span><span class="logo-text">${esc(config.name)}</span></a>
      <p class="muted">${esc(config.tagline)}</p>
    </div>
    <nav aria-label="Categories"><h2>Categories</h2>${config.categories.map((c) => `<a href="/category/${ctx.catSlug(c.name)}/">${esc(c.name)}</a>`).join("")}</nav>
    <nav aria-label="Site"><h2>Site</h2><a href="/about/">About</a><a href="/privacy/">Privacy Policy</a><a href="/contact/">Contact</a><button type="button" class="linkish" data-cookie-settings>Cookie settings</button></nav>
  </div>
  <p class="wrap copy muted">© ${ctx.year} ${esc(config.name)}. All games are free to play.</p>
</footer>
<nav class="tabbar" aria-label="Quick links">
  <a href="/"${path === "/" ? ' class="on"' : ""}><span>🏠</span>Home</a>
  <a href="/#categories"${path.startsWith("/category/") ? ' class="on"' : ""}><span>🗂️</span>Categories</a>
  <button type="button" data-focus-search><span>🔎</span>Search</button>
  <button type="button" data-random><span>🎲</span>Random</button>
</nav>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="cookie" id="cookie" role="dialog" aria-live="polite" aria-label="Cookie consent" hidden>
  <p>We use cookies and local storage to save your game progress${adsOn ? " and to show ads" : ""}. <a href="/privacy/">Learn more</a>.</p>
  <div class="cookie-btns"><button type="button" class="btn btn-ghost" data-consent="essential">Only essential</button><button type="button" class="btn" data-consent="all">Accept all</button></div>
</div>
${config.cloudflareAnalyticsToken ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(config.cloudflareAnalyticsToken)}"}'></script>\n` : ""}</body>
</html>
`;
  }

  // ---------- Pieces ----------
  const counts = Object.fromEntries(config.categories.map((c) => [c.name, ctx.games.filter((g) => g.category === c.name).length]));

  function card(g, { eager = false, i = 0 } = {}) {
    const isNew = ctx.isNew(g), hot = g.popularity >= 85;
    return `<a class="card reveal" href="/games/${g.slug}/" style="--c:${catColor(g.category)};--i:${i % 12}" data-search="${esc([g.title, g.category, ...g.tags].join(" ").toLowerCase())}">
  <span class="thumb"><img src="/games/${g.slug}/thumbnail.png" alt="" width="400" height="300" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"><span class="play-hover" aria-hidden="true"><span>▶</span></span>${isNew ? '<span class="badge">New</span>' : ""}${hot ? '<span class="badge hot">🔥 Hot</span>' : ""}</span>
  <span class="card-body"><span class="card-title">${esc(g.title)}</span><span class="cat" style="--c:${catColor(g.category)}">${esc(g.category)}</span></span>
</a>`;
  }

  const row = (games, opts) => `<div class="row">${games.map((g, i) => card(g, { eager: opts && opts.eager && i < 4, i })).join("")}</div>`;
  const grid = (games, id = "") => `<div class="grid"${id ? ` id="${id}"` : ""}>${games.map((g, i) => card(g, { i })).join("")}</div>`;
  const rowHead = (ico, title, id) => `<div class="section-head"><h2${id ? ` id="${id}"` : ""}><span class="ico" aria-hidden="true">${ico}</span>${title}</h2><div class="row-nav"><button type="button" data-row="-1" aria-label="Scroll left">‹</button><button type="button" data-row="1" aria-label="Scroll right">›</button></div></div>`;

  function chips(active) {
    return `<nav class="chips" aria-label="Game categories">
  <a class="chip${active ? "" : " active"}" href="/"${active ? "" : ' aria-current="page"'}><span class="e">🎮</span> All <span class="n">${ctx.games.length}</span></a>
  ${config.categories.map((c) => { const s = ctx.catSlug(c.name); return `<a class="chip${active === s ? " active" : ""}" href="/category/${s}/" style="--c:${c.color}"${active === s ? ' aria-current="page"' : ""}><span class="e">${c.emoji}</span> ${esc(c.name)} <span class="n">${counts[c.name]}</span></a>`; }).join("\n  ")}
</nav>`;
  }

  const catTiles = () => `<div class="cats">${config.categories.map((c, i) => `<a class="cat-tile reveal" href="/category/${ctx.catSlug(c.name)}/" style="--c:${c.color};--i:${i}"><span class="big" aria-hidden="true">${c.emoji}</span><b>${esc(c.name)}</b><small>${counts[c.name]} game${counts[c.name] === 1 ? "" : "s"}</small></a>`).join("")}</div>`;

  const breadcrumbLd = (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(p) }))
  });

  // ---------- Pages ----------
  function home(games) {
    const byNew = [...games].sort((a, b) => b.added.localeCompare(a.added) || a.title.localeCompare(b.title)).slice(0, 12);
    const byPop = [...games].sort((a, b) => b.popularity - a.popularity || a.title.localeCompare(b.title)).slice(0, 12);
    const all = [...games].sort((a, b) => a.title.localeCompare(b.title));
    const spot = games.length ? byPop[Math.floor(Date.parse(ctx.today) / 864e5) % Math.min(6, byPop.length)] : null;
    const desc = `${config.tagline} Play ${games.length} free online games on ${config.name}: ${config.categories.map((c) => c.name.toLowerCase()).join(", ")} games and more. Works on phones, tablets and computers.`;
    const body = `
<section class="hero">
  <div class="floaties" aria-hidden="true"><span style="left:4%;top:10%;--s:34px;--d:8s">🎮</span><span style="left:40%;top:4%;--s:26px;--d:10s;--dl:-3s">⭐</span><span style="left:30%;top:80%;--s:30px;--d:9s;--dl:-5s">🧩</span><span style="left:50%;top:62%;--s:24px;--d:11s;--dl:-2s">🏎️</span><span style="left:1%;top:74%;--s:28px;--d:7s;--dl:-4s">👾</span><span style="left:93%;top:2%;--s:30px;--d:12s;--dl:-6s">⚽</span></div>
  <div>
    <h1>Play <span class="grad">free games</span><br>right now.</h1>
    <p class="lead">${esc(config.tagline)}</p>
    <div class="hero-cta"><button type="button" class="btn" data-random>🎲 Surprise me</button><a class="btn btn-ghost" href="#all">Browse all games</a></div>
    <ul class="stats"><li>🎮 <b>${games.length}</b> games</li><li>⚡ Instant play</li><li>📱 Phone &amp; tablet ready</li></ul>
  </div>
  ${spot ? `<a class="spotlight" href="/games/${spot.slug}/"><img src="/games/${spot.slug}/thumbnail.png" alt="" width="400" height="300" fetchpriority="high"><span class="spot-body"><span><span class="spot-tag">⭐ Game of the day</span><span class="spot-title">${esc(spot.title)}</span></span><span class="spot-play" aria-hidden="true">▶</span></span></a>` : ""}
</section>
${chips("")}
<p class="search-status" id="search-status" hidden></p>
<div id="home-rows">
<section class="section">
  ${rowHead("🆕", "New games", "new")}
  ${row(byNew, { eager: true })}
</section>
<section class="section">
  ${rowHead("🔥", "Popular games", "popular")}
  ${row(byPop)}
</section>
<section class="section">
  <div class="section-head"><h2 id="categories"><span class="ico" aria-hidden="true">🗂️</span>Categories</h2></div>
  ${catTiles()}
</section>
</div>
<section class="section" id="all">
  <div class="section-head"><h2><span class="ico" aria-hidden="true">🎮</span><span id="all-title">All games</span></h2></div>
  ${grid(all, "all-grid")}
</section>
<section class="seo-text">
  <h2>About ${esc(config.name)}</h2>
  <p>${esc(config.name)} is a collection of free browser games you can play instantly — no downloads, no installs and no account needed. Every game runs right in your web browser on desktop computers, tablets and phones, with both keyboard and touch controls.</p>
  <p>Browse by category: ${config.categories.map((c) => `<a href="/category/${ctx.catSlug(c.name)}/">${esc(c.name.toLowerCase())} games</a>`).join(", ")}. New games are added regularly, so check back soon!</p>
</section>`;
    return layout({
      title: "",
      description: desc,
      path: "/",
      ld: [{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: config.name,
        url: abs("/"),
        description: config.tagline,
        potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: abs("/?q={search_term_string}") }, "query-input": "required name=search_term_string" }
      }, {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: config.name,
        url: abs("/"),
        logo: abs("/assets/favicon.svg")
      }],
      body
    });
  }

  function category(cat, games) {
    const slug = ctx.catSlug(cat.name);
    const list = [...games].sort((a, b) => b.popularity - a.popularity || a.title.localeCompare(b.title));
    const n = list.length;
    const desc = n
      ? `Play ${n} free ${cat.name.toLowerCase()} game${n === 1 ? "" : "s"} online on ${config.name}, including ${list.slice(0, 3).map((g) => g.title).join(", ")}. No downloads — play instantly in your browser.`
      : `Free ${cat.name.toLowerCase()} games are coming soon to ${config.name}.`;
    const body = `
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><span>${esc(cat.name)}</span></nav>
<section class="cat-hero" style="--c:${cat.color}">
  <span class="big" aria-hidden="true">${cat.emoji}</span>
  <h1>${esc(cat.name)} games</h1>
  <p>${esc(desc)}</p>
</section>
${chips(slug)}
${n ? grid(list) : `<div class="empty"><span class="big">${cat.emoji}</span><p>No ${esc(cat.name.toLowerCase())} games yet — new ones are on the way!</p><a class="btn" href="/">Browse all games</a></div>`}`;
    return layout({
      title: `${cat.name} Games – Play Free Online`,
      description: desc,
      path: `/category/${slug}/`,
      noindex: !n,
      ld: [
        breadcrumbLd([["Home", "/"], [cat.name, `/category/${slug}/`]]),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${cat.name} games`,
          url: abs(`/category/${slug}/`),
          mainEntity: { "@type": "ItemList", itemListElement: list.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/games/${g.slug}/`), name: g.title })) }
        }
      ],
      body
    });
  }

  function game(g, games) {
    const others = games.filter((x) => x.slug !== g.slug);
    const more = [...others.filter((x) => x.category === g.category), ...others.filter((x) => x.category !== g.category).sort((a, b) => b.popularity - a.popularity)].slice(0, 12);
    const popular = [...others].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
    const cs = g.categorySlug;
    const desc = `Play ${g.title} free online. ${g.description}`;
    const body = `
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><a href="/category/${cs}/">${esc(g.category)}</a><span aria-hidden="true">›</span><span>${esc(g.title)}</span></nav>
<div class="game-layout">
  <div class="game-main">
    <div class="stage">
      <div class="stage-glow" style="background-image:url(/games/${g.slug}/thumbnail.png)" aria-hidden="true"></div>
      <div class="player" id="player">
        <iframe id="game-frame" title="${esc(g.title)}" data-src="/games/${g.slug}/play/" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe>
        <div class="loader" id="loader" hidden><div><i></i>Loading ${esc(g.title)}…</div></div>
        <button type="button" class="play-overlay" id="play-btn" aria-label="Play ${esc(g.title)}">
          <img class="bg" src="/games/${g.slug}/thumbnail.png" alt="" width="400" height="300">
          <span class="play-inner">
            <img class="play-card" src="/games/${g.slug}/thumbnail.png" alt="" width="400" height="300" fetchpriority="high">
            <span class="play-title">${esc(g.title)}</span>
            <span class="play-btn"><span aria-hidden="true">▶</span> Play now</span>
          </span>
        </button>
        <button type="button" class="fs-exit" id="fs-exit" aria-label="Exit fullscreen">✕</button>
      </div>
    </div>
    <div class="player-bar">
      <h1>${esc(g.title)}</h1>
      <div class="player-actions">
        <a class="pill" href="/category/${cs}/" style="--c:${catColor(g.category)}">${esc(g.category)}</a>
        <button type="button" class="btn btn-ghost btn-icon" id="restart-btn" aria-label="Restart game" title="Restart">↻</button>
        <button type="button" class="btn btn-ghost btn-icon" id="share-btn" aria-label="Share this game" title="Share">🔗</button>
        <button type="button" class="btn" id="fs-btn"><span aria-hidden="true">⛶</span> Fullscreen</button>
      </div>
    </div>
    ${adSlot("belowGame")}
    <div class="info">
      <section>
        <h2>About ${esc(g.title)}</h2>
        <p>${esc(g.description)}</p>
        ${g.tags.length ? `<p class="tags">${g.tags.map((t) => `<span>#${esc(t)}</span>`).join("")}</p>` : ""}
      </section>
      <section>
        <h2>How to play</h2>
        <ul>${g.instructions.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </section>
    </div>
    ${more.length ? `<section class="section">${rowHead("🎯", "More games like this")}${row(more)}</section>` : ""}
  </div>
  <aside class="game-side">
    ${adSlot("sidebar")}
    ${popular.length ? `<h2>🔥 Popular now</h2><div class="side-list">${popular.map((x) => `<a class="side-item" href="/games/${x.slug}/"><img src="/games/${x.slug}/thumbnail.png" alt="" width="96" height="72" loading="lazy" decoding="async"><span><span class="card-title">${esc(x.title)}</span><span class="muted">${esc(x.category)}</span></span></a>`).join("")}</div>` : ""}
  </aside>
</div>`;
    return layout({
      title: `${g.title} – Play Free Online`,
      description: desc,
      path: `/games/${g.slug}/`,
      image: `/games/${g.slug}/thumbnail.png`,
      type: "website",
      ld: [
        breadcrumbLd([["Home", "/"], [g.category, `/category/${cs}/`], [g.title, `/games/${g.slug}/`]]),
        {
          "@context": "https://schema.org",
          "@type": "VideoGame",
          name: g.title,
          url: abs(`/games/${g.slug}/`),
          image: abs(`/games/${g.slug}/thumbnail.png`),
          description: g.description,
          genre: g.category,
          keywords: g.tags.join(", "),
          gamePlatform: "Web browser",
          applicationCategory: "Game",
          operatingSystem: "Any",
          datePublished: g.added,
          author: { "@type": "Organization", name: g.author },
          publisher: { "@type": "Organization", name: config.name },
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" }
        }
      ],
      body
    });
  }

  function staticPage({ slug, title, description, html }) {
    return layout({
      title,
      description,
      path: `/${slug}/`,
      ld: [breadcrumbLd([["Home", "/"], [title, `/${slug}/`]])],
      body: `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><span>${esc(title)}</span></nav>
<article class="prose">${html}</article>`
    });
  }

  function about(games) {
    const credits = games.map((g) => `<tr><td><a href="/games/${g.slug}/">${esc(g.title)}</a></td><td>${esc(g.author)}</td><td>${esc(g.license)}</td><td>${/^https?:/.test(g.source) ? `<a href="${esc(g.source)}" rel="noopener">source</a>` : esc(g.source)}</td></tr>`).join("");
    return staticPage({
      slug: "about",
      title: "About",
      description: `About ${config.name}: a free collection of simple, fast browser games for everyone.`,
      html: `<h1>About ${esc(config.name)}</h1>
<p>${esc(config.name)} is a small, fast website of free browser games. Our goal is simple: games that load instantly, work on any device and are fun for a few minutes or a few hours.</p>
<h2>What makes us different</h2>
<ul>
<li><strong>No downloads or sign-ups.</strong> Every game runs right in your browser.</li>
<li><strong>Works everywhere.</strong> All games support keyboard and touch controls, so they work on computers, tablets and phones.</li>
<li><strong>Family friendly.</strong> We never host gambling, betting or real-money games.</li>
<li><strong>Lightweight.</strong> No heavy downloads — pages are built to load fast even on slow connections.</li>
</ul>
<h2>Who runs this site</h2>
<p>${esc(config.name)} is run by ${esc(config.owner)}. We create our own games and only add third-party games that have a clear open-source license.</p>
<h2>Game credits &amp; licenses</h2>
<div class="table-wrap"><table><thead><tr><th>Game</th><th>Author</th><th>License</th><th>Source</th></tr></thead><tbody>${credits}</tbody></table></div>
<p>Questions or feedback? <a href="/contact/">Contact us</a>.</p>`
    });
  }

  function privacy() {
    const ads = config.ads.enabled;
    return staticPage({
      slug: "privacy",
      title: "Privacy Policy",
      description: `Privacy Policy for ${config.name}. Learn what data we collect, how cookies and ads work, and your choices.`,
      html: `<h1>Privacy Policy</h1>
<p class="muted">Last updated: ${ctx.today}</p>
<p>This Privacy Policy explains how ${esc(config.name)} ("we", "us") handles information when you visit ${esc(config.url.replace(/^https?:\/\//, ""))} (the "Site"). We keep data collection to a minimum.</p>
<h2>Information we collect</h2>
<ul>
<li><strong>No accounts.</strong> We do not ask you to register and we do not collect your name, address or other personal details.</li>
<li><strong>Game progress.</strong> Games save things like high scores in your browser's local storage. This data stays on your device and is never sent to us.</li>
<li><strong>Your cookie choice.</strong> We store your cookie preference in local storage so we don't ask you again.</li>
<li><strong>Server logs.</strong> Our hosting provider (Cloudflare) may process technical data such as IP address, browser type and pages visited to deliver and protect the Site.</li>
${config.cloudflareAnalyticsToken ? "<li><strong>Analytics.</strong> We use Cloudflare Web Analytics, which does not use cookies and does not track you across sites, to count visits.</li>" : ""}
</ul>
<h2>Cookies and advertising</h2>
<p>We may show ads served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visits to this Site and/or other sites on the Internet.</p>
<ul>
<li>You can opt out of personalised advertising by visiting <a href="https://adssettings.google.com" rel="noopener">Google Ads Settings</a>.</li>
<li>You can opt out of some third-party vendors' use of cookies for personalised advertising at <a href="https://www.aboutads.info/choices/" rel="noopener">www.aboutads.info</a>.</li>
<li>Learn more about <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">how Google uses information from sites that use its services</a>.</li>
</ul>
<p>${ads ? "When you first visit, we ask for your consent. If you choose \"Only essential\", any ads shown will be non-personalised." : "Ads are currently turned off on this Site."} You can change your choice at any time: <button type="button" class="linkish" data-cookie-settings>open cookie settings</button>.</p>
<h2>Games embedded on the Site</h2>
<p>Games run inside a frame on our own domain. They do not collect personal information. Some games save progress in local storage on your device.</p>
<h2>Children's privacy</h2>
<p>The Site is intended for a general audience. We do not knowingly collect personal information from children under 13 (or the equivalent minimum age in your country). If you believe a child has provided us with personal information, please contact us and we will delete it.</p>
<h2>Your rights</h2>
<p>Depending on where you live (for example in the EU, UK or California), you may have the right to access, correct or delete personal data and to object to certain processing. Because we don't store personal data ourselves, most requests can be handled by clearing your browser's cookies and local storage, or by using the links above. You can also contact us.</p>
<h2>Changes</h2>
<p>We may update this policy from time to time. The "Last updated" date above shows when it was last changed.</p>
<h2>Contact</h2>
<p>Questions about this policy? Email <a href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a> or visit our <a href="/contact/">contact page</a>.</p>`
    });
  }

  function contact() {
    return staticPage({
      slug: "contact",
      title: "Contact",
      description: `Contact ${config.name}: questions, feedback, bug reports and game suggestions.`,
      html: `<h1>Contact us</h1>
<p>We'd love to hear from you! Whether you found a bug, have an idea for a new game, or have a question about the Site, send us an email.</p>
<p class="contact-box"><span aria-hidden="true">✉️</span> <a href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a></p>
<h2>Helpful details to include</h2>
<ul>
<li>The name of the game (or a link to its page).</li>
<li>Your device and browser, for example "iPhone, Safari" or "Windows, Chrome".</li>
<li>What happened and what you expected to happen.</li>
</ul>
<h2>Copyright and licensing</h2>
<p>If you believe a game on this Site uses your work without permission, please email us with a link to the game and proof of ownership. We will review it and remove it promptly if needed. See our <a href="/about/">About page</a> for the license of every game.</p>
<p>We usually reply within a few days.</p>`
    });
  }

  function notFound() {
    return layout({
      title: "Page not found",
      description: "This page could not be found.",
      path: "/404.html",
      noindex: true,
      body: `<div class="empty"><span class="big">👾</span><h1>404 – Game over!</h1><p>We couldn't find that page. It may have moved, or the link might be wrong.</p><a class="btn" href="/">Back to all games</a></div>`
    });
  }

  return { home, category, game, about, privacy, contact, notFound, catBySlug };
}

module.exports = { makeTemplates, esc };
