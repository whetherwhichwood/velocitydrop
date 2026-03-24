/**
 * Exists so Vercel can detect Next.js when the Git project root is the monorepo root.
 * The real app and `next build` run from the `site/` workspace (see root package.json `build:site`).
 */
export { default } from './site/next.config.mjs';
