# nmquandev.github.io

Portfolio of Quan Minh Nguyen, in English and Vietnamese, served by GitHub Pages from the repo root.
It has two layouts built from the same HTML:

- **Desktop**: windows, a dock, desktop icons and a terminal, in the style of a desktop OS.
- **Simple**: one page to scroll, laid out after Brittany Chiang's v4 portfolio: a greeting hero,
  numbered sections, experience tabs, featured projects next to their main result, a grid of other
  projects, and a "Get in touch" ending.

The switch is in the top right corner, next to the language switch. Phones start in the simple layout
and other screens in the desktop layout. A visitor's choice is saved in the browser, and a link with
`?view=simple` or `?view=desktop` opens that layout, for example in a CV or a job application.

This repo holds only the site. Client names and some project details are encrypted in
`assets/vault.json`; a visitor who gets a 6-digit code from Quan can show them. The code check, the chat
assistant and the contact form call a small API whose code lives in a private repo.

## Layout

| Path | What it is |
|---|---|
| `index.html` | All content, used by both layouts. Windows marked `data-section` become page sections in the simple layout |
| `assets/js/boot.js` | Runs before first paint: picks the language, theme and layout |
| `assets/js/main.js` | Entry module; it lists every other module in `assets/js/` and starts them in order |
| `assets/css/` | `base.css` (colours, shared parts), `desktop.css`, `content.css`, `chat.css`, `simple.css` |
| `assets/config.js` | API endpoints: the local Functions host on localhost, Azure in production |
| `assets/vault.json` | The hidden details, encrypted with AES-256-GCM |
| `assets/cv-public.pdf` | The CV with client names covered |
| `assets/og-image.jpg` | The 1200×630 card that link previews show |
| `.github/workflows/publish-site.yml` | Publishes the site with a version stamp and tag |
| `VERSION` | `MAJOR.MINOR` of the site version |

## Run locally

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://localhost:8765. On localhost the site calls the API at `localhost:7071`, so the code check
and the chat only work while that API runs too.

## Publishing and versions

Every push to `master` runs `publish-site.yml`, which publishes `index.html` and `assets/` to GitHub
Pages. The version is the `MAJOR.MINOR` in `VERSION` plus the commit count, so each new commit gets a
higher number. The workflow writes it, with the commit and build time, to `assets/version.json`, and
tags the commit `vX.Y.Z` once the deploy succeeds.

Browsers keep the files for 10 minutes, so the workflow adds `?v=<version>` to every style, script and
icon in `index.html` and to every import between the modules in `assets/js/`. A module file name may
use lowercase letters, digits and hyphens only, or the rewrite will miss it and the build stops.

To see what is live, open the site's Terminal and type `version`.
