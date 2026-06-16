# wairua – Projektkontext (für Claude Code)

Dies ist die Website von **Michael / wairua** — live unter **https://wairua-spirit.de**.

## Aufbau
Statische Website, **eine Datei pro Seite** — kein Build-System, kein npm, keine Frameworks.
- `index.html` – Startseite
- `begleitung.html` – Unterseite „Dein Kanu-Partner – Im Fluss des Lebens"
- `assets/` – alle Bilder (Originale + Logo)
- `CNAME` – verbindet die Domain wairua-spirit.de mit GitHub Pages → **nicht löschen**
- `.nojekyll` – sagt GitHub Pages: kein Jekyll-Processing

## Design-System (in beiden HTML-Dateien identisch, im `<style>`-Block)
- **Dunkel & cinematisch.** Alle Farben als CSS-Variablen in `:root` (`--bg`, `--gold`, `--bone`, `--moss` …).
- **Schriften:** „Cormorant Garamond" (Überschriften) + „Inter" (Fließtext), via Google Fonts.
- **Koru-Spirale** (Michaels Logo) als wiederkehrendes Motiv — per CSS-Maske aus `assets/logo.png`, Klasse `.koru` (Farbe über `color` steuerbar).
- Sanfte, „atmende" Animationen: Ken-Burns im Hero, langsam rotierende Spirale, `.reveal`-Einblendungen beim Scrollen (IntersectionObserver, kleines `<script>` am Seitenende).
- **Voll responsive**, Mobile-Breakpoints bei `900px` und `540px`. `prefers-reduced-motion` wird respektiert.

## Vorschau (lokal)
`index.html` einfach im Browser öffnen — oder Claude Code bitten, eine lokale Vorschau zu starten.

## Live stellen (deployen)
Die Seite liegt im GitHub-Repo **https://github.com/Lechcode/wairua-vorschau** und veröffentlicht sich **automatisch via GitHub Pages** auf wairua-spirit.de.
→ Änderungen live bringen: **committen + `git push` auf `main`**. GitHub baut in ~1 Minute neu.

## Domain & E-Mail (läuft bereits – nur zur Info)
- DNS bei IONOS: 4× **A** (`@` → 185.199.108–111.153) + **CNAME** (`www` → cominghomemira.github.io).
- **E-Mail läuft über Google Workspace** (MX-Records). ⚠️ **MX-Einträge niemals anfassen.**

## ✅ Noch zu erledigen (wichtig)
1. **Impressum + Datenschutzerklärung** einsetzen — aktuell Platzhalter-Links (`#`). **Pflicht in Deutschland.**
2. Echte **Instagram-/YouTube**-Links statt `#`.
3. **WhatsApp-Nummer** prüfen (aktuell `https://wa.me/491602302132`).
4. Sobald 1–3 erledigt: in **beiden** Dateien die Zeile
   `<meta name="robots" content="noindex, nofollow" />` **entfernen**, damit Google die Seite findet.
5. Optional: Bilder in `assets/` sind volle Auflösung → für schnellere Ladezeit web-optimieren.

## Inhalte
Texte & Bilder stammen von Michael. Die Testimonials sind echt — nur mit seiner Freigabe ändern.
