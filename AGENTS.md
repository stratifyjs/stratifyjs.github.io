# Working on the Stratify documentation

## Scope

These instructions apply to the entire documentation repository. Run commands
from `stratifyjs.github.io/`.

This is the VitePress site published at <https://stratifyjs.github.io/>. It
documents the public APIs of `@stratify/core` and `@stratify/cli`; it is not an
implementation repository. Prefer user-facing concepts, runnable examples, and
links to public APIs over descriptions of internal implementation details.

## Repository map

- `index.md`: home page. Its YAML frontmatter defines the hero, actions, and
  feature cards; content after the frontmatter is rendered below them.
- `docs/`: the product guides for installation, application setup, modules,
  providers, controllers, hooks, application testing, installers, adapters,
  and dependency inversion.
- `blog/index.md`: blog landing page and article cards.
- `blog/*.md`: individual posts. Posts use `title`, `description`, and `date`
  frontmatter.
- `.vitepress/config.ts`: site metadata, top navigation, and the explicitly
  ordered sidebar. A new guide is not discoverable until it is added here.
- `.vitepress/theme/index.ts`: extends the VitePress default theme and imports
  the active custom stylesheet.
- `.vitepress/theme/custom.css`: site-specific theme and component styles,
  including the blog cards.
- `public/`: static files copied to the built site without transformation.
- `assets/styles.css`: legacy standalone styles that are not currently imported
  by the VitePress theme. Do not edit it expecting a visible change unless it is
  deliberately wired into the site.
- `.github/workflows/deploy.yml`: GitHub Pages deployment. It installs and
  builds on Node.js 18 after pushes to `main`.
- `.vitepress/dist/` and `.vitepress/cache/`: generated output; never edit or
  commit these directories.

## Product and API accuracy

Documentation examples must describe the latest published package unless the
change explicitly documents an upcoming release. Verify names and signatures
against the package's public declaration entry point and release version. When
the adjacent `../core` checkout is available, `package.json`, `src/index.ts`,
and the folder `index.ts` barrels are useful references, but local changes may
not have been published yet. Make that distinction explicit when it matters.

Import only from public package entry points such as `@stratify/core`; never
teach users to import internal source paths. The long factory names and their
short aliases are both public:

- `createProvider` / `provider`
- `createModule` / `mod`
- `createHooks` / `hooks`
- `createController` / `controller`
- `createInstaller` / `installer`
- `createAdapter` / `adapter`

Use one naming style consistently within an example. Do not invent APIs to make
an example shorter. In particular, keep the documented architectural roles
clear:

- modules compose controllers, hooks, installers, and child modules;
- providers supply application dependencies;
- installers receive unrestricted Fastify access for configuration and plugin
  registration;
- adapters expose selected Fastify instance state to Stratify dependencies and
  must not be presented as a way to register plugins, routes, hooks, or error
  handlers;
- `createApp` is asynchronous, accepts a root module, and returns the ready
  Fastify instance with Stratify's public decorations.

Examples should be internally complete: import every external symbol, define or
clearly identify surrounding values such as `root`, and keep dependency names
consistent from declaration through use. Prefer `ts` fences when demonstrating
typing or inference, `js` only for intentionally plain JavaScript, and `bash`
for shell commands.

## Writing and linking conventions

- Write concise, task-oriented English in the present tense.
- Give each guide one `#` heading and organize it with descriptive `##` and
  `###` headings.
- Explain the user-visible rule before its code example, and call out important
  limitations close to the relevant example.
- Use Markdown for ordinary content. Use inline HTML only when VitePress layout
  or custom classes require it, as on the blog cards.
- Use site-root links such as `/docs/installation` in configuration and custom
  HTML. Within Markdown guide prose, use extensionless relative links such as
  `./providers` where practical.
- Link Fastify behavior to the relevant official Fastify reference page rather
  than duplicating its full documentation.
- Preserve VitePress's extensionless URL behavior (`cleanUrls: true`). Check
  heading fragments and internal paths whenever headings or files move.
- Avoid promotional claims that cannot be supported by the current packages.

## Adding and updating content

When adding a guide, create the Markdown page and add it to the appropriate,
ordered sidebar group in `.vitepress/config.ts`. Update cross-links from related
guides when that improves discovery.

When adding a blog post:

1. Add `title`, `description`, and an ISO `date` to its frontmatter.
2. Add its card to `blog/index.md` in newest-first order.
3. Add or replace the home-page card in `index.md` only when the post should be
   featured there.
4. Reuse the existing blog-card classes unless a genuinely new layout is
   required, and verify both light and dark themes when changing styles.

Keep dependency changes separate from content edits. Update `package-lock.json`
only when `package.json` dependencies intentionally change.

## Validation

Install dependencies when needed:

```sh
npm install
```

Use the development server for visual review:

```sh
npm run dev
```

Before handing off any change, run the production build:

```sh
npm run build
```

The build is the repository's required automated check and catches VitePress
configuration errors and broken internal links. There are currently no lint or
test scripts. For layout, navigation, or CSS changes, also inspect the site with
`npm run dev` or build it and use `npm run preview`; check desktop and narrow
viewports, light and dark themes, navigation, sidebar ordering, and code-block
overflow.

Finally, run `git diff --check` and review `git status --short`. Preserve
unrelated work in a dirty worktree, and do not commit generated output or
`node_modules/`.
