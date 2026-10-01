# Waleed Ahmad · Portfolio

[![CI](https://github.com/M-Waleed-Ahmad/me/actions/workflows/ci.yml/badge.svg)](https://github.com/M-Waleed-Ahmad/me/actions/workflows/ci.yml)

My portfolio, laid out like an engineering notebook: case studies written as decisions, annotated architecture
figures, and a few interactive pieces where interaction actually explains something (the DeepShield confidence
bands, the connection map, the relationship explorer).

## Stack

- [Next.js 16](https://nextjs.org/) App Router. Every route is statically prerendered; pages are Server Components
  with small client islands.
- React 19, TypeScript (strict), Tailwind CSS 4
- Instrument Serif, Geist and Geist Mono via `next/font`
- D3 (force layout for the explorer), Framer Motion (explorer and search transitions only)
- Playwright smoke tests, run in GitHub Actions on every push and pull request

## Getting started

Requires Node.js 20.9 or later.

```bash
git clone https://github.com/M-Waleed-Ahmad/me.git
cd me
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run test:e2e` | Playwright smoke tests against the production build (run `npm run build` first) |

The first time you run the tests, install a browser with `npx playwright install chromium`, or reuse one you
already have: `PW_CHANNEL=msedge npm run test:e2e` (or `chrome`).

The smoke tests load every route on desktop and mobile viewports. They fail on any console error or hydration
mismatch, on horizontal overflow, or on missing titles, canonical URLs or share images. They also cover search,
the DeepShield slider and the explorer graph.

## Routes

| Route | Content |
| --- | --- |
| `/` | Intro and connection map with a project list: hover to trace, click to open |
| `/products` | Work index, smaller builds and research notes |
| `/products/deepshield` | DeepShield project page |
| `/products/wepsych` | WePsych project page |
| `/products/arabia-hills` | Arabia Hills project page |
| `/products/alfa-club` | ALFA Club project page |
| `/products/other` | Smaller client builds |
| `/journey` | Experience, education, leadership |
| `/journey/axelliant` | Deep-dive on the Axelliant CI/CD and test automation role |
| `/process` | How the site was built with AI, and how it was checked |
| `/explorer` | Interactive relationship graph |
| `/contact` | Contact details and résumé |

`/systems` and `/intelligence` redirect to the Axelliant deep-dive and the DeepShield page.

## Project structure

```text
src/
├── app/                 # Routes, metadata, OG image, icon, sitemap, robots
├── components/
│   ├── ui.tsx           # Layout primitives: Figure, MarginNote, Decision, TagList…
│   ├── home/            # Map home page
│   ├── project/         # Project page parts: hero, cards, questions, walk-through
│   └── figures/         # Diagrams, connection map, charts, access matrix
├── context/             # Search state
├── data/
│   ├── site.ts          # Profile, selected work, experience (keep in sync with the CV)
│   └── workspaceData.ts # Graph nodes and edges for the map and explorer
└── lib/metadata.ts      # Per-page metadata helper
tests/                   # Playwright smoke tests
```

### Adding product screenshots

Put images in `public/work/<slug>/` and list them in the `screenshots` array for that project in
`src/data/site.ts`:

```ts
screenshots: [
  { src: '/work/wepsych/dashboard.png', alt: 'CPD dashboard with pathway progress', width: 1600, height: 1000 },
],
```

Project pages show them under the title section automatically.

### Theming

Colour tokens live in `src/app/globals.css`. The light "paper" palette is the default; a dark palette applies
automatically when the OS is set to dark mode. Components use only the tokens (`bg-paper`, `text-ink`,
`border-rule`, `text-accent`…), so changing the palette means editing one file.

## Deployment

Deploys to Vercel with default settings. Canonical URLs, the sitemap and Open Graph tags use the Vercel production
domain automatically; set `NEXT_PUBLIC_SITE_URL` if you serve the site from a custom domain.

## Contact

- [Email](mailto:waleed.ahmadmunir@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/waleed-ahmad-0bb087260/)
- [GitHub](https://github.com/M-Waleed-Ahmad)
