# Fish-N-Fish — static site

Plain HTML, CSS and one small JavaScript file. No build step, no framework, no
server-side code. Upload the contents of this folder to any web host and it works.

## What's here

```
index.html            Home
about.html            About & quality (company story + the five quality pillars)
products.html         The range, comparison table
products/*.html       One page per cut (5)
recipes.html          All eight recipes
recipes/*.html        One page per recipe (8)
trade.html            For trade + contact, regional numbers, enquiry form
404.html              Not-found page
robots.txt            Allows crawling, points at the sitemap
sitemap.xml           All 18 pages
assets/css/site.css   The whole stylesheet
assets/js/site.js     Scroll reveal, mobile menu, enquiry form
assets/img/           17 images
```

Total: about 2.7 MB, almost all of it photography.

## Deploying

Upload everything to your web root. Nothing else to configure.

- **Existing host (cPanel / FTP):** upload into `public_html`, replacing the old site.
- **Netlify / Cloudflare Pages / Vercel:** drag the folder onto the dashboard, or point it at a repo containing these files. No build command; publish directory is this folder.
- **S3 / static hosting:** enable static website hosting, index document `index.html`, error document `404.html`.

## Before it goes live

1. **The enquiry form does not send anything.** `trade.html` has a working form
   that currently just prints a confirmation. Wire it to whatever you use —
   Formspree, your own mail script, or a CRM endpoint — by giving the
   `<form id="enquiry">` an `action` and removing the `submit` handler at the
   bottom of `assets/js/site.js`. Until then it silently loses enquiries.

2. **Curry Cut Frozen has no pack artwork.** It reuses the chilled Curry Cut bag
   (`assets/img/pack-curry-cut.png`). Drop the real artwork in as
   `pack-curry-cut-frozen.png` and update the `<img src>` in `products.html`,
   `products/curry-cut-frozen.html` and `index.html`.

3. **Check the canonical domain.** Every page has
   `<link rel="canonical" href="https://fishnfish.com/...">` and `sitemap.xml`
   uses the same. If the site lives anywhere else, find and replace that domain.

## Colours

All colour lives in CSS variables at the top of `assets/css/site.css`, defined
three times: once for light, once inside the `prefers-color-scheme: dark` block,
and once under `[data-theme="dark"]`. Change a colour in all three or the two
themes drift apart.

The ones you are most likely to want to touch:

| Variable | Job | Light | Dark |
|---|---|---|---|
| `--shot-bg` | Backdrop behind pack photography | `#141A18` | `#1B2320` |
| `--band-bg` | The dark "for trade" band | `#121A15` | `#243128` |
| `--lime` | Brand accent, from the logo | `#A3C42B` | `#B8D840` |
| `--paper` | Page background | `#F3F6EF` | `#0A100C` |
| `--ink` | Body text | `#0F1A14` | `#E8EDE2` |

`--shot-bg` and `--band-bg` are deliberately separate even though both are dark.
The photography ground sits behind pack cut-outs; the band is a full-bleed section.
In dark mode the band is lifted further than the shot ground so it still reads as a
distinct section against the near-black page.

## Editing content

Everything is literal HTML — open the file and edit the text. The header nav and
footer repeat on every page, so a change there must be made in each file.

## Fonts

Futura, with Avenir Next, Century Gothic and Trebuchet MS as fallbacks. Futura is
present on Macs but not on Windows, where it falls back to Century Gothic. To make
it identical everywhere, licence one geometric sans, put the web font files in
`assets/fonts/`, add an `@font-face` block at the top of `assets/css/site.css`,
and change the `--display` and `--data` variables to name it first.

## Browser support

Modern browsers. Uses CSS grid, custom properties and `color-mix()`. If the
JavaScript fails to load the page still renders in full — the scroll animation
is an enhancement, not a requirement.
