/* 1. Shows the DJP home link at the top of the sticky Contents column once the masthead has scrolled out of view.
   2. On phones, moves a case study's infobox below the title so the page opens on the headline. */
(function () {
  var toc = document.querySelector('.toc');
  var mast = document.querySelector('.masthead');
  if (toc && mast && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      toc.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(mast);
  }

  var box = document.querySelector('.article > .infobox');
  var title = document.querySelector('.article > .title-row');
  if (!box || !title || !window.matchMedia) return;
  if (!(box.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING)) return; // already below the title
  var home = document.createComment('infobox');
  box.parentNode.insertBefore(home, box);
  var anchor = title.nextElementSibling && title.nextElementSibling.matches('.meta-line') ? title.nextElementSibling : title;
  var mq = window.matchMedia('(max-width: 640px)');
  function place() {
    if (mq.matches) anchor.parentNode.insertBefore(box, anchor.nextSibling);
    else home.parentNode.insertBefore(box, home.nextSibling);
  }
  place();
  if (mq.addEventListener) mq.addEventListener('change', place); else mq.addListener(place);
})();
