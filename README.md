# WhatsApp PWA

A static, installable-web-app project built with modular HTML, CSS, and JavaScript. The frontend is intended for GitHub Pages; Supabase provides backend capabilities and Meta WhatsApp Cloud API integration is handled server-side.

## Technology baseline

- HTML, CSS, and native JavaScript modules
- Node.js 20 or newer for project scripts
- Custom build script using Node.js built-in modules (no runtime/build dependencies)
- GitHub Pages target: https://gantulu.github.io/wa/
- Published base path: `/wa/`
- Deployment source: branch `main`, folder `/(root)`

## Getting started

```bash
npm ci
npm run build
```

The static site is served directly from the repository root by GitHub Pages. The `dist/` directory is generated only for local build verification and is not the GitHub Pages publishing source. Do not edit generated files directly.

To remove generated output:

```bash
npm run clean
```

## PWA foundation

- Manifest: `manifest.json` with `start_url` and `scope` set to `/wa/`.
- Service Worker: `sw.js`, registered by `src/js/pwa.js`.
- Offline document: `offline.html`.
- App icons: 192×192, 512×512, and 512×512 maskable PNG files under `icons/`.
- Navigation uses network-first with an offline fallback; same-origin static assets use cache-first with runtime caching.
- Service Worker updates are detected on app load; a user-visible update action activates the waiting worker and reloads the page after controller change.

Service Workers require a secure context (HTTPS, or localhost for development). The GitHub Pages target uses HTTPS. The current app shell is intentionally small; expand the precache list when additional critical routes and assets are introduced.

## Project layout

- Root deployment files: `index.html`, `manifest.json`, `sw.js`, and `offline.html`.
- `icons/`: PWA icons served directly from the repository root.
- `pages/`: secondary HTML pages.
- `src/assets/`: application assets.
- `src/css/`: stylesheets.
- `src/js/`: JavaScript modules, including Service Worker registration.
- `scripts/`: local build and maintenance scripts.
- `tests/`: test suites introduced in later phases.
- `docs/`: architecture and project documentation.
- `dist/`: generated local verification output; excluded from Git.

## Environment and security

`.env.example` is a documentation template only; the current static build does not load environment files or inject values into browser assets. Never commit real credentials.

- A Supabase anon/publishable key may be used by a browser client in a later phase, with appropriate Row Level Security policies.
- Never expose the Supabase service-role key in frontend code.
- Never expose Meta WhatsApp access tokens or app secrets in frontend code.
- Store server-side credentials in Supabase Edge Function secrets.

## Deployment

GitHub Pages is intended to publish directly from `main / (root)` using **Deploy from a branch**. GitHub Actions deployment is not used. GitHub Pages repository settings are managed separately and are not changed by the local build.

## Project workflow

Each implementation phase requires separate explicit approval. Completing this foundation does not authorize backend, integration, or GitHub Pages configuration changes.
