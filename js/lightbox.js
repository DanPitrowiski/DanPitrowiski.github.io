/* Lightbox: click any <img data-zoom> to view it larger.
   Optional: data-zoom="images/big-version.png" to show a higher-res file.
   Caption comes from the image's <figcaption>, or its alt text.
   Keys: Esc closes, ← → move between images on the page. */
(function () {
  var box, bigImg, caption, count, items = [], index = 0, lastFocus;

  function build() {
    box = document.createElement('div');
    box.className = 'lb';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');
    box.innerHTML =
      '<img alt="">' +
      '<p class="lb-caption"><span class="lb-text"></span><span class="lb-count"></span></p>' +
      '<button class="lb-close" type="button" aria-label="Close">×</button>' +
      '<button class="lb-prev" type="button" aria-label="Previous image">‹</button>' +
      '<button class="lb-next" type="button" aria-label="Next image">›</button>';
    document.body.appendChild(box);
    bigImg = box.querySelector('img');
    caption = box.querySelector('.lb-text');
    count = box.querySelector('.lb-count');

    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    box.addEventListener('click', function (e) { if (e.target === box || e.target === bigImg) close(); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') trapFocus(e);
    });

    // Swipe left/right on touch screens
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      startX = null;
    });
  }

  function captionFor(img) {
    var fig = img.closest('figure');
    var fc = fig && fig.querySelector('figcaption');
    return (fc && fc.textContent.trim()) || img.alt || '';
  }

  function show(i) {
    index = (i + items.length) % items.length;
    var img = items[index];
    var src = img.getAttribute('data-zoom') || img.currentSrc || img.src;
    bigImg.src = src;
    bigImg.alt = img.alt || '';
    caption.textContent = captionFor(img);
    count.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
  }

  function open(img) {
    // Only include images that actually loaded
    items = Array.prototype.filter.call(document.querySelectorAll('img[data-zoom]'), function (el) {
      return el.complete && el.naturalWidth > 0;
    });
    if (items.indexOf(img) === -1) return;
    if (!box) build();
    lastFocus = document.activeElement;
    box.classList.toggle('single', items.length < 2);
    show(items.indexOf(img));
    box.hidden = false;
    document.body.classList.add('lb-lock');
    requestAnimationFrame(function () { box.classList.add('open'); });
    box.querySelector('.lb-close').focus();
  }

  function close() {
    box.classList.remove('open');
    box.hidden = true;
    document.body.classList.remove('lb-lock');
    if (lastFocus) lastFocus.focus();
  }

  function step(dir) { if (items.length > 1) show(index + dir); }

  function trapFocus(e) {
    var btns = Array.prototype.filter.call(box.querySelectorAll('button'), function (b) {
      return b.offsetParent !== null;
    });
    var first = btns[0], last = btns[btns.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function init() {
    document.querySelectorAll('img[data-zoom]').forEach(function (img) {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Enlarge image' + (img.alt ? ': ' + img.alt : ''));
    });
    document.addEventListener('click', function (e) {
      var img = e.target.closest && e.target.closest('img[data-zoom]');
      if (!img || (box && box.contains(img))) return;
      if (img.closest('a')) e.preventDefault(); // don't follow a wrapping link
      open(img);
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('img[data-zoom]')) {
        e.preventDefault();
        open(e.target);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
