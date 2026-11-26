# nmquan2504.github.io

Portfolio of Quan Minh Nguyen. A static site in the style of a desktop OS, in English and Vietnamese,
served by GitHub Pages from the repo root.

This repo holds only the site. Client names and some project details are encrypted in
`assets/vault.json`; a visitor who gets a 6-digit code from Quan can show them. The code check, the chat
assistant and the contact form call a small API whose code lives in a private repo.

## Layout

| Path | What it is |
|---|---|
| `index.html` | The whole page: windows, dock, terminal, chat window |
| `assets/site.js`, `assets/site.css`, `assets/lang.js` | Behaviour, styles, and the language picked before first paint |
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

To see what is live, open the site's Terminal and type `version`.
