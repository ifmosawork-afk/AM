// ─── HAMBURGER MENU TOGGLE ───
(function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked (mobile)
        document.querySelectorAll('.nav-links a').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }
})();

// ─── HEADER SCROLL EFFECT ───
(function() {
    const header = document.getElementById('header');

    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
})();

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
(function() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

// ─── SCROLL REVEAL ANIMATION ───
(function() {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(function(el) {
            observer.observe(el);
        });
    }
})();

// ─── COUNTER ANIMATION ───
(function() {
    function animateCounter(el) {
        const target = el.getAttribute('data-count');
        if (!target) return;

        const suffix = target.match(/[^0-9.]/) ? target.match(/[^0-9.]/)[0] : '';
        const num = parseFloat(target);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * num;

            if (num >= 1000) {
                el.textContent = Math.round(current).toLocaleString() + suffix;
            } else if (num % 1 !== 0) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.round(current) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(function(c) {
                    if (!c.dataset.animated) {
                        c.dataset.animated = 'true';
                        animateCounter(c);
                    }
                });
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal, .stat-card, .impact-item, .invest-card, .timeline-item, .focus-item, .solar-card, .smart-card, .oil-card, .overview-text, .hero-metrics').forEach(function(el) {
        counterObserver.observe(el);
    });

    // Also observe hero metrics directly
    document.querySelectorAll('.hero-metrics .number[data-count]').forEach(function(el) {
        counterObserver.observe(el);
    });
})();

// ─── ACTIVE NAV LINK HIGHLIGHT ───
(function() {
    const currentPath = window.location.pathname;

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        const href = link.getAttribute('href');
        if (!href) return;

        // Check if the link href matches the current path
        if (href === currentPath || (href !== '/' && currentPath.startsWith(href) && href !== '#')) {
            link.style.color = 'var(--silver)';
        }

        // Handle homepage special case
        if (currentPath === '/' && href === '/') {
            link.style.color = 'var(--silver)';
        }
    });
})();

// ─── CONSOLE BRANDING ───
console.log('🚀 AM International Group — Building Businesses For Tomorrow.');
console.log('📍 East Africa · Europe · Gulf Region');
console.log('🏗️ Construction · Real Estate · Energy · Food & Supply');
