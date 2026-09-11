# Luvis Joston J — portfolio

A React + TypeScript portfolio for DevOps, cloud infrastructure, and platform engineering.

## Development

- `npm ci` — install dependencies.
- `npm run dev` — start the Vite development server.
- `npm run build` — type-check and build into `dist/`.
- `npm run preview` — preview the production build.

Deploy `dist/` to a static host with an SPA fallback to `index.html`. The existing `public/_redirects` provides that fallback for hosts supporting Netlify-style redirects. Other hosts need their equivalent rewrite for project and article deep links.

## Content

- `src/data/work.ts`: featured case studies, project archive, and capabilities.
- `src/data/portfolio.ts`: existing profile and contact information.
- `src/data/blogPosts.ts`: existing technical articles.
- `src/index.css`: design tokens and responsive styles.
- `docs/portfolio-review.md`: repository review, content choices, and online references.

The homepage introduces the engineer, shows three selected case studies, and links to expertise, writing, and contact. The work page includes 18 searchable/filterable additional projects. Project and article links support deep linking, browser history, and opening in new tabs.

Featured routes:
- `/projects/hetzner-gitops-platform`
- `/projects/kubernetes-sre-platform`
- `/projects/aws-eks-foundation`

## Design and accessibility

The visual system defaults to bright, friendly surfaces with electric-blue, teal, coral, and colorful technology logos. A header toggle switches to a dark graphite mode and persists the choice in local storage. Architecture illustrations are lightweight local SVG elements. The Build / Ship / Observe control explains the engineering workflow; it is illustrative, not a live cluster dashboard.

Navigation uses real links, the mobile menu exposes its expanded state and supports Escape, and the site includes visible keyboard focus, a skip link, reduced-motion support, semantic headings, and clipboard feedback with a failure fallback.

The previous loading screen and automatic typewriter/marquee effects are no longer mounted. Manrope, Space Grotesk, and IBM Plex Mono load from Google Fonts with system fallbacks. No extra runtime dependencies were added.

## Content boundaries

The Hetzner case study distinguishes Luvis’s contributions from the shared platform architecture. It uses a contact link rather than advertising access to the team repository. No operational endpoints, credentials, internal user details, uptime guarantees, or invented impact metrics are included.

Project summaries describe the checked-in implementation and its limitations. GKE is explicitly marked as configuration that has not been deployed. Existing articles are preserved; review their historical claims before using them as current operational documentation.

Titles and descriptions update per route in the browser. Social crawlers that do not execute JavaScript receive the shared metadata from `index.html`; per-route social previews would require prerendering or server rendering.
