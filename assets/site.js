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

  /* --- Lagerfeuer am Fuss der Seite --------------------------------------
     Brennt aus dem unteren Rand des Footers heraus: breite, weiche Flammen
     im additiven Modus, darueber spruehende Funken. Die Flammen bleiben im
     unteren Drittel, damit der Text darueber ruhig lesbar bleibt.
     Gerechnet wird nur, solange der Footer im Bild ist. */
  (function () {
    var fuss = document.querySelector('footer');
    if (!fuss || !('IntersectionObserver' in window)) return;

    var leinwand = document.createElement('canvas');
    leinwand.className = 'feuer';
    leinwand.setAttribute('aria-hidden', 'true');
    fuss.insertBefore(leinwand, fuss.firstChild);

    var stift = leinwand.getContext('2d');
    if (!stift) { leinwand.remove(); return; }

    var breite = 0, hoehe = 0, mass = 1;
    var flammen = [], funken = [], kohlen = [], glut = null;
    var laeuft = false, bild = null, imBild = false, takt = 0;

    /* Ein weicher Fleck wird EINMAL in drei Waermestufen vorgezeichnet.
       Pro Bild dann nur noch drawImage statt hunderter neuer Farbverlaeufe -
       das ist der Unterschied zwischen fluessig und ruckelig auf aelteren
       Geraeten. */
    var machFleck = function (r, g, b) {
      var k = document.createElement('canvas');
      var s = 64;
      k.width = k.height = s;
      var x = k.getContext('2d');
      var v = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      v.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)');
      v.addColorStop(.38, 'rgba(' + r + ',' + g + ',' + b + ',.40)');
      v.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
      x.fillStyle = v;
      x.fillRect(0, 0, s, s);
      return k;
    };
    // Bewusst warm gehalten: helle, fast weisse Flecken summieren sich im
    // additiven Modus zu Grau und sehen dann nach Rauch aus, nicht nach Feuer.
    var fleckHeiss = machFleck(255, 186, 84);
    var fleckMitte = machFleck(246, 108, 28);
    var fleckKalt = machFleck(168, 44, 10);
    var fleckKern = machFleck(255, 224, 158);

    // Flammen steigen nur bis hierhin - darueber liegt der Text.
    // Bewusst niedrig: die Copyright-Zeile soll nicht ueber zuckenden
    // Flammen stehen (Lesbarkeit geht vor Effekt).
    var zone = function () { return Math.max(110, hoehe * .30); };

    var neueFlamme = function (start) {
      var z = zone();
      return {
        x: Math.random() * breite,
        y: start ? hoehe - Math.random() * z : hoehe + 4 + Math.random() * 12,
        r: 9 + Math.random() * 19,
        tempo: .9 + Math.random() * 2.1,
        // Flammenzungen sind deutlich hoeher als breit
        streckung: 1.8 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        wedeln: .3 + Math.random() * .95,
        kraft: .45 + Math.random() * .55,
        leben: start ? Math.random() : 0,
        dauer: .009 + Math.random() * .019
      };
    };

    // Glutnest am Boden: kleine, sehr helle Punkte, die pulsieren
    var neueKohle = function () {
      return {
        x: Math.random() * breite,
        r: 3 + Math.random() * 9,
        phase: Math.random() * Math.PI * 2,
        tempo: .6 + Math.random() * 1.5,
        kraft: .35 + Math.random() * .65
      };
    };

    var neuerFunke = function () {
      return {
        x: breite * .5 + (Math.random() - .5) * breite * .96,
        y: hoehe + 2,
        vx: (Math.random() - .5) * .55,
        vy: -(1.1 + Math.random() * 2.6),
        r: .5 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        leben: 0,
        dauer: .004 + Math.random() * .006
      };
    };

    var messen = function () {
      var kasten = fuss.getBoundingClientRect();
      breite = Math.max(1, Math.round(kasten.width));
      hoehe = Math.max(1, Math.round(kasten.height));
      // Feuer ist weich - eine grobere Aufloesung spart Rechenzeit und
      // sieht man ihr nicht an.
      mass = Math.min(devicePixelRatio || 1, 2) * .62;
      leinwand.width = Math.round(breite * mass);
      leinwand.height = Math.round(hoehe * mass);
      stift.setTransform(mass, 0, 0, mass, 0, 0);

      var schmal = breite < 700;
      var zielF = Math.round(Math.min(breite, 1400) / (schmal ? 15 : 9.5));
      var zielS = Math.round(Math.min(breite, 1400) / (schmal ? 80 : 44));
      var zielK = Math.round(Math.min(breite, 1400) / (schmal ? 46 : 26));
      flammen = [];
      for (var i = 0; i < zielF; i++) flammen.push(neueFlamme(true));
      funken = [];
      for (var j = 0; j < zielS; j++) { var f = neuerFunke(); f.y = hoehe - Math.random() * hoehe * .6; funken.push(f); }
      kohlen = [];
      for (var m = 0; m < zielK; m++) kohlen.push(neueKohle());

      // Grundglut am unteren Rand: eng am Boden, damit daraus kein Nebel wird
      glut = stift.createLinearGradient(0, hoehe, 0, hoehe - zone() * .85);
      glut.addColorStop(0, 'rgba(255,138,42,.34)');
      glut.addColorStop(.18, 'rgba(214,96,30,.15)');
      glut.addColorStop(.48, 'rgba(168,64,22,.045)');
      glut.addColorStop(1, 'rgba(140,50,16,0)');
    };

    var zeichnen = function () {
      takt += .016;
      stift.clearRect(0, 0, breite, hoehe);
      stift.globalCompositeOperation = 'lighter';

      // ruhig atmende Grundglut
      var atem = .86 + Math.sin(takt * 1.7) * .09 + Math.sin(takt * 4.3) * .05;
      stift.globalAlpha = atem;
      stift.fillStyle = glut;
      stift.fillRect(0, 0, breite, hoehe);

      // Glutnest am Boden
      for (var n = 0; n < kohlen.length; n++) {
        var kh = kohlen[n];
        kh.phase += .04 * kh.tempo;
        var pulsen = .45 + Math.sin(kh.phase) * .3 + Math.sin(kh.phase * 2.7) * .18;
        var ka = Math.max(0, pulsen) * kh.kraft * .46;
        if (ka <= .01) continue;
        var kd = kh.r * 6.4;
        stift.globalAlpha = ka;
        stift.drawImage(fleckKern, kh.x - kd / 2, hoehe - kd / 2, kd, kd);
      }

      // Flammenzungen
      var z = zone();
      for (var i = 0; i < flammen.length; i++) {
        var p = flammen[i];
        p.leben += p.dauer;
        if (p.leben >= 1) { flammen[i] = neueFlamme(false); continue; }
        p.y -= p.tempo * (1 + p.leben * .7);
        p.phase += .06;
        p.x += Math.sin(p.phase) * p.wedeln;

        var t = p.leben;
        // Die Zunge verjuengt sich stark nach oben
        var rad = p.r * (1 - t * .68);
        if (rad < .6) continue;
        var a = Math.pow(1 - t, 1.8) * p.kraft * .42;
        // oberhalb der Flammenzone rasch auslaufen, damit der Text ruhig bleibt
        var hoch = (hoehe - p.y) / z;
        if (hoch > 1) a *= Math.max(0, 1 - (hoch - 1) * 2.2);
        if (a <= .004) continue;

        // unten goldgelb, oben tiefes Orangerot
        var fleck = t < .16 ? fleckHeiss : (t < .55 ? fleckMitte : fleckKalt);
        var fb = rad * 2;
        var fh = fb * p.streckung;
        stift.globalAlpha = a;
        stift.drawImage(fleck, p.x - fb / 2, p.y - fh / 2, fb, fh);
      }

      // Funken
      for (var k = 0; k < funken.length; k++) {
        var s = funken[k];
        s.leben += s.dauer;
        if (s.leben >= 1 || s.y < -20) { funken[k] = neuerFunke(); continue; }
        s.vy += .012;               // sie werden langsamer
        s.vx += (Math.random() - .5) * .05;
        s.x += s.vx;
        s.y += s.vy;
        s.phase += .3;

        var flackern = .55 + Math.sin(s.phase) * .45;
        var sa = (1 - s.leben) * flackern * .85;
        if (sa <= .01) continue;
        stift.globalAlpha = sa;
        stift.fillStyle = 'rgba(255,196,110,1)';
        stift.beginPath();
        stift.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        stift.fill();
      }

      stift.globalAlpha = 1;
      stift.globalCompositeOperation = 'source-over';
      bild = requestAnimationFrame(zeichnen);
    };

    var starten = function () { if (!laeuft) { laeuft = true; bild = requestAnimationFrame(zeichnen); } };
    var anhalten = function () { laeuft = false; if (bild) cancelAnimationFrame(bild); bild = null; };

    messen();
    var neuMessen = null;
    addEventListener('resize', function () {
      clearTimeout(neuMessen);
      neuMessen = setTimeout(messen, 200);
    }, { passive: true });

    new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        imBild = e.isIntersecting;
        imBild && !document.hidden ? starten() : anhalten();
      });
    }, { threshold: 0 }).observe(fuss);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) anhalten();
      else if (imBild) starten();
    });
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
