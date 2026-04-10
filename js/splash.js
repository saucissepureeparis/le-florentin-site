/* ═══════════════════════════════════════════════════════════════
   LE FLORENTIN — Splash multilingue d'accueil
   Sélecteur de langue immersif au premier chargement
   Vanilla JS, zéro dépendance, auto-injecté (HTML + CSS)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── CONFIGURATION ──────────────────────────────────────────── */

  // Clés localStorage
  var STORAGE_LANG = 'florentin.lang';
  var STORAGE_SEEN = 'florentin.splashSeen';

  // Langues disponibles sur le site (alignées avec les répertoires existants)
  // Note : pas d'italien ni d'arabe — non traduits sur le site actuellement.
  // Pour ajouter une langue : créer /xx/index.html, puis ajouter une ligne ici.
  var LANGS = [
    {
      code:    'fr',
      native:  'Français',
      href:    '/',
      welcome: 'Bienvenue à Paris\nBienvenue au Florentin'
    },
    {
      code:    'en',
      native:  'English',
      href:    '/en/',
      welcome: 'Welcome to Paris\nWelcome to Le Florentin'
    },
    {
      code:    'es',
      native:  'Español',
      href:    '/es/',
      welcome: 'Bienvenidos a París\nBienvenidos a Le Florentin'
    },
    {
      code:    'pt',
      native:  'Português',
      href:    '/pt/',
      welcome: 'Bem-vindos a Paris\nBem-vindos ao Le Florentin'
    },
    {
      code:    'zh',
      native:  '中文',
      href:    '/zh/',
      welcome: '巴黎欢迎您\n欢迎光临 Le Florentin'
    },
    {
      code:    'ja',
      native:  '日本語',
      href:    '/ja/',
      welcome: 'ようこそ パリへ\nようこそ ル・フロランタンへ'
    },
    {
      code:    'ko',
      native:  '한국어',
      href:    '/ko/',
      welcome: '파리에 오신 것을 환영합니다\n르 플로랑탱에 오신 것을 환영합니다'
    }
  ];

  /* ─── DÉTECTION : faut-il afficher le splash ? ──────────────── */

  function shouldShow() {
    // Préférence respectée : si l'utilisateur a déjà vu/choisi, on ne réaffiche pas
    try {
      if (localStorage.getItem(STORAGE_SEEN)) return false;
    } catch (e) {
      // localStorage indisponible (mode privé Safari, etc.) → on affiche quand même
    }

    // Le splash ne s'affiche QUE sur les pages d'accueil de chaque version linguistique
    var path = window.location.pathname;
    var homePages = ['/', '/index.html',
                     '/en/', '/en/index.html',
                     '/es/', '/es/index.html',
                     '/pt/', '/pt/index.html',
                     '/zh/', '/zh/index.html',
                     '/ja/', '/ja/index.html',
                     '/ko/', '/ko/index.html'];
    for (var i = 0; i < homePages.length; i++) {
      if (path === homePages[i]) return true;
    }
    return false;
  }

  if (!shouldShow()) return;

  /* ─── INJECTION CSS ──────────────────────────────────────────── */

  function injectCss() {
    var css = [
      /* Conteneur plein écran */
      '.fl-splash{',
        'position:fixed;inset:0;z-index:9999;',
        'display:flex;align-items:center;justify-content:center;',
        'padding:1.5rem;',
        'background:radial-gradient(ellipse at center,#2a1818 0%,#1a0f0f 55%,#0d0707 100%);',
        'opacity:0;animation:flSplashIn 700ms ease-out forwards;',
      '}',
      '.fl-splash.is-leaving{animation:flSplashOut 800ms ease-in forwards;}',
      '@keyframes flSplashIn{from{opacity:0}to{opacity:1}}',
      '@keyframes flSplashOut{from{opacity:1}to{opacity:0;visibility:hidden}}',

      /* Lock scroll page derrière */
      'html.fl-splash-locked,html.fl-splash-locked body{overflow:hidden!important;}',

      /* Bloc central étape 1 */
      '.fl-splash__inner{',
        'text-align:center;width:100%;max-width:760px;',
        'transition:opacity 500ms ease,transform 500ms ease;',
      '}',
      '.fl-splash.is-step-2 .fl-splash__inner{',
        'opacity:0;transform:translateY(-12px);pointer-events:none;',
      '}',

      /* Wordmark "Le Florentin" en script */
      '.fl-splash__brand{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-style:italic;font-weight:700;',
        'font-size:clamp(2.4rem,8vw,4.2rem);',
        'color:#FAF6EF;line-height:1;',
        'letter-spacing:.005em;',
        'margin:0 0 .9rem;',
        'opacity:0;transform:translateY(14px);',
        'animation:flFadeUp 1000ms cubic-bezier(.16,1,.3,1) 250ms forwards;',
      '}',

      /* Tagline avec liserés or */
      '.fl-splash__tagline{',
        'font-family:"Inter",system-ui,sans-serif;',
        'font-size:.7rem;font-weight:500;',
        'letter-spacing:.32em;text-transform:uppercase;',
        'color:rgba(250,246,239,.55);',
        'margin:0 0 2.6rem;',
        'opacity:0;animation:flFadeIn 1000ms ease-out 500ms forwards;',
      '}',
      '.fl-splash__tagline::before,.fl-splash__tagline::after{',
        'content:"";display:inline-block;vertical-align:middle;',
        'width:34px;height:1px;background:rgba(201,169,78,.55);',
        'margin:0 1em;',
      '}',

      /* Grille de langues */
      '.fl-splash__langs{',
        'list-style:none;margin:0 auto;padding:0;',
        'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));',
        'gap:.2rem .8rem;max-width:440px;',
      '}',
      '@media(min-width:720px){',
        '.fl-splash__langs{',
          'grid-template-columns:repeat(4,minmax(0,1fr));',
          'max-width:none;gap:.4rem 1.6rem;',
        '}',
      '}',

      /* Bouton langue : nom dans son écriture native */
      '.fl-splash__lang{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-style:italic;font-weight:400;',
        'font-size:1.18rem;color:#FAF6EF;',
        'background:transparent;border:0;cursor:pointer;',
        'padding:.95rem .5rem 1.05rem;',
        'position:relative;display:block;width:100%;',
        'transition:color 250ms ease,transform 250ms ease;',
        'opacity:0;transform:translateY(10px);',
        'animation:flFadeUp 800ms cubic-bezier(.16,1,.3,1)',
        '          calc(800ms + var(--i,0) * 90ms) forwards;',
      '}',
      /* Soulignement or au hover */
      '.fl-splash__lang::after{',
        'content:"";position:absolute;left:50%;bottom:.55rem;',
        'width:0;height:1px;background:#C9A94E;',
        'transform:translateX(-50%);',
        'transition:width 400ms cubic-bezier(.16,1,.3,1);',
      '}',
      '.fl-splash__lang:hover,.fl-splash__lang:focus-visible{',
        'color:#C9A94E;outline:none;',
      '}',
      '.fl-splash__lang:hover::after,.fl-splash__lang:focus-visible::after{',
        'width:55%;',
      '}',
      '.fl-splash__lang:active{transform:translateY(10px) scale(.98);}',

      /* Étape 2 : message de bienvenue centré */
      '.fl-splash__welcome{',
        'position:absolute;inset:0;',
        'display:flex;align-items:center;justify-content:center;',
        'padding:2rem;text-align:center;',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-style:italic;font-weight:400;',
        'font-size:clamp(1.6rem,5.2vw,2.6rem);',
        'line-height:1.45;color:#FAF6EF;',
        'white-space:pre-line;',
        'opacity:0;visibility:hidden;',
        'transform:translateY(20px);',
        'transition:opacity 800ms ease-out,transform 1000ms cubic-bezier(.16,1,.3,1);',
        'pointer-events:none;',
      '}',
      '.fl-splash__welcome.is-visible{',
        'opacity:1;visibility:visible;transform:translateY(0);',
      '}',
      /* Liseré or au-dessus du message */
      '.fl-splash__welcome::before{',
        'content:"";position:absolute;left:50%;top:38%;',
        'width:60px;height:1px;background:#C9A94E;',
        'transform:translateX(-50%);opacity:.7;',
      '}',

      /* Animations clés */
      '@keyframes flFadeUp{',
        'from{opacity:0;transform:translateY(14px)}',
        'to{opacity:1;transform:translateY(0)}',
      '}',
      '@keyframes flFadeIn{from{opacity:0}to{opacity:1}}',

      /* Accessibilité : reduced motion */
      '@media(prefers-reduced-motion:reduce){',
        '.fl-splash,.fl-splash *,.fl-splash *::before,.fl-splash *::after{',
          'animation-duration:.01ms!important;',
          'animation-delay:0ms!important;',
          'transition-duration:.01ms!important;',
        '}',
      '}'
    ].join('');

    var style = document.createElement('style');
    style.id = 'fl-splash-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ─── CONSTRUCTION DU DOM ────────────────────────────────────── */

  function build() {
    var splash = document.createElement('div');
    splash.className = 'fl-splash';
    splash.setAttribute('role', 'dialog');
    splash.setAttribute('aria-modal', 'true');
    splash.setAttribute('aria-label', 'Le Florentin — choisir une langue / choose a language');

    var inner = document.createElement('div');
    inner.className = 'fl-splash__inner';

    // Wordmark
    var brand = document.createElement('h1');
    brand.className = 'fl-splash__brand';
    brand.textContent = 'Le Florentin';

    // Tagline avec ornements or
    var tagline = document.createElement('p');
    tagline.className = 'fl-splash__tagline';
    tagline.textContent = 'Bistrot Parisien';

    // Grille de langues
    var list = document.createElement('ul');
    list.className = 'fl-splash__langs';
    LANGS.forEach(function (l, i) {
      var li = document.createElement('li');
      li.style.setProperty('--i', i);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fl-splash__lang';
      btn.dataset.code = l.code;
      btn.dataset.href = l.href;
      btn.dataset.welcome = l.welcome;
      btn.setAttribute('lang', l.code);
      btn.setAttribute('aria-label', l.native);
      btn.textContent = l.native;
      li.appendChild(btn);
      list.appendChild(li);
    });

    inner.appendChild(brand);
    inner.appendChild(tagline);
    inner.appendChild(list);

    // Étape 2 : message de bienvenue (positionné en absolute)
    var welcome = document.createElement('div');
    welcome.className = 'fl-splash__welcome';
    welcome.setAttribute('aria-live', 'polite');

    splash.appendChild(inner);
    splash.appendChild(welcome);

    return { splash: splash, list: list, welcome: welcome };
  }

  /* ─── COMPORTEMENT ───────────────────────────────────────────── */

  function init() {
    injectCss();

    var dom = build();
    var splash = dom.splash;
    var list = dom.list;
    var welcome = dom.welcome;

    // Lock scroll en arrière-plan + injection
    document.documentElement.classList.add('fl-splash-locked');
    document.body.appendChild(splash);

    // Focus accessible sur la première langue après l'apparition (1.2 s)
    setTimeout(function () {
      var firstBtn = list.querySelector('button');
      if (firstBtn) firstBtn.focus({ preventScroll: true });
    }, 1300);

    // Sélection d'une langue (event delegation)
    list.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('button.fl-splash__lang');
      if (!btn) return;

      var code = btn.dataset.code;
      var href = btn.dataset.href;
      var welcomeText = btn.dataset.welcome;

      // Persistance du choix
      try {
        localStorage.setItem(STORAGE_LANG, code);
        localStorage.setItem(STORAGE_SEEN, '1');
      } catch (err) { /* mode privé : on continue sans persister */ }

      // Étape 2 : afficher le message de bienvenue
      welcome.textContent = welcomeText;
      welcome.setAttribute('lang', code);
      splash.classList.add('is-step-2');

      // Force reflow pour que la transition s'applique
      requestAnimationFrame(function () {
        welcome.classList.add('is-visible');
      });

      // Étape 3 : sortie + redirection
      setTimeout(function () {
        splash.classList.add('is-leaving');

        setTimeout(function () {
          // Évite de recharger inutilement si on est déjà sur la bonne URL
          var currentPath = window.location.pathname;
          var alreadyOnTarget =
            (href === '/' && (currentPath === '/' || currentPath === '/index.html')) ||
            (href !== '/' && currentPath.indexOf(href) === 0);

          if (alreadyOnTarget) {
            splash.remove();
            document.documentElement.classList.remove('fl-splash-locked');
          } else {
            window.location.href = href;
          }
        }, 800);
      }, 1900);
    });

    // ESC = sélection français par défaut (sortie rapide pour habitués)
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        var fr = list.querySelector('button[data-code="fr"]');
        if (fr) fr.click();
      }
    });
  }

  /* ─── DÉCLENCHEMENT ──────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
