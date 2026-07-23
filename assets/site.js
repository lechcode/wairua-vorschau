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

  var ruhig = matchMedia('(prefers-reduced-motion:reduce)');

  /* --- Einblenden beim Scrollen ------------------------------------------
     .reveal blendet das Element selbst ein, .stagger laesst seine Kinder
     nacheinander kommen. Beide bekommen dieselbe Klasse .in.

     Wichtig: Der Inhalt darf NIE an der Animation haengen bleiben. Der
     IntersectionObserver feuert in manchen In-App-Browsern (z. B. dem
     Browser der Google-App) nicht zuverlaessig, und sehr hohe Abschnitte
     erreichen auf schmalen Geraeten mitunter nie genug Sichtbarkeit.
     Deshalb: Schwelle 0, zusaetzlich ein Scroll-Fallback auf reinem
     getBoundingClientRect und ein Zeit-Sicherheitsnetz. */
  var reveals = [].slice.call(document.querySelectorAll('.reveal,.stagger'));
  if (reveals.length) {
    var zeigen = function (el) { el.classList.add('in'); };
    var alleZeigen = function () { reveals.forEach(zeigen); };

    if (ruhig.matches) {
      alleZeigen();
    } else {
      var io = null;

      var pruefen = function () {
        var sicht = window.innerHeight || document.documentElement.clientHeight;
        var offen = false;
        reveals.forEach(function (el) {
          if (el.classList.contains('in')) return;
          var k = el.getBoundingClientRect();
          if (k.top < sicht && k.bottom > 0) {
            zeigen(el);
            if (io) io.unobserve(el);
          } else {
            offen = true;
          }
        });
        if (!offen) abraeumen();
      };

      var abraeumen = function () {
        removeEventListener('scroll', pruefen);
        removeEventListener('resize', pruefen);
        removeEventListener('touchmove', pruefen);
      };

      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              zeigen(e.target);
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
        reveals.forEach(function (el) { io.observe(el); });
      }

      addEventListener('scroll', pruefen, { passive: true });
      addEventListener('resize', pruefen, { passive: true });
      addEventListener('touchmove', pruefen, { passive: true });

      // Erst pruefen, wenn das Layout wirklich steht: einmal sofort, einmal
      // im naechsten Bild und einmal, wenn auch die Bilder geladen sind.
      // Ohne das koennte ein Abschnitt haengen bleiben, bis jemand scrollt.
      pruefen();
      requestAnimationFrame(pruefen);
      if (document.readyState === 'complete') pruefen();
      else addEventListener('load', pruefen);

      // Letztes Sicherheitsnetz: Was nach 5 Sekunden noch versteckt ist,
      // wird gezeigt - lieber ohne Animation als gar nicht.
      setTimeout(function () {
        var rest = document.querySelectorAll('.reveal:not(.in),.stagger:not(.in)');
        if (rest.length) {
          [].forEach.call(rest, zeigen);
          abraeumen();
        }
      }, 5000);
    }
  }

  /* Ab hier nur noch Schmuck. Wer Bewegung reduziert haben moechte,
     bekommt die Seite ohne diese Zutaten - der Inhalt bleibt derselbe. */
  if (ruhig.matches) return;

  /* --- Feiner Fortschrittsfaden ganz oben -------------------------------- */
  (function () {
    var faden = document.createElement('div');
    faden.className = 'fortschritt';
    faden.setAttribute('aria-hidden', 'true');
    document.body.appendChild(faden);

    var wartet = false;
    var setzen = function () {
      var hoehe = document.documentElement.scrollHeight - innerHeight;
      var anteil = hoehe > 0 ? Math.min(window.scrollY / hoehe, 1) : 0;
      faden.style.transform = 'scaleX(' + anteil + ')';
      wartet = false;
    };
    setzen();
    addEventListener('scroll', function () {
      if (!wartet) { wartet = true; requestAnimationFrame(setzen); }
    }, { passive: true });
    addEventListener('resize', setzen, { passive: true });
  })();

  /* --- Glut: aufsteigende Funken auf dunklen Flaechen --------------------
     Bewusst sparsam: wenige Teilchen, und gerechnet wird nur, solange der
     Abschnitt wirklich im Bild ist. */
  var glutFlaechen = document.querySelectorAll('.glut');
  if (glutFlaechen.length && 'IntersectionObserver' in window) {
    glutFlaechen.forEach(function (flaeche) {
      var leinwand = document.createElement('canvas');
      leinwand.className = 'funken';
      leinwand.setAttribute('aria-hidden', 'true');
      flaeche.insertBefore(leinwand, flaeche.firstChild);

      var stift = leinwand.getContext('2d');
      if (!stift) return;

      var breite = 0, hoehe = 0, dichte = 1, teilchen = [], laeuft = false, bild = null, imBild = false;

      var neuTeilchen = function (start) {
        return {
          x: Math.random() * breite,
          y: start ? Math.random() * hoehe : hoehe + Math.random() * 40,
          r: .6 + Math.random() * 1.5,
          tempo: .12 + Math.random() * .34,
          drift: (Math.random() - .5) * .22,
          takt: Math.random() * Math.PI * 2,
          licht: .25 + Math.random() * .5
        };
      };

      var messen = function () {
        var kasten = flaeche.getBoundingClientRect();
        breite = Math.max(1, Math.round(kasten.width));
        hoehe = Math.max(1, Math.round(kasten.height));
        dichte = Math.min(devicePixelRatio || 1, 2);
        leinwand.width = breite * dichte;
        leinwand.height = hoehe * dichte;
        stift.setTransform(dichte, 0, 0, dichte, 0, 0);
        // Auf schmalen Geraeten deutlich weniger, damit das Scrollen leicht bleibt
        var anzahl = Math.round(Math.min(breite, 1200) / (breite < 700 ? 34 : 20));
        teilchen = [];
        for (var i = 0; i < anzahl; i++) teilchen.push(neuTeilchen(true));
      };

      var zeichnen = function () {
        stift.clearRect(0, 0, breite, hoehe);
        for (var i = 0; i < teilchen.length; i++) {
          var t = teilchen[i];
          t.y -= t.tempo;
          t.takt += .012;
          t.x += t.drift + Math.sin(t.takt) * .18;
          if (t.y < -12) teilchen[i] = neuTeilchen(false);

          // oben und unten ausblenden, damit nichts hart abreisst
          var rand = Math.min(t.y / (hoehe * .28), (hoehe - t.y) / (hoehe * .18), 1);
          var staerke = t.licht * Math.max(0, rand) * (.72 + Math.sin(t.takt * 1.7) * .28);
          if (staerke <= .01) continue;
          stift.beginPath();
          stift.arc(t.x, t.y, t.r, 0, Math.PI * 2);
          stift.fillStyle = 'rgba(224,175,95,' + staerke.toFixed(3) + ')';
          stift.fill();
        }
        bild = requestAnimationFrame(zeichnen);
      };

      var starten = function () {
        if (laeuft) return;
        laeuft = true;
        bild = requestAnimationFrame(zeichnen);
      };
      var anhalten = function () {
        laeuft = false;
        if (bild) cancelAnimationFrame(bild);
        bild = null;
      };

      messen();
      addEventListener('resize', function () {
        messen();
      }, { passive: true });

      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          imBild = e.isIntersecting;
          imBild && !document.hidden ? starten() : anhalten();
        });
      }, { threshold: 0 }).observe(flaeche);

      // Im Hintergrund-Tab nicht rechnen - und beim Zurueckkommen weitermachen
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) anhalten();
        else if (imBild) starten();
      });
    });
  }
})();
