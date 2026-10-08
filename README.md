# JS Ng's site

Personal blog, built with Jekyll and the [monophase](https://github.com/neizod/monophase) theme, deployed to GitHub Pages on every push to `main`.

## Writing posts

A local **drafting studio** is included — a small web UI for drafting posts without touching frontmatter or filenames by hand:

```bash
bin/draft
```

Then open <http://127.0.0.1:4040>. The script also starts `jekyll serve --drafts --livereload` on <http://127.0.0.1:4000> (reusing it if already running); Ctrl+C stops both.

What it gives you:

- **New draft** — generates the date-stamped filename, slug, and permalink from the title; tags autocomplete from existing posts.
- **Rich (WYSIWYG) and Source (markdown) editors** — autosaved to `_drafts/` as you type. Prefer Source mode for posts with unusual markdown (e.g. long underscore runs), which the WYSIWYG round-trip may re-escape.
- **Split preview** — the right pane is your real site, rendered by `jekyll serve --drafts`; scrolling is synchronised between editor and preview.
- **Images** — drag/paste/pick an image and it is downscaled, saved to `images/<date>/`, and inserted with the right path.
- **Publish** — moves the draft into `_posts/` (date-stamping the filename), then creates a `draft/<slug>` branch, commits, pushes, and opens a PR via `gh`.

Drafts are never deployed: CI builds without `--drafts`, so a post goes live only when its PR merges to `main`.

## Notes

- Requires Ruby/bundler (the site's existing toolchain), Node only if you rebuild the editor bundles, and the `gh` CLI for the PR step.
- `_studio/` and `bin/` are excluded from the published site in `_config.yml`.
- To rebuild the editor bundles after changing `_studio/editor-src/`: `cd _studio/editor-src && npm install && npm run build`.

## Manual publishing

Without the studio, posts are markdown files in `_posts/` following the existing `YYYY-MM-DD-slug.md` naming and frontmatter convention (`title`, `tags`, `layout: post`, `date`, `description`, `permalink`). Preview locally with `bundle exec jekyll serve`.
