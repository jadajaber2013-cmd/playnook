// Site behaviour: search, game player, fullscreen, cookie consent and ads.
(function () {
  "use strict";
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var escHtml = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var norm = function (s) { return String(s || "").toLowerCase().trim(); };

  /* ---------- Search ---------- */
  var index = null;
  function loadIndex() {
    if (index) return Promise.resolve(index);
    return fetch("/search-index.json").then(function (r) { return r.json(); }).then(function (d) { index = d; return d; }).catch(function () { return []; });
  }
  function matches(g, q) {
    var hay = norm(g.title + " " + g.category + " " + (g.tags || []).join(" "));
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  var form = $(".search"), input = form && $("input", form), box = form && $(".suggest", form);
  var allGrid = $("#all-grid");
  var active = -1;

  function renderSuggest(q) {
    if (!q) { box.hidden = true; return; }
    loadIndex().then(function (list) {
      if (norm(input.value) !== q) return;
      var hits = list.filter(function (g) { return matches(g, q); }).slice(0, 6);
      active = -1;
      box.innerHTML = hits.length
        ? hits.map(function (g) { return '<a href="/games/' + g.slug + '/"><img src="/games/' + g.slug + '/thumbnail.png" alt="" width="48" height="36"><span>' + escHtml(g.title) + '</span><span class="muted">' + escHtml(g.category) + "</span></a>"; }).join("")
        : "<p>No games found for “" + escHtml(q) + "”</p>";
      box.hidden = false;
    });
  }

  function filterGrid(q) {
    var cards = $$(".card", allGrid), shown = 0;
    cards.forEach(function (c) {
      var ok = !q || q.split(/\s+/).every(function (w) { return c.getAttribute("data-search").indexOf(w) !== -1; });
      c.hidden = !ok;
      if (ok) shown++;
    });
    var rows = $("#home-rows"), status = $("#search-status"), title = $("#all-title");
    if (rows) {
      if (q && !rows.hidden) { var all = $("#all"); if (all) all.scrollIntoView({ behavior: "smooth", block: "start" }); }
      rows.hidden = !!q;
    }
    if (status) {
      status.hidden = !q;
      status.textContent = q ? (shown ? shown + " game" + (shown === 1 ? "" : "s") + " matching “" + q + "”" : "No games match “" + q + "”. Try another word!") : "";
    }
    if (title) title.textContent = q ? "🔎 Search results" : "🎮 All games";
  }

  if (form) {
    input.addEventListener("focus", loadIndex, { once: true });
    input.addEventListener("input", function () {
      var q = norm(input.value);
      if (allGrid) filterGrid(q); else renderSuggest(q);
    });
    input.addEventListener("keydown", function (e) {
      var links = $$("a", box);
      if (box.hidden || !links.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links.forEach(function (a, i) { a.classList.toggle("on", i === active); });
      } else if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        location.href = links[active].href;
      } else if (e.key === "Escape") box.hidden = true;
    });
    form.addEventListener("submit", function (e) {
      if (allGrid) { e.preventDefault(); filterGrid(norm(input.value)); history.replaceState(null, "", input.value ? "/?q=" + encodeURIComponent(input.value) : "/"); input.blur(); }
    });
    document.addEventListener("click", function (e) { if (box && !form.contains(e.target)) box.hidden = true; });
    if (allGrid) {
      var q0 = new URLSearchParams(location.search).get("q");
      if (q0) { input.value = q0; filterGrid(norm(q0)); }
    }
  }

  /* ---------- Game player ---------- */
  var player = $("#player"), frame = $("#game-frame"), playBtn = $("#play-btn");
  var loader = $("#loader");
  function startGame() {
    if (!frame || frame.getAttribute("src")) return;
    if (loader) { loader.hidden = false; loader.classList.remove("done"); }
    frame.addEventListener("load", function () {
      if (loader) { loader.classList.add("done"); setTimeout(function () { loader.hidden = true; }, 400); }
      try { frame.focus(); frame.contentWindow.focus(); } catch (e) {}
    }, { once: true });
    frame.src = frame.getAttribute("data-src");
    if (playBtn) { playBtn.classList.add("leaving"); setTimeout(function () { playBtn.remove(); playBtn = null; }, 500); }
  }
  if (playBtn) playBtn.addEventListener("click", startGame);

  var restartBtn = $("#restart-btn");
  if (restartBtn) restartBtn.addEventListener("click", function () {
    if (!frame.getAttribute("src")) return startGame();
    frame.removeAttribute("src");
    startGame();
    toast("Restarted ↻");
  });
  var shareBtn = $("#share-btn");
  if (shareBtn) shareBtn.addEventListener("click", function () {
    var data = { title: document.title, url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(function () { toast("Link copied! 🔗"); }, function () { toast(location.href); });
  });

  var fsBtn = $("#fs-btn"), fsExit = $("#fs-exit");
  function exitFake() { player.classList.remove("fake-fs"); document.body.classList.remove("no-scroll"); }
  // Fills the browser window when real fullscreen isn't available (e.g. iPhone Safari).
  function fakeFs() {
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    player.classList.add("fake-fs");
    document.body.classList.add("no-scroll");
  }
  if (fsBtn) fsBtn.addEventListener("click", function () {
    startGame();
    var req = player.requestFullscreen || player.webkitRequestFullscreen;
    if (req) {
      try {
        var p = req.call(player);
        if (p && p.catch) p.catch(fakeFs);
      } catch (e) { fakeFs(); }
      setTimeout(fakeFs, 1000); // some embedded browsers never answer the request
    } else fakeFs();
    try { frame.focus(); } catch (e) {}
  });
  if (fsExit) fsExit.addEventListener("click", exitFake);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && player && player.classList.contains("fake-fs")) exitFake(); });

  /* ---------- Look & feel ---------- */
  var toastEl = $("#toast"), toastT;
  function toast(text) {
    if (!toastEl) return;
    toastEl.textContent = text; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 1800);
  }

  // Fade thumbnails in once they have loaded (a shimmer shows until then).
  $$(".thumb img").forEach(function (img) {
    var done = function () { img.parentNode.classList.add("loaded"); };
    if (img.complete) done(); else { img.addEventListener("load", done); img.addEventListener("error", done); }
  });

  // Cards and tiles float in as they scroll into view.
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add("in"); });

  // 3D tilt that follows the mouse (desktop only).
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add("tilting");
        card.style.setProperty("--ry", (px * 14).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-py * 14).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.classList.remove("tilting");
        card.style.setProperty("--ry", "0deg"); card.style.setProperty("--rx", "0deg");
      });
    });
  }

  // Header shrinks and gets a shadow once you scroll.
  var topbar = $(".topbar");
  var onScroll = function () { if (topbar) topbar.classList.toggle("scrolled", scrollY > 10); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Arrow buttons next to the horizontal rows.
  $$(".section-head").forEach(function (head) {
    var rowEl = head.nextElementSibling, btns = $$("[data-row]", head);
    if (!rowEl || !rowEl.classList.contains("row") || !btns.length) return;
    var sync = function () {
      btns[0].disabled = rowEl.scrollLeft < 8;
      btns[1].disabled = rowEl.scrollLeft + rowEl.clientWidth > rowEl.scrollWidth - 8;
    };
    btns.forEach(function (b) { b.addEventListener("click", function () { rowEl.scrollBy({ left: +b.getAttribute("data-row") * rowEl.clientWidth * 0.85, behavior: "smooth" }); }); });
    rowEl.addEventListener("scroll", sync, { passive: true }); addEventListener("resize", sync); sync();
  });

  // "Surprise me" / Random buttons.
  $$("[data-random]").forEach(function (b) {
    b.addEventListener("click", function () {
      loadIndex().then(function (list) {
        if (!list.length) return;
        var here = location.pathname, pick;
        do { pick = list[Math.floor(Math.random() * list.length)]; } while (list.length > 1 && here.indexOf("/" + pick.slug + "/") !== -1);
        location.href = "/games/" + pick.slug + "/";
      });
    });
  });
  $$("[data-focus-search]").forEach(function (b) {
    b.addEventListener("click", function () { if (input) { scrollTo({ top: 0, behavior: "smooth" }); input.focus(); } });
  });

  /* ---------- Cookie consent + ads ---------- */
  var adClient = document.body.getAttribute("data-ad-client");
  var banner = $("#cookie");
  var adsLoaded = false;

  function loadAds(consent) {
    if (!adClient || adsLoaded) return;
    adsLoaded = true;
    window.adsbygoogle = window.adsbygoogle || [];
    // Without full consent, ask Google for non-personalised ads only.
    if (consent !== "all") window.adsbygoogle.requestNonPersonalizedAds = 1;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(adClient);
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
    $$("ins.adsbygoogle").forEach(function () { try { window.adsbygoogle.push({}); } catch (e) {} });
  }

  var consent = store.get("cookie-consent");
  if (consent) loadAds(consent);
  else if (banner) banner.hidden = false;

  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () {
      var choice = b.getAttribute("data-consent");
      var changed = consent && consent !== choice;
      store.set("cookie-consent", choice);
      consent = choice;
      banner.hidden = true;
      if (changed && adsLoaded) location.reload(); else loadAds(choice);
    });
  });
  $$("[data-cookie-settings]").forEach(function (b) {
    b.addEventListener("click", function () { if (banner) { banner.hidden = false; $("button", banner).focus(); } });
  });
})();
