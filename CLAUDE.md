# CLAUDE.md

Standing policy for this repository. Read it before making any change here.

## What this repo is

The dedicated site for the BasilicaLabs.AI web design service, built from
basilicalabs.ai/website-design and kept in the same design as basilicalabs.ai.
A Cloudflare Workers static-assets site: everything served lives in `public/`
and there is no build step - the files in that directory are the site. The repo
is connected to Cloudflare Workers Builds, so **every push to `main` deploys to
production**.

```
public/            everything served
  index.html       the service page
  contact.html     enquiry form + direct email
  404.html         themed not-found page
  assets/          styles.css, css/, js/, fonts/, og/, favicons
  _headers         security + caching headers
  robots.txt
wrangler.jsonc     assets-only config, no Worker script
package.json       wrangler devDependency + dev/deploy/check scripts
```

## Local development

```bash
npm install
npm run dev          # wrangler dev
```

## Verification - before every push to main

1. `npx wrangler deploy --dry-run`
2. Serve `public/`, render it with headless Chromium, and inspect the
   screenshots: styles applied, fonts loaded, layout intact. Take phone-width
   shots with Playwright (`setViewportSize`): Chrome's command-line
   `--screenshot` mode will not lay a page out narrower than 500px.
3. Sweep 320px to 1920px for horizontal overflow. The skip link sits off-screen
   to the left on purpose.

Never leave pushed work unverified or half-finished. Work in small, complete
batches: implement, verify, commit, push.

## The design is basilicalabs.ai's

- `public/assets/styles.css` is a byte-identical copy of the basilicalabs.ai
  stylesheet (OttomanLabsAI/OttomanLabs.AI, `assets/styles.css`). Never edit it
  here: sync it by copying the parent file over unchanged. Put page-specific
  rules in `assets/css/`.
- `assets/css/website-design.css` and `assets/css/contact.css` are the parent
  pages' inline style blocks, moved out verbatim.
- Fonts are self-hosted copies of what the parent loads from Google Fonts, same
  files, weights and unicode ranges. Do not add a Google Fonts `<link>`.
- Copy on the pages is the owner's, carried from basilicalabs.ai/website-design.
  Do not rewrite it, tidy markup, rename classes or modernise CSS unless asked -
  changes to content or design are their own release, requested deliberately.
- `404.html` is served at any depth, so every path in it is root-absolute.
- In `_headers`, give each path exactly one `Cache-Control` rule: Cloudflare
  joins the values of overlapping rules. Fonts and images are cached as
  immutable, so a changed font or image needs a new file name.

## Git and release workflow

- Before committing: `git config user.name "Fid" && git config user.email "fid_kk@proton.me"`
- Develop on the working branch and push there first. Release verified work by
  fast-forwarding `main` onto it and pushing `main`.
- Every push to `main` is a release. Versions are an ascending `vMAJOR.MINOR`
  sequence starting at `v1.0`; every push bumps the minor regardless of size. A
  major bump is reserved for a ground-up overhaul.
- With every push to `main`, provide release-tag text in the reply, in exactly
  this shape. The owner creates the GitHub release manually - **never push tags**:

  ```
  Tag: v<next>  —  Title: <five to nine words, plain and evocative>
  Description: <one to three sentences of editorial prose describing what changed
  from the owner's point of view — outcomes, not implementation. No bullet lists,
  no jargon, no file names.>
  ```

- Append the release line to the ledger below as part of the same push.
- Commit messages: descriptive imperative first line (what the change does, not
  "update X"), then a short prose body; dash bullets are fine there. One commit
  per coherent piece of work; several may share a push, but each push gets
  exactly one version entry.
- Never include model names, AI attribution trailers, session links, or other
  tooling identifiers in commit messages, titles, or code.

## Release ledger

| Version | Title | Description |
| --- | --- | --- |
| v1.0 | Website Design gets a home of its own | The web design service now has its own site, carrying everything from the basilicalabs.ai page — how it works, the build, the price, ownership, referrals and the four sites — in the same black-on-white design with the yellow flyer panels, in light and dark. Enquiries get their own contact page that sends straight to the inbox, and the typefaces load from the site itself, so it looks right everywhere without calling out to Google. |
