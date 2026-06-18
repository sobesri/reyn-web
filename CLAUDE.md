# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`reyn-web` is a React 19 + TypeScript web application built with Vite 8.

## Commands

```bash
npm run dev        # start dev server (http://localhost:5173)
npm run build      # type-check + production build (output: dist/)
npm run preview    # serve production build locally
npm run lint       # ESLint
```

No test runner is configured yet — add one (e.g. Vitest) as needed.

## Architecture

- Entry: `index.html` → `src/main.tsx` (mounts `<App />` into `#root`)
- `src/App.tsx` — root component
- `src/` — all source code; components, hooks, and pages go here
- `public/` — static assets served as-is at the root URL
- `src/assets/` — assets imported directly by source files (Vite processes these)

## Toolchain notes

- **TypeScript**: strict mode via `tsconfig.app.json`; `tsconfig.node.json` covers Vite config
- **ESLint**: configured in `eslint.config.js` with `typescript-eslint` and `eslint-plugin-react-hooks`
- **Vite plugin**: `@vitejs/plugin-react` (Babel transform, not SWC)
- **Module system**: ESM only (`"type": "module"` in package.json)
