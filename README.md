# Blocksmith

A visual landing page builder: assemble a page from ready-made blocks, edit content in a
schema-driven inspector, tune spacing per device, restyle the whole page with a theme, undo
everything, and export a standalone HTML file.

**Stack:** Vue 3 · TypeScript · Vite · Tailwind CSS v4 · Pinia · Vue Router · Zod · Vitest

## Features

- **8 blocks:** navbar, hero, features, testimonials, FAQ, pricing, CTA and footer, plus 3 page
  templates.
- **Editor:**
  - add blocks by click or drag & drop from the library;
  - reorder blocks on the canvas or in the layers panel;
  - duplicate and delete blocks, and hide them on chosen devices.
- **Inspector:**
  - forms are generated from a typed field description, including nested lists (e.g. footer
    columns → links);
  - the block's Zod schema validates input live.
- **Undo/redo:**
  - the command pattern labels every step ("Undo: Delete Pricing");
  - a typing burst merges into a single step.
- **Responsive editing:**
  - preview on desktop, tablet and mobile;
  - per-breakpoint overrides cascade from desktop down;
  - pages adapt through container queries, and so does the exported HTML.
- **Themes:**
  - presets, plus brand color, background, text color, corner radius and fonts;
  - a WCAG contrast warning;
  - derived colors come from `color-mix()`.
- **Persistence:**
  - autosave to IndexedDB;
  - JSON import/export with validation and version migrations;
  - export to a self-contained HTML file.
- **Command palette (⌘K) and hotkeys:**
  - ⌘Z / ⇧⌘Z undo and redo;
  - ⌘D duplicates the selected block, Delete removes it;
  - Alt+↑/↓ moves the selected block, Esc deselects.
- **Accessibility and layout:**
  - keyboard-accessible controls;
  - light and dark editor themes;
  - the editor itself works down to phone width, with off-canvas panels.

## Getting started

```sh
npm install
npm run dev
```

| Script            | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Dev server                                      |
| `npm run build`   | Type-check and production build                 |
| `npm run preview` | Serve the production build                      |
| `npm run test`    | Vitest in watch mode (`test:run` — single run)  |
| `npm run lint`    | ESLint (`lint:fix` — autofix)                   |
| `npm run format`  | Prettier (`format:check` — verify only)         |
| `npm run check`   | Everything CI needs: types, lint, format, tests |

## Architecture

The code follows [Feature-Sliced Design](https://feature-sliced.design/):

- a layer may import only from the layers below it;
- other slices are reached only through their public API (`index.ts`), and ESLint enforces this.

```
src/
  app/        setup: providers (block registry, repository), router, global styles and tokens
  pages/      dashboard, editor, preview, not-found
  widgets/    canvas, block library, layers panel, inspector, page card
  features/   block actions, drag & drop, hotkeys, command palette, autosave, import/export…
  blocks/     landing page blocks — self-describing plugins of the registry — and templates
  entities/   domain model: block, document (+ commands, store, repository), theme, editor state
  shared/     UI kit, utilities, config — no business logic
```

### Page document

- A page is a versioned, serializable JSON document. It is immutable and held in a
  `shallowRef`, so every change produces a new object.
- All changes go through **commands** (`entities/document/model/commands.ts`):
  - each command applies a pure operation and captures what it needs to undo itself;
  - the store keeps the undo and redo stacks;
  - consecutive edits of the same field within one second merge into one step.
- Untrusted input (IndexedDB, imported files) goes through `parseDocument()`:
  - older versions are migrated first;
  - the structure is then validated strictly;
  - finally, block props are validated against each block's own schema. A broken block is
    reported but doesn't make the whole page unreadable.
- Persistence sits behind a `DocumentRepository` interface: IndexedDB in the app, in-memory in
  tests.

### Block registry

- Each block in `src/blocks/<name>/` describes itself with `defineBlock()`:
  - its type and meta;
  - a Zod schema, defaults and a component;
  - its inspector **fields**.
- `FieldDef<Props>` is derived from the props type, so the compiler rejects:
  - a misspelled key;
  - a `list` control on a non-array prop;
  - a `toggle` control on a string.
- The editor only talks to `BlockRegistry`. It is provided in `app/providers`, the single place
  that knows the concrete blocks.
- `BlockRenderer` is an error boundary: an unknown or broken block shows a fallback instead of
  breaking the page.

### Responsive styles

- Block styles are stored as `{ desktop, tablet?, mobile? }`, where the overrides are partial.
- `styleToCssVars()` resolves the cascade into CSS variables.
- `page-theme.css` switches those variables with container queries.
- As a result, the canvas previews any device simply by resizing its frame, and the exported HTML
  stays responsive with zero JavaScript.

### Drag & drop

- A small pointer-events engine (`features/drag-drop`) works with mouse, pen and touch.
- It provides:
  - a drag threshold;
  - drop lists registered by id;
  - a drop indicator and a ghost;
  - autoscroll and Escape to cancel.
- Drop position math lives in pure, unit-tested functions.

### Design tokens

- The editor UI uses semantic tokens (`bg`, `surface`, `line`, `fg`, `accent`…) exposed to Tailwind
  via `@theme`. Dark mode swaps the variables, so components never need `dark:` variants.
- The landing pages have a separate `page-*` token set driven by the document theme.

## Deploy

The app is a static SPA: `npm run build` produces `dist/`.

- **GitHub Pages** (`.github/workflows/deploy.yml`): every push to `main` runs the checks, builds
  with the `/<repo-name>/` base path, adds a `404.html` SPA fallback and publishes the result.
  One-time setup: Settings → Pages → Source: **GitHub Actions**.
- **Vercel:** `vercel.json`.
- **Netlify / Cloudflare Pages:** `public/_redirects`.

Pull requests are checked by `.github/workflows/ci.yml`.

## Roadmap

- [x] **Stage 0** — infrastructure: routing, state, linting, tests, UI kit, dark mode
- [x] **Stage 1** — document model, block registry, rendering a page from JSON
- [x] **Stage 2** — editor layout: block library, canvas, schema-driven inspector
- [x] **Stage 3** — command pattern: undo/redo, hotkeys
- [x] **Stage 4** — drag & drop, layers panel
- [x] **Stage 5** — responsive preview via container queries, per-breakpoint overrides
- [x] **Stage 6** — page themes and design token editor
- [x] **Stage 7** — persistence (IndexedDB), JSON import/export, HTML export
- [x] **Stage 8** — templates, command palette, polish, deploy configs
