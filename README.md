# BasilicaLabs.AI — Website Design

The dedicated site for the BasilicaLabs.AI web design service: new builds from
scratch, or an existing site rebuilt properly. It carries everything on
[basilicalabs.ai/website-design](https://basilicalabs.ai/website-design) — how it
works, the build, the price, ownership, referrals and the portfolio — in the
same design as basilicalabs.ai.

It is a Cloudflare Workers static-assets site. There is no build step: the files
in `public/` are the site.

## Structure

```
public/
  index.html               the service page (home)
  contact.html             the enquiry form and direct email
  404.html                 themed not-found page (root-absolute paths)
  favicon.ico
  robots.txt
  _headers                 security + caching headers
  assets/
    styles.css             the basilicalabs.ai design system, byte-identical copy
    css/fonts.css          self-hosted Afacad Flux, Newsreader and Prata
    css/website-design.css the service page's own styles, moved out verbatim
    css/contact.css        the contact page's own styles, moved out verbatim
    js/theme-preload.js    restores a saved dark theme before first paint
    js/site.js             the light/dark toggle
    js/contact.js          the contact form: FormSubmit, falling back to email
    fonts/                 Flux plus the Google Fonts files, self-hosted
    og/                    portfolio screenshots
    favicon.svg, favicon-180.png
wrangler.jsonc             assets-only config, no Worker script
package.json               wrangler devDependency + dev/deploy/check scripts
```

## Local development

```bash
npm install
npm run dev          # wrangler dev, serves public/ with _headers applied
npm run check        # wrangler deploy --dry-run
```

Any static server pointed at `public/` also works.

## Deployment

Connect the repository once in the Cloudflare dashboard: Workers & Pages →
Create → Import a repository. From then on Workers Builds deploys every push to
`main`. Add the custom domain under the Worker's Settings → Domains & Routes.

## The design comes from basilicalabs.ai

- `public/assets/styles.css` is a byte-identical copy of `assets/styles.css`
  from the basilicalabs.ai repository (OttomanLabsAI/OttomanLabs.AI). To pick up
  a change there, copy the file over unchanged.
- `website-design.css` and `contact.css` are the inline `<style>` blocks of
  `website-design.html` and `contact.html` in that repository, moved out
  verbatim.
- The typefaces are the same files basilicalabs.ai loads: Flux is its own
  embedded font, and Afacad Flux, Newsreader and Prata are the exact Google
  Fonts files, self-hosted with the same weights and unicode ranges. The pages
  make no third-party requests to render. All three Google families are under
  the SIL Open Font License.

## External resources

- **Share image.** `og:image` points at
  `https://basilicalabs.ai/assets/og/og-website-design.png`, the card
  basilicalabs.ai already serves for this page. Keep that file on
  basilicalabs.ai, or copy it into `public/assets/og/` and point the tag at
  this site's own domain once it has one.
- **Contact form.** Messages post to `https://formsubmit.co/ajax/fid_kk@proton.me`,
  the same service the basilicalabs.ai contact page uses. If it is blocked or
  refuses a message, the visitor's mail app opens with the message filled in.
  FormSubmit may ask the inbox to confirm the form once for a new domain: send
  one test message after the domain goes live and click the activation link.
- **Links out.** The four portfolio sites, basilicalabs.ai, the CV on
  basilicalabs.ai, GitHub, YouTube, LinkedIn, Instagram and Telegram.

## When the domain is chosen

Add to the `<head>` of `index.html` and `contact.html`:

```html
<link rel="canonical" href="https://<domain>/">
<meta property="og:url" content="https://<domain>/">
```

and a `Sitemap:` line to `public/robots.txt` if a sitemap is added.
