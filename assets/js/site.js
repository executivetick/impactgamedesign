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
  games: function () { return (window.GAMES || []).filter(function (g) { return g && g.id; }); },
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
    if (play.type === 'local' && /^games\/[a-z0-9\-_/.]+$/i.test(s) && s.indexOf('..') < 0) return s;
    if (play.type === 'itch' && /^https:\/\/(itch\.io|[a-z0-9-]+\.itch\.io|html-classic\.itch\.zone)\//i.test(s)) return s;
    if (play.type === 'scratch' && /^https:\/\/scratch\.mit\.edu\/projects\/\d+\/embed/i.test(s)) return s;
    return '';
  },
  card: function (g) {
    var e = C2C.esc;
    return '<a class="card" href="game.html?id=' + encodeURIComponent(g.id) + '">' +
      '<img class="cover" src="' + e(C2C.cover(g)) + '" alt="" loading="lazy" width="630" height="500">' +
      '<div class="body"><h3>' + e(g.title) + '</h3>' +
      '<p class="small">' + e(g.studio) + '</p>' +
      '<div class="chips"><span class="chip">' + e(g.genre) + '</span><span class="chip">' + e(g.engine) + '</span><span class="chip">' + e(g.course) + '</span></div>' +
      '<span class="more">Play &rarr;</span></div></a>';
  }
};
