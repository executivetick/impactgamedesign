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
