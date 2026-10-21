# AGENTS.md

Instructions for AI coding agents working on danpitrowiski.github.io, the portfolio of Daniel "DJP" Pitrowiski, Senior Product Designer.

## Project overview

- Static site on GitHub Pages: hand-written HTML, CSS and a little vanilla JS. No framework, no build step, no package manager.
- The design is a Wikipedia-style article: masthead, sticky Contents sidebar, infobox, citations, references and "External links". Keep that concept intact.
- Pushing to `master` publishes the site.

## Run locally

- Preview: `python3 -m http.server 8000` from the repo root, then open http://localhost:8000.
- There are no tests or linters. Check every page you touched in a browser at desktop width, at 640px and below, and in dark mode (the system setting).

## Pages in scope

These six pages use the current design. Only change these unless asked.

| Page | File | Type |
|---|---|---|
| Homepage | `index.html` | Home |
| Press Ganey Forsta | `resume-pg-forsta.html` | Case study |
| Wootric CXInsights | `resume-wootric.html` | Case study |
| Enthuse | `enthuse.html` | Case study |
| What Makes a Great Designer Portfolio? | `article-great-designer-portfolio.html` | Article |
| Knight of the Living Dead | `knight.html` | Project |

IMPORTANT: Don't edit, link to or copy from legacy files. These include:
- `*-old.html` and `OLD-*.html`
- `*-before-*.html` and `_before-layout-trial/`
- `aboutme.html`, `contact.html`, `personal.html`, `wootric.html`, `Portfolio/`
- `css/style.css`, `css/style-new-backup-*.css`, `css/style-new-before-*.css`

`article-portfolio-rebuild.html` is hidden on purpose (its homepage card is commented out and the page is set to noindex). Leave it hidden.

Never delete files. List what could be removed and let Daniel decide.

## Project structure

- `css/style-new.css`: tokens, light and dark themes, masthead, shell, TOC, infobox, homepage components. Every page loads it.
- `css/case-study.css`: stats, pull quotes, testimonials, figures and other long-form components. Every in-scope page loads it.
- Page-only styles go in a `<style>` block in that page's `<head>` (the article, Knight and Press Ganey pages do this). Promote a style to a shared CSS file once a second page needs it.
- `js/site.js`: shows the TOC home link once the masthead scrolls away, and moves the infobox under the title on phones.
- `js/lightbox.js`: any `<img data-zoom>` opens larger on click. Use `data-zoom="path/to/large.jpg"` for a higher-res file.
- `images/<page-or-topic>/`: one folder per page or topic, like `images/enthuse/` or `images/article-portfolios/top10/`. Name files in lowercase with hyphens.

## Design system

The Figma source of truth is "DJP Portfolio Design System": https://www.figma.com/design/ktufBhtax26afwWneZ2kXf (file key `ktufBhtax26afwWneZ2kXf`). Every component and variable there has a description with usage rules and the pages that use it. Read those before building UI.

### Tokens

IMPORTANT: Never hard-code colors. Use the CSS custom properties in `css/style-new.css`, which switch automatically for dark mode.

| Figma variable | CSS | Use for |
|---|---|---|
| color/bg/page | `var(--paper)` | Page and card backgrounds |
| color/bg/panel | `var(--panel)` | Infobox, testimonials, placeholders |
| color/text/primary | `var(--ink)` | Headings and body copy |
| color/text/secondary | `var(--ink-soft)` | Captions, meta lines, labels |
| color/border/default | `var(--rule)` | Hairline rules and borders |
| color/link/default | `var(--link)` | Links, the active TOC item, hover. The only accent color. |
| color/status/* | `var(--detractor)`, `var(--passive)`, `var(--promoter)` | NPS meaning only. Not generic red, yellow or green. |

- Spacing comes from this scale: 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 48, 64px.
- Corner radius: 3px by default (buttons, chips), 4px for tabs, 8px for large frames. Most surfaces are square.
- Layout: content max 1180px; TOC column 200px with a 48px gap; infobox 300px; body text up to 68ch.
- Breakpoints: 900px (the TOC stacks above the article) and 640px (phone).
- Respect `prefers-reduced-motion`. Keep transitions at about .15s.

### Typography

Load fonts with the existing Google Fonts `<link>` in each page's `<head>`. Don't add new font families.

- **Libre Caslon Text** for display: h1, h2, the `.lead` and `.dek`, card titles, stat numbers, pull quotes.
- **IBM Plex Sans** for body text (16px / 1.65) and UI. h3 is Plex 600.
- **IBM Plex Mono** for small uppercase labels (letter-spacing about .1em), meta lines, chips and code.
- Use sentence case for headings, like "Side projects", not "Side Projects".

### Components

Reuse these before writing new CSS. The Figma name matches the component in the design file.

| Figma component | HTML / CSS | Used on |
|---|---|---|
| Masthead | `header.masthead`, `.wordmark` | All pages (identical on each) |
| TOC, TOC Item | `aside.toc`, `a.active` | All pages |
| Section Heading | `.article h2` (needs an `id` and a matching TOC item) | All pages |
| Infobox | `aside.infobox` | Home, case studies, Knight |
| Tab | `.tabs` / `.tab[aria-selected]` | Home |
| Case Card | `a.case` in `.cases` | Home |
| Project Row | `li.project` in `.projects-list` | Home |
| Toolkit Chip | `.stack li` | Home |
| NPS Scale Button, Status Chip, Button | `.scale button`, `.chip`, `.btn` | Home (Feedback tab); `.btn` also on Knight |
| Stats Row, Stat Tile | `.stats` / `.stat` | Case studies, article |
| Pull Quote | `blockquote.pull` with `<cite>` | Wootric, Enthuse |
| Testimonial | `figure.testimonial` in `.testimonials` | Wootric |
| Browser Frame, Tier Chip | `.browser`, `.tiers` (inline styles) | Article |
| Next Case Nav | `nav.next-case` | Case studies, article, Knight |

- One `.btn` per section. Inline actions like "Read the case study →" are plain links.
- Only quote real people in Pull Quote and Testimonial, with name, role and source.

### Page skeleton

New pages copy the `<head>` and structure of an existing in-scope page of the same type:

`header.masthead` → `div.shell` > (`aside.toc` + `main.article` > `.title-row` h1, `.meta-line`, `.dek`, content, `nav.next-case`) → `footer.site` → `js/lightbox.js` and `js/site.js`.

Every page needs a unique `<title>` ("Page name · Daniel Pitrowiski"), a meta description and `og:` tags.

## Writing and copy

Daniel writes all the copy. Don't rewrite his text unless asked. When drafting new copy:

- IMPORTANT: Never invent metrics, dates, quotes, customer names or job details. If a fact is missing, leave `[TODO: …]` and ask.
- The homepage bio is third person in encyclopedia style ("Pitrowiski led…"), using the surname consistently. Case studies and articles are first person.
- Use short, plain sentences with specific numbers. Fragments are fine.
- No em dashes; the site uses none. Use periods, commas or parentheses.
- Avoid AI tells:
  - lists of three
  - sentences ending in an "-ing" clause ("…, enabling scalable experiences")
  - filler like "leverage", "seamless", "robust", "at scale", "close the loop", "evidence-driven insights"
- Keep facts consistent with the resume PDF (`Daniel-Pitrowiski-Resume.pdf`) and the other pages. Flag any conflict instead of choosing one.

## Links, images and accessibility

- In articles, external links open in a new tab: `target="_blank" rel="noopener"`. Internal links never do.
- Every content image needs `alt` text (decorative thumbnails use `alt=""`). Add `loading="lazy"` below the fold, and `data-zoom` for screenshots worth enlarging.
- Keep heading levels in order, keep the `aria-*` attributes on tabs, the TOC and the NPS scale, and keep the visible `:focus-visible` outline.

## Working from Figma (Figma MCP)

When implementing a Figma frame:
1. Call `get_design_context` for the node, then `get_screenshot` for visual reference.
2. Treat the output as a reference, not code to paste. Map it to the components and tokens above.
3. Use the variable's CSS name (`var(--link)`), never the hex value shown in Figma.
4. If the design needs something not covered here, ask first. Don't invent a new token or component.
5. Compare the result side by side with the screenshot before finishing.

## Before you finish

- [ ] Checked at desktop, 640px and dark mode with no layout breaks or horizontal scroll
- [ ] No hard-coded colors and no new fonts
- [ ] TOC items match the page's h2 `id`s
- [ ] New images are added to git (they're often untracked): `git add images/…`
- [ ] Summarized what changed and listed any `[TODO]`s

## Git

- Commit or push only when Daniel asks. Use short, plain commit messages in the style of `git log`.
- Never force-push or rewrite history.
