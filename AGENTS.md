# AGENTS.md

Instructions for AI coding agents working on danpitrowiski.github.io, the portfolio of Daniel "DJP" Pitrowiski, Senior Product Designer.

## Project overview

- Static site on GitHub Pages: hand-written HTML, CSS and a little vanilla JS. No framework, no build step, no package manager.
- The design is a quiet, centered reading layout on warm "paper" with a subtle grain: a small masthead, a sticky contents rail on wide screens, large media, and sections separated by hairline rules. Keep that concept intact.
- Pushing to `master` publishes the site.

## Run locally

- Preview: `python3 -m http.server 8000` from the repo root, then open http://localhost:8000.
- There are no tests or linters. Check every page you touched in a browser at desktop width, at 640px and below, and in dark mode (the system setting).

## Pages in scope

These seven pages use the current design. Only change these unless asked.

| Page | File | Type |
|---|---|---|
| Homepage | `index.html` | Home |
| AI feedback analysis (Wootric CXInsights) | `resume-wootric.html` | Case study |
| Building trust in AI auto-tagging | `ai-auto-tagging.html` | Case study |
| Four projects @ Press Ganey | `resume-pg-forsta.html` | Case study |
| Enthuse | `enthuse.html` | Case study |
| What Makes a Great Designer Portfolio? | `article-great-designer-portfolio.html` | Article |
| Knight of the Living Dead | `knight.html` | Side project |

The file names are kept from the previous design so old links keep working. Don't rename them.

IMPORTANT: Don't edit, link to or copy from legacy files. These include:
- `*-old.html` and `OLD-*.html`
- `*-before-*.html` (including the `*-before-v3.html` copies of the previous design) and `_before-layout-trial/`
- `aboutme.html`, `contact.html`, `personal.html`, `wootric.html`, `Portfolio/`
- `css/style.css`, `css/style-new.css`, `css/case-study.css`, `css/style-new-backup-*.css`, `css/style-new-before-*.css`, `js/site.js`

`article-portfolio-rebuild.html` is hidden on purpose (it isn't linked from the homepage and the page is set to noindex). It still uses the previous design. Leave it hidden.

The "AI Active Listening in Surveys" card on the homepage is commented out until Daniel finishes that case study. Leave it hidden.

Never delete files. List what could be removed and let Daniel decide.

## Project structure

- `css/style-v3.css`: tokens, light and dark themes, paper texture, masthead, contents rail, homepage, case-study components, lightbox. Every in-scope page loads it.
- Page-only styles go in a `<style>` block in that page's `<head>` (the article, Knight, Press Ganey and Enthuse pages do this). Promote a style to `style-v3.css` once a second page needs it.
- `js/v3.js`: highlights the current section in the contents rail, runs the tag-set tabs (arrow keys move between tabs), and pauses looping videos for people who prefer reduced motion.
- `js/lightbox.js`: any `<img data-zoom>` opens larger on click. Use `data-zoom="path/to/large.jpg"` for a higher-res file.
- `images/v3/`: homepage card videos (`.mp4` with a `.jpg` poster), article and side-project thumbnails, and the AI auto-tagging media.
- `images/<page-or-topic>/`: one folder per page or topic, like `images/enthuse/` or `images/article-portfolios/top10/`. Name files in lowercase with hyphens.
- The resume is `Daniel Pitrowiski - Senior Product Designer.pdf`. Link it as `Daniel%20Pitrowiski%20-%20Senior%20Product%20Designer.pdf`.

## Design system

The Figma source of truth is "Portfolio Exploration": https://www.figma.com/design/6k6wMPzkgj9iZNEvjCWxmb (file key `6k6wMPzkgj9iZNEvjCWxmb`). It has the homepage and the CXInsights and AI auto-tagging case studies. "DJP Portfolio Design System" (`ktufBhtax26afwWneZ2kXf`) describes the previous design. Don't use it for the current pages.

### Tokens

IMPORTANT: Never hard-code colors. Use the CSS custom properties at the top of `css/style-v3.css`, which switch automatically for dark mode (`prefers-color-scheme`; there is no toggle).

| CSS | Use for |
|---|---|
| `var(--v3-paper)` | Page background (under the grain texture) |
| `var(--v3-card)` | Cards, frames and media backgrounds |
| `var(--v3-ink)` | Headings, emphasis, quote rules |
| `var(--v3-body)` | Body copy |
| `var(--v3-soft)` | Captions, kickers, meta lines, labels, the rail |
| `var(--v3-rule)` | Hairline rules, section dividers, borders |
| `var(--v3-link)` | Links and focus outlines. The only accent color. |
| `var(--v3-ship)`, `var(--v3-cut)` | Shipped and cut markers (`.mark--ship`, `.mark--cut`) only |

- Layout: homepage column 880px; case-study column 848px (800px of content); body text, lists and quotes up to 640px; the contents rail sits fixed at the left and hides below 1200px.
- Breakpoints: 1199px (the rail hides), 900px (tablet) and 640px (phone).
- Corner radius: 8px for images and frames, 12px for cards, fully round for chips and tabs.
- Respect `prefers-reduced-motion`. Keep transitions at about .15s.

### Typography

- **Figtree** is the only font, loaded with the Google Fonts `<link>` in each page's `<head>` (weights 400, 500, 600, 700). Don't add other families. Code listings use the system monospace font.
- h1 is 600 at 46px (52px with `.h1--short`); section h2 is 600 at 32px; h3 is 600 at 20px. Body copy is 18px / 1.6.
- Kickers and small labels are 500 at 12px, uppercase, letter-spacing .1em, in `--v3-soft`.

### Components

Reuse these before writing new CSS.

| Component | HTML / CSS | Used on |
|---|---|---|
| Masthead | `header.masthead` with `.wordmark` (home) or `header.masthead.masthead--case` with `.crumb` (other pages) | All pages |
| Contents rail | `nav.rail` (links to each section `id`) | All pages |
| Home intro, case cards | `.intro`, `ul.cases` > `a.case` (`video.media` + `.case-title`) | Home |
| Article and project rows | `ul.row-list` > `li.row` / `.row--links`, `.thumb`, `.row-title`, `.row-desc` | Home |
| Career timeline | `ol.timeline` | Home |
| Lead media, figures | `figure.lead-media`, `figure`, `.fig-narrow`, `.fig-plain`, `.figs-2`, `.fig-pair` | Case studies |
| Facts | `dl.facts` / `.facts--4` | Case studies, Knight |
| Stats | `.stats` / `.stats--3` with `.stat-num` and `.stat-cap` | Case studies, article |
| Section | `hr.divider` then `section.block` with `p.kicker` + `h2` | Case studies, article, Knight |
| Lists | `ul.items` / `.items--bullets` | Case studies, article |
| Decisions | `ul.decisions` with `.mark--ship` / `.mark--cut` | Case studies |
| Quotes | `blockquote.pull` (highlight) and `.pull--sm` (smaller, in a `.quote-stack`), with `<cite>` | Case studies |
| Rows | `ul.rows` with `.layer`, `.objective` or `.test-row` | Case studies |
| Tag set tabs | `.tagset` with `[data-tabs]`, `[role="tab"]`, `.tagset-list` | AI auto-tagging |
| Press list | `ul.press` | Case studies |
| Next case / page nav | `.next-card`, `nav.page-nav` | Case studies, article, Knight |
| Browser frame, tiers, data table, top 10 | `.browser`, `.tiers`, `.wikitable`, `.top10` (page `<style>`) | Article |
| Footer | `footer.site-footer` with the email link | All pages |

- Every quote uses the left-rule style. Only quote real people or customers, with the role or source in `<cite>`.
- Inline actions like "Read about it" are plain links. Knight has the only `.btn`.

### Page skeleton

New pages copy the `<head>` and structure of an existing in-scope page of the same type:

`header.masthead.masthead--case` → `nav.rail` → `main.cs` > (`figure.lead-media`, `h1`, `dl.facts`, `.stats`, then `hr.divider` + `section.block` for each section, then `.next-card` or `nav.page-nav`) → `footer.site-footer` → `js/lightbox.js` and `js/v3.js`.

Every page needs a unique `<title>` ("Page name · Daniel Pitrowiski"), a meta description and `og:` tags.

## Writing and copy

Daniel writes all the copy. Don't rewrite his text unless asked. When drafting new copy:

- IMPORTANT: Never invent metrics, dates, quotes, customer names or job details. If a fact is missing, leave `[TODO: …]` and ask.
- Case studies and articles are first person.
- Use short, plain sentences with specific numbers. Fragments are fine.
- No em dashes; the site uses none. Use periods, commas or parentheses.
- Avoid AI tells:
  - lists of three
  - sentences ending in an "-ing" clause ("…, enabling scalable experiences")
  - filler like "leverage", "seamless", "robust", "at scale", "close the loop", "evidence-driven insights"
- Keep facts consistent with the resume PDF (`Daniel Pitrowiski - Senior Product Designer.pdf`) and the other pages. Flag any conflict instead of choosing one.

## Links, images and accessibility

- External links open in a new tab: `target="_blank" rel="noopener"`. So do the masthead LinkedIn and Resume links. Internal links never do.
- Every content image needs `alt` text (decorative thumbnails use `alt=""`). Add `loading="lazy"` below the fold, and `data-zoom` for screenshots worth enlarging.
- Looping media is an `.mp4` with a `poster` image (`autoplay muted loop playsinline`), not a GIF.
- Keep heading levels in order, keep the `aria-*` attributes on the rail and tabs, and keep the visible `:focus-visible` outline.

## Working from Figma (Figma MCP)

When implementing a Figma frame:
1. Call `get_design_context` for the node, then `get_screenshot` for visual reference.
2. Treat the output as a reference, not code to paste. Map it to the components and tokens above.
3. Use the CSS token (`var(--v3-link)`), never the hex value shown in Figma.
4. If the design needs something not covered here, ask first. Don't invent a new token or component.
5. Compare the result side by side with the screenshot before finishing.

## Before you finish

- [ ] Checked at desktop, 640px and dark mode with no layout breaks or horizontal scroll
- [ ] No hard-coded colors and no fonts besides Figtree
- [ ] Rail links match the page's section `id`s
- [ ] New images are added to git (they're often untracked): `git add images/…`
- [ ] Summarized what changed and listed any `[TODO]`s

## Git

- Don't commit or push unless the user confirms. Use short, plain commit messages in the style of `git log`.
- NEVER force-push or rewrite history.
