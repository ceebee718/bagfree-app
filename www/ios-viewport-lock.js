(function () {
  function lockHorizontalScroll() {
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
  }

  window.addEventListener("scroll", lockHorizontalScroll, { passive: true });
  window.addEventListener("resize", lockHorizontalScroll, { passive: true });
  document.addEventListener("click", function () {
    setTimeout(lockHorizontalScroll, 50);
    setTimeout(lockHorizontalScroll, 250);
  }, true);

  document.addEventListener("gesturestart", function (event) {
    event.preventDefault();
  });
})();
