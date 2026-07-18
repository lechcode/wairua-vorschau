# Übergabeprotokoll – wairua-spirit.de / Wairua.Spirit

Stand: siehe letzter Commit unten. Diese Datei ist eine Arbeitsnotiz für die nächste Session, kein öffentlicher Seiteninhalt.

## 1. Wo alles liegt

- **Lokal (Arbeitsordner):** `C:\Users\m-sto\OneDrive\Desktop\Lechcode\Kundenprojekte\16-wairua-spirit\website\`
  (bis 18.07.2026 lag das Projekt separat unter `Desktop\wairua-spirit-fuer-michael\wairua-vorschau\` — jetzt wie ein reguläres Lechcode-Projekt eingegliedert, s. `Kundenprojekte/README.md`. Lokale Vorschau: `preview_start` mit Name `wairua-spirit-preview`, Port 8796, Server-Skript in `../_projekt/serve.ps1`.)
- **GitHub-Repo (Source of Truth):** `github.com/lechcode/wairua-vorschau`, Branch `main`
  (migriert von `ComingHomeMira` → `Lechcode`; altes Konto nicht mehr nutzen)
- **Workflow:** Änderung machen → **sofort committen + `git push origin main`**, ohne Rückfrage (feste Nutzervorgabe seit 2026-06-08: „bitte immer direkt pushen ab jetzt – nicht mehr fragen"). Lokale Vorschau vorher öffnen ist ok, aber kein Blocker.
- Commit-Message-Stil: kurze deutsche Zusammenfassung + `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- Git-Identität ist lokal bereits gesetzt: Michael Storz / info@wairua-spirit.de

## 2. ⚠️ Wichtigster offener Punkt: Domain-Cutover

- `wairua-spirit.de` (Live-Domain) zeigt **aktuell auf einen älteren Stand**, der `retreat.html` (und ggf. weitere neue Dateien) noch nicht enthält.
- Die `CNAME`-Datei wurde im Lechcode-Repo **bewusst entfernt** (Commit `df0f64f`), Cutover war als "später" geplant.
- **Funktionierender Übergangs-Link für alles Neue:**
  `https://lechcode.github.io/wairua-vorschau/retreat.html` (und analog `/index.html` etc.)
- Um `wairua-spirit.de` auf den aktuellen Stand zu bringen:
  1. `CNAME`-Datei (Inhalt: `wairua-spirit.de`) wieder ins Repo legen + pushen
  2. In GitHub → Repo `lechcode/wairua-vorschau` → **Settings → Pages** → Custom Domain auf `wairua-spirit.de` setzen (nur über GitHub-UI möglich, nicht per CLI/Claude)
  3. Prüfen, ob das alte Repo/Konto die Domain noch beansprucht (DNS bleibt unverändert bei IONOS, siehe unten)
- **Noch nicht mit dem Nutzer final geklärt, ob/wann der Cutover jetzt gemacht werden soll.** In der letzten Session wurde nur die Diagnose gemacht (404 bei `wairua-spirit.de/retreat.html`), aber der Cutover selbst wurde nicht ausgeführt.

## 3. 🔴 Unmittelbar nächster Task (unterbrochen, noch NICHT umgesetzt)

Der Nutzer hat zwei konkrete Korrekturen an den Guide-Porträts in `retreat.html` verlangt, bevor die Session endete:

**Datei:** `retreat.html`, CSS-Regel ca. Zeile 115–120 (`.guides-portraits`)

1. **Schwarzen/dunklen Rahmen um die zwei Porträtbilder (Michael + Oskar) entfernen.**
   Aktuell: `.guides-portraits figure{...border:3px solid var(--panel);...}` — genau dieser `border` erzeugt den vom Nutzer bemängelten dunklen Rand. → Regel entfernen oder auf `border:none` setzen (Schatten `box-shadow` kann bleiben).

2. **Hover-Effekt ergänzen** — beim Drüberfahren mit der Maus soll sich das Bild "ein bisschen bewegen" (Zoom/Scale), analog zu den anderen Bild-Hovers auf der Seite, z. B.:
   ```css
   .pillar img{transition:transform 1.1s cubic-bezier(.2,.7,.2,1);}
   .pillar:hover img{transform:scale(1.07);}
   ```
   Dieses Muster (Bild in `overflow:hidden`-Container, `transition` auf `img`, `:hover img{transform:scale(...)}`) zieht sich durch die ganze Seite (`.thema`, `.trio figure`, `.ort-grid figure`, `.essen-media`, `.video-facade` etc.) — bei `.guides-portraits img` fehlt das noch. Einfach dasselbe Pattern ergänzen:
   ```css
   .guides-portraits img{transition:transform 1.1s cubic-bezier(.2,.7,.2,1);}
   .guides-portraits figure:hover img{transform:scale(1.06);}
   ```

Danach wie gewohnt: lokal öffnen, kurz prüfen, direkt committen + pushen.

## 4. Was in dieser Session komplett fertiggestellt wurde

### Rechtliches
- **Impressum** (`impressum.html`) und **Datenschutzerklärung** (`datenschutz.html`) vollständig ausgefüllt: Michael Storz, Zehnerweg 13, 86899 Landsberg am Lech, info@wairua-spirit.de, +49 160 2302132. Kein Cookie-Banner nötig (keine Cookies/Tracking; YouTube lädt erst nach Klick; Google Fonts inzwischen selbst gehostet → kein Drittanbieter-Datenabfluss mehr).
- `noindex` aus `index.html` + `begleitung.html` entfernt (Seite ist für Google indexierbar); Impressum/Datenschutz bleiben bewusst `noindex`.
- Google Fonts werden **lokal** ausgeliefert: `assets/fonts.css` + `assets/fonts/*.woff2` (kein Google-Server-Aufruf mehr). Datenschutztext entsprechend angepasst.

### Design / Startseite (`index.html`)
- Markenname vereinheitlicht: **„Wairua.Spirit"** (Header/Footer-Logo als Bild `assets/logo-cream.png`, nicht mehr per CSS-Maske — war unzuverlässig).
- Hero: Eyebrow „Verbindung · Gemeinschaft · Natur", neuer mehrzeiliger Fließtext, Button „Erfahre mehr →".
- Navigation umsortiert: WAIRUA · Die drei Wege · Angebote · Über Michael · Stimmen (+ Footer synchron).
- „Die drei Wege"-Kacheln: Nummern entfernt, Unterzeile golden, Natur-Unterzeile „Im Einklang", Beschreibungstexte überarbeitet.
- „Über Michael" komplett neu aufgebaut: Kopfbereich über volle Breite (Eyebrow + 6 Tag-Buttons in einer Zeile inkl. „Sohn, Bruder & Freund" + Joseph-Campbell-Zitat), darunter Bild|Text zweispaltig, darunter YouTube-Video-Vorschau (eigenes Thumbnail `assets/Bild1.jpg`, Klick lädt `youtube-nocookie`-Embed nach) mit Überschrift „Mehr über meinen Weg zur Naturverbindung erfährst du in diesem Gespräch:". Neuer 4-Absatz-Lebenslauftext, Ort „Landsberg am Lech / Bayern" eingebaut.
- Abschnitts-Hintergründe wechseln jetzt konsequent ab (`bg`/`bg2`), keine zwei gleichfarbigen Sektionen mehr hintereinander.
- „Momente"-Galerie komplett mit echten, selbst web-optimierten Fotos aus einem Retreat neu bestückt (`assets/moment-*.jpg`, ~9 Bilder, vorher Platzhalter).
- Neue Sektion **„Kooperationspartner"** vor dem Footer: Wildnisschule Naturgefühl (Logo + Link) und Suyana zeremonieller Kakao (Logo + Affiliate-Link `?rfsn=9071264.2bb10f9` + Rabattcode **WAIRUA10**, mit Pflicht-Hinweis „Affiliate-Link / Werbung").
- Kontaktbereich reduziert auf WhatsApp + „E-Mail schreiben" (öffnet Gmail-Compose im Browser, kein `mailto:`).
- Footer neu sortiert: kurze Tagline, „Entdecken"-Spalte, Kontakt-Spalte nur noch Social-Icons (WhatsApp/Instagram/YouTube mit SVG-Icons, echte Links), untere Copyright-Zeile mit Michael Storz + separatem Impressum/Datenschutz-Link.
- Mobile-Feinschliff: Hamburger-Icon animiert zu „X", Galerie-Kachelhöhen responsiv statt fix, Sektions-Abstände responsiv.

### SEO (Quick Wins, siehe auch ausführlicher Audit-Bericht im Chatverlauf)
- Neue Title-Tags + Meta-Descriptions mit Keywords + Ort für `index.html` und `begleitung.html`.
- Canonical-Tags, Open-Graph- und Twitter-Card-Tags auf beiden Seiten.
- JSON-LD strukturierte Daten: `LocalBusiness`+`Person` und `VideoObject` auf der Startseite, `Service` auf `begleitung.html`, `Event` auf `retreat.html`.
- `sitemap.xml` + `robots.txt` neu angelegt (Repo-Root).
- Große Bilder verlustarm komprimiert (u. a. Hero-Bilder von ~5 MB auf 200–650 KB) — wichtig für Ladezeit/Core Web Vitals.
- **Noch offen aus dem SEO-Audit (nicht umgesetzt, nur empfohlen):** Google Search Console einrichten + Sitemap einreichen, Google Business Profil anlegen, Backlink von der Wildnisschule erbitten, eigene Landingpage „Männer-Retreat in Bayern", Blog/Journal, FAQ-Sektion + FAQ-Schema. Diese Punkte sind reine Nutzer-Aktionen bzw. mögliche Folgeaufträge, nicht technisch blockiert.

### Neue Unterseite: Winter-Retreat für Männer (`retreat.html`)
- Komplett neue Seite im gleichen Design, noch **nicht in Navigation/Angebote der Startseite verlinkt** (bewusst „erst wenn fertig" laut Nutzer).
- Noch mit `<meta name="robots" content="noindex, nofollow">` — sollte erst raus, wenn die Seite final ist (Preis/Termin bestätigt, Fotorechte geklärt).
- Aufbau: Hero (Bild `assets/moment-fire.jpg` – Mann am Feuer), Einladungstext zur dunklen Jahreszeit, „Was dich erwartet" (6 Themen-Karten: Kakaozeremonie, Breathwork, Lagerfeuer, Natur & Wattenmeer, Gemeinschaft, Einkehr), „Der Ort" (Seminarhaus Alte Schule, Nordfriesland/Büttjebüll – Bildergalerie aus fremden, mit Quellenangabe versehenen Fotos der Seminarhaus-Website, siehe Punkt 5), „Alte Naturrituale" (eigener Abschnitt mit 3 Bildern), „Deine Begleiter" (Michael + Oskar, zwei überlappende Einzelporträts `assets/guide-michael.jpg` / `assets/guide-oskar.jpg` — **hier ist der offene Fix aus Abschnitt 3**), „Genährt werden" (Buffet-Foto `assets/essen-buffet.jpg` als Sektions-Hintergrund, Text „Küche von Madhu & Moon" + rundes Profilfoto `assets/madhu-moon.jpg`), Detail-Kacheln (Termin/Dauer/Ort/Für/Unterkunft/Beitrag — Termin und Preis sind noch **Platzhalter**), Anmeldeformular (öffnet vorausgefüllte E-Mail, kein echtes Backend), Footer.
- Bereits entfernt auf Nutzerwunsch: Poster-Zeile über „Was dich erwartet", separate „Momente echter Begegnung"-Galerie (Bildmaterial stattdessen in „Alte Naturrituale" verwendet), das große Feuer-Zitat-Vollbild-Band, 5-Tage-Ablauf-Kacheln, Namens-Bildunterschriften unter den Guide-Porträts.

## 5. Offene Infos, die der Nutzer noch liefern muss (für `retreat.html`)

1. **Genaue Termine im Dezember 2026** (aktuell nur „Dezember 2026 · genaue Tage folgen").
2. **Endgültiger Preis** (aktuell „ca. 1.000 €").
3. **Oskars Nachname** + 1–2 Sätze über ihn für den Begleiter-Text.
4. **Bildrechte-Freigabe** beim Seminarhaus Alte Schule einholen — aktuell werden 6 Fotos von `seminarhaus-alte-schule.de/seminarhaus-nordsee/` verwendet (`assets/venue-*.webp`), Quelle ist auf der Seite als Link angegeben, aber keine explizite Erlaubnis eingeholt.
5. Danach: Seite in Startseiten-Navigation/Angebote einbinden, `noindex` entfernen, ggf. Domain-Cutover (siehe Abschnitt 2).

## 6. Technische Eigenheiten / Fallstricke (für die nächste Session)

- **PowerShell + System.Drawing:** funktioniert für JPG/PNG-Verarbeitung (Resize, Crop, Rotate, Qualitätskomprimierung), aber **kann kein WebP lesen** (`FromFile` wirft „Nicht genügend Arbeitsspeicher"-Fehler bei WebP). WebP-Dateien wurden deshalb unverändert kopiert bzw. nur im Read-Tool angeschaut (Read kann WebP anzeigen).
- **`[math]::Min(1, $scale)`-Falle:** Wenn `1` als Int übergeben wird statt `1.0`, wird der Double-Skalierungsfaktor auf `0` abgeschnitten → Bitmap(0,0) → „Ungültiger Parameter"-Fehler. Immer `1.0` (Double) schreiben.
- **Chat-Bilder sind keine Dateien:** Vom Nutzer inline in den Chat gepastete Bilder können nicht direkt als Datei gespeichert/verarbeitet werden. Der Nutzer muss sie manuell in einen lokalen Ordner legen (in dieser Session genutzt: `Desktop\Neuer Ordner\` und `Desktop\Neuer Ordner (2)\`), danach per `ls`/ `Bash` auffindbar.
- **`git add -A` auf Windows:** erzeugt harmlose `LF will be replaced by CRLF`-Warnungen bei `.html`/`.css`/`.xml` — kann ignoriert werden, kein Fehler.
- Bash-Tool läuft unter Git Bash (POSIX-Pfade mit Forward-Slash), PowerShell-Tool separat für alles, was System.Drawing/.NET braucht (Bildbearbeitung). Beide teilen sich nicht automatisch das Arbeitsverzeichnis — bei Bash immer mit vollem `cd "…"`-Pfad arbeiten.

## 7. Kurz-Referenz aller Assets, die neu dazugekommen sind

- `assets/fonts.css`, `assets/fonts/*.woff2` — selbst gehostete Schriften
- `assets/logo-cream.png` — Header/Footer-Logo als Bilddatei
- `assets/moment-*.jpg` — Momente-Galerie (Startseite)
- `assets/partner-wildnisschule.png`, `assets/partner-suyana.svg` — Kooperationspartner-Logos
- `assets/retreat-*.jpg`, `assets/guide-*.jpg`, `assets/venue-*.webp`, `assets/essen-buffet.jpg`, `assets/madhu-moon.jpg` — Retreat-Seite
- `sitemap.xml`, `robots.txt` — SEO (Repo-Root)
- `retreat.html` — neue Unterseite

## 8. Nutzer-Präferenzen (unbedingt beibehalten)

- **Immer direkt pushen**, nicht nachfragen (siehe Abschnitt 1).
- Bei größeren strukturellen Layout-Wünschen probiert der Nutzer gerne mehrere Varianten aus ("ich probier das mal aus, mach mir einen Vorschlag") — dann **nicht pushen**, sondern nur lokal zeigen, bis er explizit freigibt oder verwirft.
- Der Nutzer spricht die Änderungswünsche oft als längeres, unstrukturiertes Diktat mit Selbstkorrekturen ("nee, andersrum...") — die *letzte* Aussage in einem Wunsch gilt als die endgültige Anweisung.
- Bilder immer web-optimieren (nicht die Rohdateien in voller Auflösung einbinden).
