/* ==========================================================================
   Wairua.Spirit - gemeinsames Seitenskript
   Laeuft auf allen Seiten: Navigationsleiste beim Scrollen, mobiles Menue,
   Einblenden beim Scrollen. Seitenspezifisches (Karussell, Video, Formular)
   bleibt im <script>-Block der jeweiligen Seite.
   ========================================================================== */
(function () {
  'use strict';

  /* --- Navigationsleiste faerbt sich beim Scrollen ein ------------------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobiles Menue ----------------------------------------------------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');

  if (burger && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      document.body.classList.toggle('menu-open', open);
      // Im geschlossenen Zustand ist das Menue auch fuer Tastatur und
      // Screenreader nicht erreichbar.
      if (open) {
        menu.removeAttribute('inert');
      } else {
        menu.setAttribute('inert', '');
      }
    };

    setMenu(false);

    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('open'));
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });

    addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        setMenu(false);
        burger.focus();
      }
    });

    // Wird das Fenster auf Desktop-Breite gezogen, darf kein offenes
    // Overlay zurueckbleiben.
    var wide = matchMedia('(min-width:901px)');
    var onWide = function () { if (wide.matches) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else wide.addListener(onWide);
  }

  /* --- Einblenden beim Scrollen ------------------------------------------ */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: .14 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }
})();
