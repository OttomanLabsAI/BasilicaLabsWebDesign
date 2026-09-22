# CLAUDE.md

Standing policy for this repository. Read it before making any change here.

## What this repo is

The sales site for BasilicaLabs Web Design, the web design service of
BasilicaLabs.AI. Version 2 is an original design, built from scratch to sell the
service; it no longer copies basilicalabs.ai. A Cloudflare Workers static-assets
site: everything served lives in `public/` and there is no build step - the
files in that directory are the site. The repo is connected to Cloudflare
Workers Builds, so **every push to `main` deploys to production**.

```
public/            everything served
  index.html       the sales page, including the brief form
  404.html         themed not-found page
  assets/          css/site.css, js/site.js, fonts/, img/
  _headers         security + caching headers
  _redirects       v1's /contact paths → /#start
  robots.txt
wrangler.jsonc     assets-only config, no Worker script
package.json       wrangler devDependency + dev/deploy/check scripts
```

## Local development

```bash
npm install
npm run dev          # wrangler dev, applies _headers and _redirects
```

## Verification - before every push to main

1. `npx wrangler deploy --dry-run`
2. Serve `public/`, render it with headless Chromium, and inspect the
   screenshots: styles applied, fonts loaded, layout intact. Take phone-width
   shots with Playwright (`setViewportSize`): Chrome's command-line
   `--screenshot` mode will not lay a page out narrower than 500px. Scroll
   through before a full-page shot, or emulate reduced motion, so the scroll
   reveals and lazy images are in place.
3. Sweep 320px to 1920px for horizontal overflow.
4. Run the the-sell checker over every word a visitor can read, and confirm no
   pricing wording has crept in.
5. Exercise the brief form: empty submit, success, and the email fallback.

Never leave pushed work unverified or half-finished. Work in small, complete
batches: implement, verify, commit, push.

## Copy rules

- **No pricing on the site.** No amounts, quotes, fees, "free" offers or cost
  comparisons - the owner discusses prices one to one.
- **The-sell vocabulary** for every word a visitor reads: agreement not
  contract, premium not expensive, opportunity not options, investment not
  cost, short numbers when a number is needed.
- **Only the owner's claims.** Same-day first design, live on a temporary link;
  changes in hours; ownership only if the client wants it; an optional
  fortnight of unlimited changes; code, hosting and setup handed over; AI
  agents in parallel, finished by hand; a cash thank-you for referrals; the
  four portfolio sites. No invented testimonials, figures or clients.

## Design system

- **Name and logo.** The site is "BasilicaLabs Web Design". The lockup is
  "BasilicaLabs" in Flux with "Web Design" underneath in Instrument Serif
  italic, in orange.
- **Type.** Flux (one weight, 500) for the wordmark and headings; never bold it
  - `font-synthesis:none` is set. Instrument Serif italic for one accent phrase
  per heading (`<em>` inside `h1`/`h2`). Instrument Sans for everything else.
  All self-hosted from `assets/fonts/`; no third-party font requests.
- **Colour.** Tokens live in `:root` of `site.css`: ink `#111114`, paper
  `#F6F3EC`, paper-2 `#ECE7DC`, orange `#FF5B24` for fills and text on ink,
  `#C2410C` for orange text on paper. Keep every text pairing at WCAG AA.
- **Motion** stops entirely under `prefers-reduced-motion`, and the page must
  work with no script at all.
- `404.html` is served at any depth, so every path in it is root-absolute.
- In `_headers`, give each path exactly one `Cache-Control` rule: Cloudflare
  joins the values of overlapping rules. Fonts and images are cached as
  immutable, so a changed font or image needs a new file name.
- The share image is referenced through jsDelivr's GitHub CDN until the site
  has a domain; then point `og:image` at the domain and add `canonical` and
  `og:url`.

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
| v2.0 | A fresh design built to win new clients | The site is redesigned from the ground up as a sales page for the web design service, under the name BasilicaLabs Web Design and set in Flux, with the promise of a new website, live today, front and centre. Visitors see four recent sites, how a one-line brief becomes a live site the same day, and what they own at the end, then send their brief from a form on the same page. Prices stay off the page, so every conversation about money starts with you. |
