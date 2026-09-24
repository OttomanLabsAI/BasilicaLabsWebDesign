# Built by Fid

The sales site for Built by Fid, Fadil Karim's design studio, part of
BasilicaLabs.AI (earlier BasilicaLabs Web Design, then FKarim Web Design): new websites and
rebuilds, designed, built and live on a temporary link the same day. One page
that makes the case and takes the brief, plus a themed 404.

It is a Cloudflare Workers static-assets site. There is no build step: the files
in `public/` are the site.

## Structure

```
public/
  index.html              the sales page: hero, work, process, what you get,
                          how it's done, comparison, ownership, referrals,
                          and the brief form
  404.html                themed not-found page (root-absolute paths)
                          both pages end with the fixed contact bar:
                          call, email and Instagram, always on screen
  favicon.ico
  robots.txt
  _headers                security + caching headers
  _redirects              v1's /contact paths → the brief form
  assets/
    css/site.css          the whole design system
    js/site.js            header state, showcase carousel, scroll reveals,
                          the brief form
    fonts/                Flux, Instrument Sans, Instrument Serif (upright and italic)
    img/work/             portfolio screenshots, WebP at 800 and 1400 wide
    img/social-thumbnail-v2.9.jpg   link-preview thumbnail, 1200 × 630
    img/social-square-v2.9.jpg      square post for Instagram, 1080 × 1080
    img/favicon-v2.8.svg, img/apple-touch-icon-v2.8.png   the "F." mark
social/                   sources for the social images (not served)
brand/                    the square logo as SVG and PNG, and the script
                          that draws it (not served)
wrangler.jsonc            assets-only config, no Worker script
package.json              wrangler devDependency + dev/deploy/check scripts
```

## Local development

```bash
npm install
npm run dev          # wrangler dev, with _headers and _redirects applied
npm run check        # wrangler deploy --dry-run
```

Any static server pointed at `public/` also works, minus the redirects.

## Deployment

The repository is connected to Cloudflare Workers Builds, which deploys every
push to `main`. The Worker's name in the dashboard must match `name` in
`wrangler.jsonc` (`basilicalabswebdesign`). Add the custom domain under the
Worker's Settings → Domains & Routes.

## Design

- **Type.** Flux, the BasilicaLabs.AI brand face, sets the wordmark and every
  heading. It has one weight (500), so nothing is ever set bold in it.
  Instrument Serif sets "Design Studio", centred and upright under the wordmark,
  and in italic one accent phrase per heading. Instrument Sans sets everything
  else. All three are
  self-hosted; Instrument Sans and Serif are SIL Open Font License.
- **Colour.** Ink `#111114`, paper `#F6F3EC`, a second paper `#ECE7DC` for
  alternate bands, and one emerald accent: `#10B981` for fills, `#2DD4A0` for
  text on ink, `#036144` for text on paper, with ink text on emerald fills.
  The accent lives in five tokens at the top of `site.css`, so a recolour is a
  few-line change. Every text pairing meets WCAG AA.
- **Motion.** A crossfading showcase of the five sites, a flowing lane
  diagram and scroll reveals. All of it stops under
  `prefers-reduced-motion`, and with no script every section is visible.

## Content rules

- No pricing anywhere on the site: no amounts, quotes, fees or cost
  comparisons. Prices are discussed one to one. The one exception, at the
  owner's request: hosting is free on Cloudflare, forever.
- Client-facing wording follows the owner's the-sell vocabulary: agreement not
  contract, premium not expensive, opportunity not options, investment not
  cost.
- Every claim comes from the service as the owner describes it. No invented
  testimonials, figures or clients.
- Each point is made once. The hero states the promise and each section below
  adds something new; no section restates another, and there is no FAQ for
  that reason.
- No long dashes (— or –) in anything a visitor reads, titles and
  screen-reader labels included. A full stop, comma or colon does the job.

## Contact details on the page

Phone +44 7713 563722, email fid_kk@proton.me, and Instagram @BasilicaLabs.AI
(formerly @ottomanlabs.ai) and @fid_900 — beside the brief form and in the
footer. Call, email and @BasilicaLabs.AI also sit in the contact bar fixed to
the bottom of every page.

## Social images

- **Link-preview thumbnail** (`public/assets/img/social-thumbnail-v2.9.jpg`,
  1200 × 630) — what social sites and messaging apps show when the link is
  shared. The name, the logo and the promise sit in the centre 600 px, so apps
  that crop previews to a square, such as WhatsApp, still show them.
- **Square post** (`public/assets/img/social-square-v2.9.jpg`, 1080 × 1080) —
  for Instagram and other feeds.

Both are rendered from the HTML in `social/`, which uses the site's own fonts
and screenshots. To change one, edit the HTML, serve the repository root so the
fonts load, and screenshot at the exact size — for example:

```bash
python3 -m http.server 8000
npx playwright screenshot --viewport-size="1200, 630" \
  http://localhost:8000/social/thumbnail.html thumbnail.png
```

Save the result under a new file name (the images are cached as immutable) and
point `og:image` and `twitter:image` at it.

## Square logo

`brand/logo-square.svg` and `brand/logo-square.png` (1080 × 1080) are the logo
for profile pictures and anywhere else a square mark is needed. The layout is
the basilicalabs.ai square logo's, at its proportions: the three sparkle stars
in emerald over "Built by Fid" in white, with "Design Studio" centred underneath
in Instrument Serif, on the site's near-black. Everything sits within three
quarters of the circle's radius, so a round crop keeps the whole logo.

The SVG's lettering is converted to outlines, so it looks the same on any
computer without the fonts installed. `brand/make_logo.py` draws it from the
site's own fonts; to change the logo, edit the script, then redraw the SVG and
export the PNG from it:

```bash
pip install uharfbuzz fonttools brotli
python3 brand/make_logo.py brand/logo-square.svg
npx playwright screenshot --viewport-size="1080, 1080" \
  "file://$PWD/brand/logo-square.svg" brand/logo-square.png
```

## External resources

- **Brief form.** Posts to `https://formsubmit.co/ajax/fid_kk@proton.me`. If the
  service is blocked, refuses the brief or still needs its one-time
  confirmation, the visitor's email app opens with the brief filled in. After
  the domain goes live, send one test brief and click FormSubmit's activation
  link in the inbox.
- **Share image.** `og:image` points at `public/assets/img/social-thumbnail-v2.9.jpg` in this
  repository through jsDelivr's GitHub CDN, because link previews need an
  absolute address and the site has no domain yet.
- **Links out.** The five portfolio sites, basilicalabs.ai, GitHub, YouTube,
  LinkedIn, Instagram and Telegram.

## Recent work

Five sites, each shown in the hero's crossfading showcase, as a link in the
"Recent builds" strip under it, and as a card under Recent work. The newest,
the Dynamic Connectome Lab, leads the cards across both columns. It is a live
preview made for the lab from its Google Site, not a commissioned build, and
its card says so. To add a site, screenshot its homepage at 1400 × 735, save
it as WebP at 1400 and 800 wide in `assets/img/work/`, and add it in all three
places; the showcase script picks up any number of slides.

## When the domain is chosen

In the `<head>` of `index.html`:

```html
<link rel="canonical" href="https://<domain>/">
<meta property="og:url" content="https://<domain>/">
```

Point `og:image` and `twitter:image` at `https://<domain>/assets/img/social-thumbnail-v2.9.jpg`,
and add a `Sitemap:` line to `robots.txt` if a sitemap is added.
