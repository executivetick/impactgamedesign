/* Code to Create — shared site behavior. No editing needed here. */
(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

var C2C = {
  // Games listed by hand / the Game Publisher (games.js) come first, then games found
  // automatically in games/gamelab, games/unity and games/html5 (games-auto.js).
  games: function () {
    var seen = {}, out = [];
    (window.GAMES || []).concat(window.AUTO_GAMES || []).forEach(function (g) {
      if (g && g.id && !seen[g.id]) { seen[g.id] = 1; out.push(g); }
    });
    return out;
  },
  esc: function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  },
  cover: function (g) { return g.cover ? g.cover : 'assets/img/game-placeholder.webp'; },
  // Only allow game embeds from this site, itch.io and Scratch.
  safeSrc: function (play) {
    if (!play || !play.src) return '';
    var s = String(play.src);
    if (play.type === 'local' && /^games\/[a-z0-9\-_/.%]+$/i.test(s) && s.indexOf('..') < 0) return s;
    if (play.type === 'gamelab' && /^[A-Za-z0-9_\-]+$/.test(s)) return 'gamelab/play.html?game=' + encodeURIComponent(s);
    if (play.type === 'itch' && /^https:\/\/(itch\.io|[a-z0-9-]+\.itch\.io|html-classic\.itch\.zone)\//i.test(s)) return s;
    if (play.type === 'scratch' && /^https:\/\/scratch\.mit\.edu\/projects\/\d+\/embed/i.test(s)) return s;
    if (play.type === 'codeorg') return C2C.codeorgEmbed(s);
    return '';
  },
  // Code.org Game Lab / App Lab / Sprite Lab: accepts the share link, the embed link,
  // or the whole <iframe> code, and turns it into a play-only embed link.
  codeorgEmbed: function (s) {
    var m = String(s).match(/https:\/\/studio\.code\.org\/projects\/(gamelab|applab|spritelab)\/([A-Za-z0-9_\-]+)/i);
    return m ? 'https://studio.code.org/projects/' + m[1].toLowerCase() + '/' + m[2] + '/embed' : '';
  },
  // Code.org Game Lab / Sprite Lab: show only the game square (no white "Tap or click to run"
  // box, empty control panel or footer), scaled up to fit, with our own title cover on top.
  // The cover lets clicks pass through, so the player's one click starts the game.
  // App Lab apps keep Code.org's full phone-shaped player.
  // Where the game square sits inside Code.org's player (in Code.org's pixels).
  // If the game looks shifted, adjust offsetX (left/right) or offsetY (up/down).
  CODEORG: { game: 400, offsetX: 21, offsetY: 1, frameW: 460, frameH: 640, maxW: 560 },
  fitCodeorg: function (box, g) {
    if (!g.play || g.play.type !== 'codeorg') return;
    var lab = ((String(g.play.src).match(/projects\/(gamelab|applab|spritelab)\//i) || [])[1] || 'gamelab').toLowerCase();
    var frame = box.querySelector('iframe');
    box.style.marginInline = 'auto';
    box.style.maxWidth = '100%';
    if (lab === 'applab' || !frame) {
      box.style.aspectRatio = '328 / 568'; box.style.width = '328px'; box.style.background = 'transparent';
      return;
    }
    var C = C2C.CODEORG;
    box.style.aspectRatio = '1 / 1';
    box.style.width = C.maxW + 'px';
    box.style.position = 'relative';
    box.style.overflow = 'hidden';
    box.style.background = '#0B1F3A';
    frame.style.position = 'absolute';
    frame.style.left = '0'; frame.style.top = '0';
    frame.style.width = C.frameW + 'px'; frame.style.height = C.frameH + 'px';
    frame.style.maxWidth = 'none';
    frame.style.transformOrigin = '0 0';
    function scale() {
      var s = box.clientWidth / C.game;
      frame.style.transform = 'scale(' + s + ') translate(' + (-C.offsetX) + 'px,' + (-C.offsetY) + 'px)';
    }
    scale();
    window.addEventListener('resize', scale);
    // the crop must never scroll (focus changes can try to)
    box.addEventListener('scroll', function () { box.scrollTop = 0; box.scrollLeft = 0; });

    // title cover
    var cover = document.createElement('div');
    cover.setAttribute('aria-hidden', 'true');
    cover.style.cssText = 'position:absolute;inset:0;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:24px;color:#fff;background:#0B1F3A center/cover no-repeat;transition:opacity .25s';
    if (g.poster) {
      cover.style.backgroundImage = 'url("' + g.poster + '")';
      cover.innerHTML = '<span style="margin-top:auto;display:inline-flex;align-items:center;gap:10px;background:rgba(11,31,58,.88);border-radius:999px;padding:10px 20px;font:700 16px var(--font-body)">' +
        '<span style="width:0;height:0;border-left:14px solid #C8102E;border-top:9px solid transparent;border-bottom:9px solid transparent"></span>Click to play</span>';
    } else {
      cover.innerHTML = '<span style="font:800 13px var(--font-body);letter-spacing:.14em;text-transform:uppercase;color:#FF8A9B">' + C2C.esc(g.engine || 'Game Lab') + '</span>' +
        '<span style="font:800 clamp(28px,6vw,44px)/1.1 var(--font-head);max-width:90%">' + C2C.esc(g.title) + '</span>' +
        (g.studio ? '<span style="color:#DCE4EF;font-size:15px">by ' + C2C.esc(g.studio) + '</span>' : '') +
        '<span style="margin-top:18px;width:0;height:0;border-left:44px solid #C8102E;border-top:28px solid transparent;border-bottom:28px solid transparent"></span>' +
        '<span style="font:700 18px var(--font-body)">Click to play</span>';
    }
    box.appendChild(cover);
    window.addEventListener('blur', function () {
      setTimeout(function () { if (document.activeElement === frame) { cover.style.opacity = '0'; setTimeout(function () { cover.hidden = true; }, 260); } }, 0);
    });

    // keep Code.org's credit
    if (!box.nextElementSibling || !box.nextElementSibling.classList || !box.nextElementSibling.classList.contains('co-credit')) {
      var credit = document.createElement('p');
      credit.className = 'small co-credit';
      credit.style.cssText = 'text-align:center;margin-top:6px';
      credit.innerHTML = 'Built on <a href="' + C2C.esc(C2C.codeorgShare(g.play.src)) + '" target="_blank" rel="noopener">Code.org</a>';
      box.insertAdjacentElement('afterend', credit);
    }
  },
  // Game mode: while a game frame has keyboard focus, freeze page scrolling so the
  // arrow keys and Space move the game instead of the page. Clicking outside the game ends it.
  gameMode: function (frame, note) {
    var root = document.documentElement, on = false;
    function lock() {
      if (on) return; on = true;
      var box = frame.closest('.player') || frame;
      var r = box.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight) window.scrollBy({ top: r.top + r.height / 2 - window.innerHeight / 2, behavior: 'smooth' });
      var bar = window.innerWidth - root.clientWidth;
      setTimeout(function () {
        if (!on) return;
        root.style.overflow = 'hidden';
        if (bar > 0) document.body.style.paddingRight = bar + 'px';
      }, 350);
      if (note) note.hidden = false;
    }
    function unlock() {
      if (!on) return; on = false;
      root.style.overflow = ''; document.body.style.paddingRight = '';
      if (note) note.hidden = true;
    }
    window.addEventListener('blur', function () { setTimeout(function () { if (document.activeElement === frame) lock(); }, 0); });
    window.addEventListener('focus', unlock);
    document.addEventListener('mousedown', unlock);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') unlock(); });
  },
  codeorgShare: function (s) {
    var m = String(s).match(/https:\/\/studio\.code\.org\/projects\/(gamelab|applab|spritelab)\/([A-Za-z0-9_\-]+)/i);
    return m ? 'https://studio.code.org/projects/' + m[1].toLowerCase() + '/' + m[2] + '' : '';
  },
  card: function (g) {
    var e = C2C.esc;
    return '<a class="card" href="game.html?id=' + encodeURIComponent(g.id) + '">' +
      '<img class="cover" src="' + e(C2C.cover(g)) + '" alt="" loading="lazy" width="630" height="500">' +
      '<div class="body"><h3>' + e(g.title) + '</h3>' +
      '<p class="small">' + e(g.studio) + '</p>' +
      '<div class="chips">' + [g.genre, g.engine, g.course].filter(Boolean).map(function (t) { return '<span class="chip">' + e(t) + '</span>'; }).join('') + '</div>' +
      '<span class="more">Play &rarr;</span></div></a>';
  }
};
