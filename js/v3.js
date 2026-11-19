/* v3.js: behavior for the v3 pages (index.html and the pages built from it).
   1. Highlights the current section in the sticky contents rail.
   2. Tabs for the industry tag sets (arrow keys move between tabs).
   3. Pauses looping videos for people who prefer reduced motion. */
(function () {
  // 1. Contents rail
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var setActive = function (id) {
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    };
    var pick = function () {
      var line = window.innerHeight * 0.3, current = targets[0];
      targets.forEach(function (t) { if (t && t.getBoundingClientRect().top <= line) current = t; });
      if (current) setActive(current.id);
    };
    var io = new IntersectionObserver(pick, { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] });
    targets.forEach(function (t) { if (t) io.observe(t); });
    window.addEventListener('scroll', pick, { passive: true });
    pick();
  }

  // 2. Tabs
  Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      var list = document.getElementById(tab.getAttribute('aria-controls'));
      list = list && list.querySelector('.tagset-list');
      if (list) { list.scrollTop = 0; fade(list); }
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  // Hide the bottom fade once a list is scrolled to the end (or is short)
  function fade(list) { list.classList.toggle('at-end', list.scrollTop + list.clientHeight >= list.scrollHeight - 2); }
  Array.prototype.forEach.call(document.querySelectorAll('.tagset-list'), function (list) {
    list.addEventListener('scroll', function () { fade(list); }, { passive: true });
    fade(list);
  });

  // 3. Reduced motion: show the poster frame instead of the loop
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var apply = function () {
    Array.prototype.forEach.call(document.querySelectorAll('video[autoplay]'), function (v) {
      if (mq && mq.matches) { v.pause(); v.removeAttribute('autoplay'); v.dataset.paused = '1'; }
    });
    if (mq && !mq.matches) {
      Array.prototype.forEach.call(document.querySelectorAll('video[data-paused]'), function (v) {
        v.setAttribute('autoplay', ''); delete v.dataset.paused; var p = v.play(); if (p && p.catch) p.catch(function () {});
      });
    }
  };
  apply();
  if (mq && mq.addEventListener) mq.addEventListener('change', apply);
})();
