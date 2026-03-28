/* ═══════════════════════════════════════════════════
   LE FLORENTIN — JavaScript vanilla
   Nav sticky, parallax, scroll animations, accordion, language selector
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAV STICKY ─── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const scrollThreshold = 100;
    let ticking = false;

    function updateNav() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateNav();
  }

  /* ─── HAMBURGER MENU ─── */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── LANGUAGE SELECTOR ─── */
  const langBtn = document.querySelector('.nav__lang-btn');
  const langDropdown = document.querySelector('.nav__lang-dropdown');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      langDropdown.classList.toggle('is-open');
    });

    document.addEventListener('click', function () {
      langDropdown.classList.remove('is-open');
    });
  }

  /* ─── PARALLAX HERO ─── */
  const heroImage = document.querySelector('.hero__parallax');
  if (heroImage) {
    let rafId = null;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (!isMobile) {
      function updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = heroImage.parentElement.offsetHeight;
        if (scrollY <= heroHeight) {
          heroImage.style.transform = 'translateY(' + (scrollY * 0.5) + 'px)';
        }
        rafId = null;
      }

      window.addEventListener('scroll', function () {
        if (rafId === null) {
          rafId = requestAnimationFrame(updateParallax);
        }
      }, { passive: true });
    }
  }

  /* ─── SCROLL ANIMATIONS (IntersectionObserver) ─── */
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger children if present
          const children = entry.target.querySelectorAll('.fade-in-child');
          if (children.length > 0) {
            children.forEach(function (child, i) {
              child.style.transitionDelay = (i * 100) + 'ms';
              child.classList.add('is-visible');
            });
          }
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    fadeElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ─── SMOOTH SCROLL for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
