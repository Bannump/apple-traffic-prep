# Apple Traffic 3-Day Sprint Tracker

React dashboard to track tasks and notes for the Apple Traffic 3-day interview prep sprint (7-hour daily block).

## Tech stack

- **React 18** + **Vite 5**
- Dark theme (black background), localStorage persistence

## Commands

```bash
# Install dependencies
npm install

# Dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Deploy

The app is a static SPA. After `npm run build`, deploy the `dist` folder to any static host.

### Vercel

```bash
npm i -g vercel
vercel
```

Or connect the repo at [vercel.com](https://vercel.com); use default settings (build: `npm run build`, output: `dist`).

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect the repo at [netlify.com](https://netlify.com); `netlify.toml` is already configured (build: `npm run build`, publish: `dist`, SPA redirects).

### GitHub Pages

1. In `vite.config.js` set `base: '/your-repo-name/'`.
2. Build: `npm run build`.
3. Deploy the contents of `dist` to the `gh-pages` branch or use the GitHub Actions workflow for static sites.
