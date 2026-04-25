# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Akira is a **Lampa media-center UI plugin** — a single self-contained JavaScript file loaded by the Lampa app at runtime. There is no build step, no bundler, no package manager, and no test suite. Edit the JS directly and reload Lampa to see changes.

## Files

- `akira.js` — production plugin. Netflix-style hero, Apple TV top bar, TMDB rows, card/full logos.
- `akira_ai.js` — alternative experimental build with a dock, spotlight stage, and mood-based themes.
- `temp/` — donor/reference plugins kept out of version control per README. Never import from here; use as research only.

## Plugin architecture

Both files share the same structural pattern:

```
IIFE
  └── guard flag (window[GUARD]) — prevents double init
  └── CONFIG / CONST — all string keys, theme tokens, TMDB key, i18n strings
  └── mountAkira(cfg) — single outer function; all helpers are closures inside it
        ├── Storage helpers  get/set/isOn/ensureValue via Lampa.Storage
        ├── i18n helpers     langCode / localize / text / tr
        ├── TMDB helpers     tmdbApi / tmdbImage / fetchLogo / fetchDetails / resolveLogoItem
        ├── Home interface   AkiraHomeInfo / initHomeInterface / decorateHomeCard
        ├── Topbar           patchTopbar / patchMenuBrand / selectedTopbarItems / updateClock
        ├── Full card        applyFullLogo / syncFullBackdrop / updateFullFog
        ├── Settings         addSettings / initDefaultSettings / addTmdbCollectionSettings
        ├── TMDB source      initTmdbSource / createTmdbMain
        ├── CSS              injectStyle — one large <style> block injected into <head>
        ├── DOM watcher      observeDom / schedulePatch / safePatch
        └── boot             startPlugin → boot, triggered on Lampa 'app:ready' or DOMContentLoaded
```

`akira_ai.js` follows the same skeleton but replaces the topbar with a **dock**, and the hero with a **spotlight stage**. Its mood system (`MODES`: atelier / ember / polar / mono) maps to the same CSS-variable injection pattern as `akira.js` themes.

## Lampa integration points

- **Lampa.Storage** — persists all user settings (key prefix `akira_` / `akira_ai_`).
- **Lampa.Listener** — `follow('app', ...)` waits for `{type:'ready'}` before booting; `follow('activity', ...)` / other events drive runtime patches.
- **Lampa.Activity.push(...)** — navigates to Lampa screens (main, movie, tv, etc.).
- **Lampa.Lang.translate(key)** — pulls localized strings from Lampa's own dictionary; plugin provides its own fallbacks via `tr()`.
- **Lampa.Select / Lampa.Input** — used for settings UI modals.
- The plugin monkey-patches Lampa's home-interface object (`wrapHomeMethod`) to inject the hero and TMDB rows without touching Lampa source.

## TMDB

All TMDB requests go through `tmdbApi(path)` which calls `https://api.themoviedb.org/3/<path>&api_key=<tmdbKey>`. Logo fetching has a two-level cache (`logoCache` / `logoPending`) to avoid duplicate requests. Artwork resolution prefers the user's UI language, falls back to English.

## Key settings storage keys (akira.js)

All stored under `Lampa.Storage` with prefix `akira_`:
`enabled`, `theme`, `topbar`, `topbar_align`, `hero`, `hero_logo`, `card_logo`, `full_logo`, `ui_scale`, `perf`, `tmdb_rows`, `tmdb_collection_<id>`, `topnav_items`, `logo_lang`.

## Themes / modes

`akira.js` themes (`red_premium`, `graphite_red`, `cinema_mint`, `ice_cyan`) and `akira_ai.js` modes (`atelier`, `ember`, `polar`, `mono`) are plain objects with CSS color tokens. `injectStyle()` reads them and writes CSS custom properties onto `:root` / `[data-akira-*]` attributes. To add a theme, add an entry to the `themes`/`MODES` object and `injectStyle()` picks it up automatically.

## Development workflow

1. Edit `akira.js` (or `akira_ai.js`) directly.
2. Serve the file over HTTP (e.g. `npx serve .` or any static server).
3. In Lampa → Settings → Plugins, paste the file URL and reload.
4. Use browser DevTools console — the plugin logs errors with `try/catch` silently, so add `console.log` probes when debugging.

No linting config exists; the codebase uses ES5-compatible `var`/`function` style throughout — keep new code consistent with that style.
