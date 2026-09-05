# wairua – Projektkontext (für Claude Code)

Dies ist die Website von **Michael / Wairua.Spirit** — live unter **https://wairua-spirit.de**.

## Aufbau
Statische Website, **eine Datei pro Seite** — kein Build-System, kein npm, keine Frameworks.

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite |
| `begleitung.html` | Der Weg des Erdhüters – 4-monatige Einzelbegleitung für Männer (**live**, indexierbar) |
| `retreat.html` | Winter-Retreat an der Nordsee, 9.–13.12.2026 (**live**, indexierbar) |
| `rituale.html` | Rituale & Jahreskreisfeste, Anmeldung über PayPal (**live**, indexierbar seit 24.08.2026) |
| `impressum.html` · `datenschutz.html` | Rechtsseiten (bewusst `noindex`) |
| `assets/` | Bilder, Schriften, `base.css`, `site.js` |
| `CNAME` | verbindet die Domain mit GitHub Pages → **nicht löschen** |
| `.nojekyll` | sagt GitHub Pages: kein Jekyll-Processing |
| `sitemap.xml` · `robots.txt` | SEO |

## Gemeinsame Grundlage (seit 21.07.2026)
Vorher lag das komplette Design-System in **jeder** Seite noch einmal im
`<style>`-Block — 26 Regeln waren wortgleich sechsfach vorhanden und 23 waren
bereits auseinandergelaufen. Jetzt gilt:

- **`assets/base.css`** — Tokens (`:root`), Reset, Typo-Basis, `.wrap`, `.eyebrow`,
  `.koru`, `.grain`, **komplette Navigation inkl. Burger und mobilem Menü**,
  Buttons, Hero-Gerüst, Footer-Standard, `.reveal`, `:focus-visible`,
  `prefers-reduced-motion`. Keyframes `rise`, `kb`, `spin`.
- **`assets/site.js`** — Navigationsleiste beim Scrollen, mobiles Menü
  (inkl. `aria-expanded` und `inert`), Reveal-Einblendungen. Wird mit `defer` geladen.
- **Im `<style>`-Block der Seite bleibt nur Seitenspezifisches.** Es wird *nach*
  `base.css` geladen und überschreibt sie. Bewusste Overrides: `.wrap`-Breite
  (Standard 1180 · begleitung 1100 · Rechtsseiten 780) und der mehrspaltige
  Footer der Startseite.

**Kanonische Werte** (nicht pro Seite abwandeln): Umbruchpunkte **900** und **540**,
`section`-Padding `clamp(74px,12vw,140px)`, `h1,h2,h3` line-height **1.06**,
`.reveal` 30px/0.9s mit d1 = .1s, d2 = .2s, d3 = .3s.

## Design-System
- **Dunkel & cinematisch.** Alle Farben als CSS-Variablen in `base.css`.
- **Schriften (seit 03.08.2026):** „Alegreya" (Überschriften, Zitate) + „Alegreya Sans"
  (Fließtext, Vorzeilen, Knöpfe), **selbst gehostet** in `assets/fonts/` über
  `assets/fonts.css`. Geladen wird nur, was benutzt wird: Alegreya 500 und
  kursiv 400, Alegreya Sans 300/400/700 und kursiv 400 — je Schnitt zwei
  Dateien (`latin` und `latin-ext`; letzteres trägt das ā in „Māori").
  ⚠️ **Andere Gewichte nicht einfach benutzen** — sie existieren nicht und
  der Browser rechnet sich dann den nächstbesten Schnitt zurecht.
  ⚠️ Alegreya setzt Ziffern von Haus aus als **Mediävalziffern**; `base.css`
  schaltet deshalb global `lining-nums` ein. Nicht entfernen, sonst rutschen
  „WAIRUA10", „790 €" und Datumsangaben nach unten.
  Die Schriftnamen stehen auch in `datenschutz.html` § 4 — bei einem Wechsel
  dort mitziehen.
- **Koru-Spirale** als wiederkehrendes Motiv — CSS-Maske aus `assets/koru.png`,
  Klasse `.koru` (Farbe über `color` steuerbar).
- Sanfte Animationen: Ken-Burns im Hero, rotierende Spirale, Reveal beim Scrollen.
- **Voll responsive**, `prefers-reduced-motion` wird respektiert.

## Bilder
- Alle ausgelieferten Fotos liegen web-optimiert vor (q80, sinnvolle Pixelbreiten).
  **Nie wieder Rohdateien in voller Auflösung einbinden.**
- Für Hero- und Kartenbilder gibt es kleinere Varianten (`-600`, `-800`, `-900`)
  und `srcset`/`sizes`. Heroes zusätzlich `fetchpriority="high"`.
- **Jedes `<img>` braucht `width` und `height`** (gegen Layout-Sprünge) und einen
  alt-Text, der *das Bild* beschreibt, nicht das Konzept dahinter.
- Originale: `_projekt/originale-bilder/` · ungenutztes: `_projekt/archiv-assets-ungenutzt/`
  (beides außerhalb der Versionierung, `Kundenprojekte/` steht in der übergeordneten `.gitignore`).
- **Werkzeug:** PowerShell + System.Drawing. Kein ImageMagick/ffmpeg auf der Maschine.
  System.Drawing kann **kein WebP lesen**. Und: GDI+ ist ein schwacher JPEG-Encoder —
  lieber die **Pixelbreite** begrenzen als die Qualität unter ~78 drücken.
  Michael reagiert empfindlich auf matschige Bilder.

## Vorschau (lokal)
`preview_start` mit Name `wairua-spirit-preview`, Port **8796**,
Server-Skript in `../_projekt/serve.ps1`.
⚠️ Im Vorschau-Tab steht die Animations-Timeline still (`document.hidden`), Hero-Texte
mit `animation: rise … forwards` erscheinen dort dauerhaft mit `opacity: 0`.
Das ist **kein Fehler** — zum Prüfen die Animation per `getAnimations()` vorspulen
oder mit Headless-Chrome ein echtes Bild rendern.

## Live stellen (deployen)
Repo **https://github.com/lechcode/wairua-vorschau**, veröffentlicht automatisch
via GitHub Pages auf wairua-spirit.de.
→ **committen + `git push` auf `main`**. GitHub baut in ~1 Minute neu.

## Domain & E-Mail (läuft bereits – nur zur Info)
- DNS bei IONOS: 4× **A** (`@` → 185.199.108–111.153) + **CNAME** (`www`).
- **E-Mail läuft über Google Workspace** (MX-Records). ⚠️ **MX-Einträge niemals anfassen.**

## Stand der Seiten (24.08.2026)
Alle drei Angebotsseiten sind frei gegeben, indexierbar und in der `sitemap.xml`:
`begleitung.html` (Der Weg des Erdhüters, 4-monatige Einzelbegleitung **für Männer**, 850 € — seit 05.09.2026 so positioniert: Kern ist „ein Ende des inneren Kampfes"), `retreat.html`
(Winter-Retreat, 9.–13.12.2026, 790 €) und `rituale.html` (Jahreskreisfeste).
Nur `impressum.html` und `datenschutz.html` bleiben absichtlich auf `noindex`.
⚠️ Beim Entfernen eines `noindex` **immer** die URL in `sitemap.xml` nachtragen.

**Anmelde- und Buchungswege** (in `datenschutz.html` § 8–10 beschrieben, bei
Änderung dort mitziehen): Rituale über PayPal-Link · Retreat über ein
Google-Formular · Einzelbegleitung über Google-Terminbuchung (Link steht
**dreimal** in `begleitung.html`: Navigation, Ausrichtung, Schluss).

## Offen
- Auf `begleitung.html` fehlen Stimmen früherer Begleitungen; die strukturierten
  Daten dort kennen den Preis nicht (beim Retreat sind Preis/Termin hinterlegt).
- `retreat.html`: Der Sicherheitshinweis zu Breathwork (Kontraindikationen) ist
  beim Umbau der „Was dich erwartet"-Liste weggefallen — Michael weiß davon.
- Das Hero-Bild der Startseite ist mit 245 KB der größte Einzelposten beim
  ersten Aufruf (gesamt rund 386 KB).

## Inhalte
Texte & Bilder stammen von Michael. Die Testimonials sind echt — nur mit seiner
Freigabe ändern. Preise, Termine und Bildauswahl entscheidet er selbst.
