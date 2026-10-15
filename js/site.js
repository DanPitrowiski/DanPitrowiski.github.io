/* Shows the DJP home link at the top of the sticky Contents column once the masthead has scrolled out of view. */
(function () {
  var toc = document.querySelector('.toc');
  var mast = document.querySelector('.masthead');
  if (!toc || !mast || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (entries) {
    toc.classList.toggle('is-stuck', !entries[0].isIntersecting);
  }).observe(mast);
})();
