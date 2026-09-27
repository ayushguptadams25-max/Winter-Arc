# Winter Arc — installable offline PWA

A 5-month (1 Oct 2026 – 28 Feb 2027) meditation, communication, voice/speech
and fitness program, built as a single installable web app. Works fully
offline once installed — no server, no backend, no internet required after
the first load. All progress is stored only on your device (localStorage).

The app now opens with an animated loading screen — a lone swordsman
standing under a glowing moon in a falling-snow night sky — before handing
off to the app itself. It's pure CSS/SVG (no image files), so it loads
instantly offline and costs nothing in app size. Tap it to skip early.

## Why it installed as a "shortcut" instead of a real app

This is almost always caused by **how** the site was opened, not the code:
- Opening `index.html` directly from a file (`file://…`) or from a plain
  file host with no HTTPS: browsers refuse to register the service worker
  or treat the manifest as installable there, and silently fall back to a
  plain bookmark/shortcut icon.
- Visiting through a link-preview/in-app browser (e.g. opened from a chat
  or social app) instead of the real Chrome/Safari app — those in-app
  browsers usually can't install PWAs at all.

The fix is the same as before: **serve it over real HTTPS** (GitHub Pages,
steps below) and open that HTTPS link directly in Chrome (Android) or
Safari (iPhone) — not a preview browser — before installing. Everything
else (manifest, service worker, meta tags) was already correctly set up
for a true installable app; nothing in that part needed to change.

## Files in this folder

```
winter-arc-app/
├── index.html      ← the entire app (all content, logic and styling)
├── manifest.json    ← PWA manifest (app name, icons, colors, display mode)
├── sw.js            ← service worker (caches everything for true offline use)
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    └── apple-touch-icon.png
```

Upload **all of these files, keeping the same folder structure** (the
`icons/` folder must stay a subfolder — don't flatten it). Nothing else is
needed; there is no build step, no dependencies, no npm install.

## Deploy with GitHub Pages (free, exact steps)

1. **Create a new repository** on GitHub (e.g. `winter-arc`). Public or
   private both work with GitHub Pages (private repos need GitHub Pro/Team
   for Pages, so public is simplest if you're on a free plan).
2. **Upload the files**: on the repo page, click "Add file" → "Upload
   files", drag in `index.html`, `manifest.json`, `sw.js`, and the whole
   `icons` folder (GitHub preserves the folder structure), then commit.
   (Or, if you use git locally: `git add .`, `git commit -m "Winter Arc PWA"`,
   `git push`.)
3. **Turn on Pages**: go to the repo's **Settings** tab → **Pages** (left
   sidebar) → under "Build and deployment", set **Source** to
   "Deploy from a branch" → **Branch**: `main` (or `master`), folder `/ (root)`
   → **Save**.
4. **Wait ~1 minute**, then refresh the Pages settings page. GitHub shows
   a green banner with your live URL, in the form:
   `https://<your-username>.github.io/<repo-name>/`
5. **Open that URL on your phone.** This step matters: GitHub Pages serves
   over HTTPS on a real domain, which is required for both the service
   worker and the "Install app" prompt to work — neither works from a
   plain local file.

## Installing it on your phone

- **Android (Chrome):** open the URL above. A blue "📲 Install App" button
  appears at the bottom-right once Chrome recognizes it as installable —
  tap it and confirm. If it hasn't appeared yet, use the ⋮ menu → "Add to
  Home screen" / "Install app" instead — same result.
- **iPhone (Safari):** open the URL above, tap the Share icon, then "Add to
  Home Screen." iOS has no separate "Install" option — this is its
  equivalent, and it behaves the same way (full-screen, own icon).

Once installed, it opens full-screen with its own snowflake icon, no
browser address bar, and works with the phone in airplane mode.

## How the offline behavior works

- `sw.js` is a service worker: the first time you visit the page online, it
  downloads and caches every file the app needs (`index.html`,
  `manifest.json`, and the icons).
- On every visit after that — online or fully offline — it serves those
  files straight from the cache instead of the network, so the app loads
  instantly and works with zero connectivity.
- All your daily check-offs and journal entries are saved with the
  browser's `localStorage` on that one device. They are never uploaded
  anywhere. Use the **Export** button on the app's Progress tab any time to
  save a `.json` backup file.

## If you edit the app later

If you change `index.html` (add a task, fix wording, etc.) after it's
already installed on a phone, bump the cache name in `sw.js` so the
service worker knows to fetch the new version instead of serving the old
cached one:

```js
var CACHE_NAME = 'winter-arc-v1';   // change to 'winter-arc-v2', 'v3', etc.
```

Without this bump, an already-installed phone may keep showing the old
cached version until the old cache expires on its own.

## Custom domain (optional)

GitHub Pages also supports a custom domain (e.g. `winterarc.yourdomain.com`)
via Settings → Pages → "Custom domain" — this isn't required, the default
`github.io` URL works exactly the same for installing and offline use.
