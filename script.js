// ─── MOBILE NAV TOGGLE ───
(function () {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
})();

// ─── HEADER STATE ON SCROLL ───
(function () {
    var header = document.getElementById('header');
    if (!header) return;

    function update() {
        header.classList.toggle('scrolled', window.pageYOffset > 40);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
})();

// ─── SMOOTH SCROLL FOR IN-PAGE ANCHORS ───
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (!id || id === '#') return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();
