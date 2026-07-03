# Waleed Ahmad — Portfolio & Workspace

An interactive engineering portfolio that maps the relationships between products, systems, technologies, experience, and applied AI work.

The site combines detailed project case studies with a D3-powered workspace graph, global search, keyboard-friendly navigation, and responsive motion. It is designed as an explorable system rather than a conventional collection of portfolio pages.

## Highlights

- Interactive relationship graph with drag, zoom, and linked project nodes
- Responsive desktop and mobile graph experiences
- Product case studies for WePsych, Arabia Hills, and ALFA Club
- Systems and applied-intelligence showcases
- Filterable relationship explorer
- Search and navigator available throughout the site
- Career and education timeline
- Reduced-motion support and responsive layouts

## Tech stack

- [Next.js 16](https://nextjs.org/) with the App Router and Turbopack
- [React 19](https://react.dev/) and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [D3.js](https://d3js.org/) for network visualization
- [Motion](https://motion.dev/) for interface animation
- [Lucide React](https://lucide.dev/) for icons

## Getting started

### Prerequisites

- Node.js 20.9 or later
- npm

### Installation

```bash
git clone https://github.com/M-Waleed-Ahmad/me.git
cd me
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

The project currently requires no environment variables for local development.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

To preview a production build locally:

```bash
npm run build
npm run start
```

## Main routes

| Route | Description |
| --- | --- |
| `/` | Interactive workspace overview and network graph |
| `/products` | Product portfolio and case-study index |
| `/products/wepsych` | WePsych case study |
| `/products/arabia-hills` | Arabia Hills case study |
| `/products/alfa-club` | ALFA Club case study |
| `/systems` | Architecture, automation, CI/CD, and testing work |
| `/intelligence` | Applied AI, media forensics, robotics, and evaluation work |
| `/explorer` | Filterable relationship explorer |
| `/journey` | Education and professional timeline |
| `/contact` | Contact links and résumé |

## Project structure

```text
src/
├── app/          # App Router pages, layout, and global styles
├── components/   # Shared UI, navigation, search, and graph components
├── context/      # Navigator and search state providers
└── data/         # Workspace graph nodes and relationships
public/           # Static assets and résumé
```

Graph content is defined in `src/data/workspaceData.ts`. Add or update nodes and edges there to change the relationships rendered across the workspace.

## Deployment

The application can be deployed to any platform that supports Next.js. For Vercel, import the repository and use the detected defaults; no additional environment configuration is currently needed.

## Contact

- [LinkedIn](https://www.linkedin.com/in/waleed-ahmad-0bb087260/)
- [GitHub](https://github.com/M-Waleed-Ahmad)
- [Email](mailto:waleed.ahmadmunir@gmail.com)
