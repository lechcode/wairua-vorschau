# wairua – Projektkontext (für Claude Code)

Dies ist die Website von **Michael / Wairua.Spirit** — live unter **https://wairua-spirit.de**.

## Aufbau
Statische Website, **eine Datei pro Seite** — kein Build-System, kein npm, keine Frameworks.

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite |
| `begleitung.html` | Einzelbegleitung in der Natur – ein Tag draußen |
| `retreat.html` | Winter-Retreat für Männer, Nordsee (noch `noindex`) |
| `rituale.html` | Rituale & Jahreskreisfeste, Anmeldung über PayPal (noch `noindex`) |
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
- **Schriften:** „Cormorant Garamond" (Überschriften) + „Inter" (Fließtext),
  **selbst gehostet** in `assets/fonts/` über `assets/fonts.css`.
  ⚠️ Beides sind **Variable Fonts** — 400/500/600 zeigen absichtlich auf
  dieselbe `.woff2`, die Gewichte kommen aus der `wght`-Achse. Das ist Googles
  eigene Ausgabe und **kein Fehler**; es gibt bei Google keine separaten
  Schnitt-Dateien zum Nachladen.
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

## Offen
1. `retreat.html`: Termin, Endpreis, Oskars Nachname, Bildrechte Seminarhaus.
   Erst danach `noindex` raus, Event-Schema ergänzen (Vorlage in `rituale.html`)
   und die Seite in die Startseiten-Navigation nehmen.
2. `rituale.html`: `noindex` raus, sobald der Termin final ist.
   Beim Entfernen eines `noindex` **immer** die URL in `sitemap.xml` nachtragen.
3. Anmeldeformular auf `retreat.html` ist ein `mailto:` — auf Handys ohne
   Mail-App geht die Anfrage verloren. Ein echter Formulardienst fehlt noch.

## Inhalte
Texte & Bilder stammen von Michael. Die Testimonials sind echt — nur mit seiner
Freigabe ändern. Preise, Termine und Bildauswahl entscheidet er selbst.
