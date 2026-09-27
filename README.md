# Winter Arc — installable offline PWA

A 5-month (1 Oct 2026 – 28 Feb 2027) meditation, communication, voice/speech
and fitness program, built as a single installable web app. Works fully
offline once installed — no server, no backend, no internet required after
the first load. All progress is stored only on your device (localStorage).

The app now opens with an animated loading screen — a lone swordsman
standing under a glowing moon in a falling-snow night sky — before handing
off to the app itself. It's pure CSS/SVG (no image files), so it loads
instantly offline and costs nothing in app size. Tap it to skip early.

## Why "Install" said "This app cannot be installed"

Your icon files were uploaded straight into the repo root, but the app's
code was still looking for them inside an `icons/` subfolder — so every
icon request 404'd. Chrome requires a working icon to consider a site
installable, so it correctly refused. That 404 also broke the service
worker's offline cache (its install step fetches every file in one atomic
batch — if any one of them 404s, the whole cache fails silently), so
offline mode likely wasn't fully working either.

Fixed: the code now points at the icons in the repo root directly — no
subfolder, matching exactly what you already uploaded. Re-upload the 7
files in this folder (overwrite the existing ones), wait ~1 minute for
GitHub Pages to rebuild, then reload the site in Chrome and try
**⋮ → Install and create shortcut** again — "Install" should now work.

## Files in this folder

```
README.md
index.html      ← the entire app (all content, logic and styling)
manifest.json   ← PWA manifest (app name, icons, colors, display mode)
sw.js           ← service worker (caches everything for true offline use)
icon-192.png
icon-512.png
apple-touch-icon.png
```

All seven files go **directly in the repo root** — no subfolder. (An
earlier version of this app used an `icons/` subfolder; that's been
removed so the code always matches a flat upload, since that's how
GitHub's "Add file → Upload files" tends to end up when files are
dragged in individually.)

Upload **all seven files**, overwriting the existing ones with the same
names. Nothing else is needed; there is no build step, no dependencies,
no npm install.

## Deploy with GitHub Pages (free, exact steps)

1. **Create a new repository** on GitHub (e.g. `winter-arc`). Public or
   private both work with GitHub Pages (private repos need GitHub Pro/Team
   for Pages, so public is simplest if you're on a free plan).
2. **Upload the files**: on the repo page, click "Add file" → "Upload
   files", drag in all 7 files from this folder at once (`index.html`,
   `manifest.json`, `sw.js`, `README.md`, and the three `.png` icons —
   no subfolder), then commit. (Or, if you use git locally: `git add .`,
   `git commit -m "Winter Arc PWA update"`, `git push`.)
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
