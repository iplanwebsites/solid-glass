# @solid-glass/web

The solid-glass documentation & demo website.

## Architecture

- **Framework**: [Vike](https://vike.dev) (Vite plugin for SSR/SSG)
- **Rendering**: Mix of SSG and CSR
- **Hosting**: Cloudflare Workers (static assets)

### Page Rendering Strategy

| Page | Rendering | Reason |
|------|-----------|--------|
| `/docs` | **SSG** | Static content, pre-rendered at build time |
| `/` (home) | CSR | Uses canvas-based SVG refraction (GlassHero bubbles) |
| `/gallery` | CSR | Interactive SVG refraction demos |
| `/components` | CSR | Interactive SVG refraction demos |
| `/showcase` | CSR | Heavy interactive playground |
| `/kitchen` | CSR | Experimental, not pre-rendered |

SSG pages are fully pre-rendered to HTML at build time for SEO and fast initial load.
CSR pages render a shell with proper `<title>` and meta tags, then hydrate client-side.

## Development

```bash
# Fast HMR dev server
pnpm dev

# Build for production (SSG + client bundles)
pnpm build

# Preview production build locally
pnpm preview
```

## Deployment

```bash
# Deploy to Cloudflare Workers
pnpm deploy
```

Or push to main — Cloudflare auto-deploys via `wrangler.toml` build command.

## Project Structure

```
packages/web/
├── pages/                    # Vike file-based routing
│   ├── +config.ts           # Global config (prerender: true default)
│   ├── +Layout.tsx          # Shared layout (nav, footer)
│   ├── +Head.tsx            # Shared <head> elements
│   ├── index/
│   │   ├── +Page.tsx        # Homepage
│   │   ├── +title.ts        # Page title
│   │   └── +config.ts       # ssr: false (CSR)
│   ├── docs/
│   │   ├── +Page.tsx        # Docs (SSG)
│   │   └── +title.ts
│   ├── gallery/
│   │   ├── +Page.tsx
│   │   ├── +title.ts
│   │   └── +config.ts       # ssr: false
│   └── ...
├── src/
│   ├── components/          # Shared React components
│   ├── pages/               # Legacy page components (reused by Vike pages)
│   └── styles/
│       └── globals.css      # Tailwind + custom styles
├── dist/
│   ├── client/              # Static assets for CF Workers
│   └── server/              # SSR bundle (not used in static mode)
├── vite.config.ts
├── wrangler.toml            # CF Workers config
└── package.json
```

## Adding a New Page

1. Create `pages/my-page/+Page.tsx`
2. Create `pages/my-page/+title.ts` (export default "Title")
3. Optionally create `pages/my-page/+config.ts`:
   - `{ prerender: true }` — SSG (default)
   - `{ ssr: false }` — CSR only (for canvas/WebGL/heavy interactivity)

## Notes

- **SSR limitations**: The SVG refraction engine uses `document.createElement('canvas')` which doesn't exist during SSR. Pages using `createLiquidGlass()` must be CSR-only.
- **Vike warning**: The "Define settings in +config.js" warning is cosmetic and can be ignored.
- **Links**: Use `<a href="/path">` instead of react-router's `<Link>`. Vike handles client-side navigation automatically.
