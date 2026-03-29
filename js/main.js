/* ═══════════════════════════════════════════════════
   LE FLORENTIN — JavaScript vanilla
   Nav sticky, parallax, scroll animations, counter,
   gallery lightbox, scroll progress, language selector
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Check reduced motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── SCROLL PROGRESS BAR ─── */
  var scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  document.body.prepend(scrollProgress);

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
  }

  /* ─── NAV STICKY + HIDE/SHOW ─── */
  var nav = document.querySelector('.nav');
  var lastScrollY = 0;
  var navTicking = false;

  function updateNav() {
    var currentScrollY = window.scrollY;

    // Sticky background
    if (currentScrollY > 100) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (!prefersReducedMotion) {
      if (currentScrollY > 300 && currentScrollY > lastScrollY) {
        nav.classList.add('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }
    }

    lastScrollY = currentScrollY;
    navTicking = false;
  }

  if (nav) {
    window.addEventListener('scroll', function () {
      updateScrollProgress();
      if (!navTicking) {
        requestAnimationFrame(updateNav);
        navTicking = true;
      }
    }, { passive: true });

    // Initial check
    updateNav();
    updateScrollProgress();
  } else {
    // Still update scroll progress even without nav
    window.addEventListener('scroll', function () {
      updateScrollProgress();
    }, { passive: true });
    updateScrollProgress();
  }

  /* ─── HAMBURGER MENU ─── */
  var hamburger = document.querySelector('.nav__hamburger');
  var mobileMenu = document.querySelector('.nav__mobile-menu');

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
  var langBtn = document.querySelector('.nav__lang-btn');
  var langDropdown = document.querySelector('.nav__lang-dropdown');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      langDropdown.classList.toggle('is-open');
    });

    document.addEventListener('click', function () {
      langDropdown.classList.remove('is-open');
    });
  }

  /* ─── PARALLAX ─── */
  var heroImage = document.querySelector('.hero__parallax');
  var quoteBg = document.querySelector('.quote-section__bg');
  var isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (!isMobile && !prefersReducedMotion) {
    var parallaxRafId = null;

    function updateParallax() {
      var scrollY = window.scrollY;

      // Hero parallax at 0.5x
      if (heroImage) {
        var heroHeight = heroImage.parentElement.offsetHeight;
        if (scrollY <= heroHeight) {
          heroImage.style.transform = 'translateY(' + (scrollY * 0.5) + 'px)';
        }
      }

      // Quote section bg parallax at 0.3x
      if (quoteBg) {
        var quoteSection = quoteBg.parentElement;
        var rect = quoteSection.getBoundingClientRect();
        var sectionTop = rect.top + scrollY;
        var offset = (scrollY - sectionTop) * 0.3;
        quoteBg.style.transform = 'translateY(' + offset + 'px)';
      }

      parallaxRafId = null;
    }

    window.addEventListener('scroll', function () {
      if (parallaxRafId === null) {
        parallaxRafId = requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
  }

  /* ─── INTERSECTION OBSERVER ─── */
  var animatedSelectors = '.fade-in, .slide-in-left, .slide-in-right, .scale-reveal, .text-reveal';
  var animatedElements = document.querySelectorAll(animatedSelectors);

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    if (prefersReducedMotion) {
      // Skip animations, show everything immediately
      animatedElements.forEach(function (el) {
        el.classList.add('is-visible');
        el.querySelectorAll('.fade-in-child').forEach(function (child) {
          child.classList.add('is-visible');
        });
      });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger children if present (for fade-in containers)
            var children = entry.target.querySelectorAll('.fade-in-child');
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

      animatedElements.forEach(function (el) {
        observer.observe(el);
      });
    }
  } else {
    // Fallback: show everything
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ─── COUNTER ANIMATION ─── */
  var counterElements = document.querySelectorAll('[data-count]');

  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var isDecimal = String(target).indexOf('.') !== -1;
      var decimalPlaces = isDecimal ? String(target).split('.')[1].length : 0;
      var duration = 1500;
      var startTime = null;

      if (prefersReducedMotion) {
        el.textContent = isDecimal ? target.toFixed(decimalPlaces) : target;
        return;
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easedProgress = easeOutQuad(progress);
        var currentValue = easedProgress * target;

        el.textContent = isDecimal ? currentValue.toFixed(decimalPlaces) : Math.round(currentValue);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    counterElements.forEach(function (el) {
      el.textContent = '0';
      counterObserver.observe(el);
    });
  }

  /* ─── GALLERY LIGHTBOX ─── */
  var galleryItems = document.querySelectorAll('.gallery__item');

  if (galleryItems.length > 0) {
    // Create lightbox overlay
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image lightbox');
    lightbox.innerHTML =
      '<button class="lightbox__close" aria-label="Close lightbox">&times;</button>' +
      '<img class="lightbox__img" src="" alt="">';
    document.body.appendChild(lightbox);

    var lightboxImg = lightbox.querySelector('.lightbox__img');
    var lightboxClose = lightbox.querySelector('.lightbox__close');

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function () {
        var img = item.querySelector('img') || item;
        var src = img.getAttribute('src') || img.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
        var alt = img.getAttribute('alt') || '';
        openLightbox(src, alt);
      });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightboxClose) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
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
