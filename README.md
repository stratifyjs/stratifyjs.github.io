# Stratify Documentation (VitePress)

This repository hosts the VitePress documentation site for Stratify.

## Commands

- `npm install` - install deps
- `npm run dev` - start VitePress locally
- `npm run build` - build static site to `.vitepress/dist`
- `npm run preview` - preview the built site locally

## Deployment

GitHub Pages deployment is automated via `.github/workflows/deploy.yml` on pushes to `main`.
The workflow builds the site and publishes the `dist` output using GitHub Pages actions.
