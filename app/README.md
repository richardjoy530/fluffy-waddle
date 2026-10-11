# wbskt.com

The WBSKT marketing site, built with Angular and deployed to GitHub Pages from `master`.

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/features` | Features |
| `/get-started` | Get started guide |

The page templates in `src/app/pages` and the styles in `src/styles/_canvas.scss` are ported from the design canvas. Button and link targets (sign up, log in, GitHub, docs) live in `src/app/links.ts`.

## Run it locally

```bash
npm ci
npm start
```

Then open http://localhost:4200/.

## Build

```bash
npm run build -- --configuration production
```
