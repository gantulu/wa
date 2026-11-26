# WhatsApp PWA

A static, installable-web-app project built with modular HTML, CSS, and JavaScript. The frontend is intended for GitHub Pages; Supabase provides backend capabilities and Meta WhatsApp Cloud API integration is handled server-side.

## Technology baseline

- HTML, CSS, and native JavaScript modules
- Node.js 20 or newer for project scripts
- Custom build script using Node.js built-in modules (no runtime/build dependencies)
- GitHub Pages target: https://gantulu.github.io/wa/
- Published base path: `/wa/`

## Getting started

```bash
npm ci
npm run build
```

The static site is generated in `dist/`. The `dist/` directory is build output and is not the source of truth. Do not edit generated files directly.

To remove generated output:

```bash
npm run clean
```

## PWA foundation

- Manifest: `public/manifest.json` with `start_url` and `scope` set to `/wa/`.
- Service Worker: `public/sw.js`, registered by `src/js/pwa.js`.
- Offline document: `public/offline.html`.
- App icons: 192×192, 512×512, and 512×512 maskable PNG files under `public/icons/`.
- Navigation uses network-first with an offline fallback; same-origin static assets use cache-first with runtime caching.
- Service Worker updates are detected on app load; a user-visible update action activates the waiting worker and reloads the page after controller change.

Service Workers require a secure context (HTTPS, or localhost for development). The GitHub Pages target uses HTTPS. The current app shell is intentionally small; expand the precache list when additional critical routes and assets are introduced.

## Project layout

- `public/`: static files copied to the published root.
- `pages/`: secondary HTML pages, copied to `dist/pages/`.
- `src/assets/`: application assets, copied to `dist/assets/`.
- `src/css/`: stylesheets, copied to `dist/assets/css/`.
- `src/js/`: JavaScript modules, copied to `dist/assets/js/`.
- `scripts/`: local build and maintenance scripts.
- `tests/`: test suites introduced in later phases.
- `docs/`: architecture and project documentation.
- `dist/`: generated output; excluded from Git.

When `pages/404.html` exists, the build also publishes it as `dist/404.html`, the root-level custom error document expected by GitHub Pages.

## Environment and security

`.env.example` is a documentation template only; the current static build does not load environment files or inject values into browser assets. Never commit real credentials.

- A Supabase anon/publishable key may be used by a browser client in a later phase, with appropriate Row Level Security policies.
- Never expose the Supabase service-role key in frontend code.
- Never expose Meta WhatsApp access tokens or app secrets in frontend code.
- Store server-side credentials in Supabase Edge Function secrets.

## Deployment

GitHub Pages deployment configuration is deferred to a later implementation phase. The build output is `dist/`; application-relative URLs must remain compatible with the `/wa/` base path.

## Project workflow

Each implementation phase requires separate explicit approval. Completing this foundation does not authorize backend, integration, or deployment work.
