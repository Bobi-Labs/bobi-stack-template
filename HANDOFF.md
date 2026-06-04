# HANDOFF — Deploy "Bar do Bobi" cocktail menu to a subdomain

**Goal:** publish `bar-do-bobi.html` as a static page at a subdomain of `bobilabs.dev`
(suggested: **`bar.bobilabs.dev`** — swap for `cocktails.bobilabs.dev` if preferred).

**The artifact:** one fully self-contained HTML file. No build step, no framework, no
dependencies to install. The *only* external request is the Google Fonts `<link>` in
`<head>` (Fraunces + Spectral). All CSS, JS, data and SVG art are inline. It uses
`localStorage` (key `bobi_tried_v2`) for the "Tried it" tracker, wrapped in try/catch so
it degrades gracefully if storage is unavailable.

---

## Prompt to paste into Claude Code

> Deploy the static file `bar-do-bobi.html` (in this repo) to the subdomain
> `bar.bobilabs.dev`, reusing whatever host `bobilabs.dev` already runs on. First detect
> the current host (Step 1 below), then follow the matching deploy path. Serve the file as
> `index.html` at the subdomain root over HTTPS. Don't modify the file's contents except
> to rename it to `index.html`. When done, give me the live URL and the DNS record you added.

---

## Step 1 — Detect where bobilabs.dev is hosted

Run these and infer the host before choosing a path:

```bash
dig +short bobilabs.dev
dig +short www.bobilabs.dev CNAME
curl -sI https://bobilabs.dev | grep -iE 'server|x-vercel|x-served-by|cf-ray|netlify'
```

- `x-vercel-id` / `cname.vercel-dns.com` → **Vercel** (Path A)
- `cf-ray` / Cloudflare nameservers → **Cloudflare Pages** (Path B)
- `x-nf-request-id` / `*.netlify.app` → **Netlify** (Path C)
- a raw IP + `nginx`/`apache` → **VPS** (Path D)

Also check for an existing repo/project for the apex site (likely under `C:\dev\` and the
`Bobi-Labs` GitHub org) — the subdomain can be a **separate small project** pointed at the
same account, which is the cleanest approach.

---

## Step 2 — Deploy (follow the one that matches)

### Path A — Vercel
```bash
mkdir bobi-bar && cd bobi-bar
cp /path/to/bar-do-bobi.html ./index.html
vercel --prod                       # creates/links a new project
vercel domains add bar.bobilabs.dev # attach the subdomain to THIS project
```
Vercel prints the exact DNS record to add (usually a CNAME → `cname.vercel-dns.com`).

### Path B — Cloudflare Pages
```bash
mkdir bobi-bar && cd bobi-bar
cp /path/to/bar-do-bobi.html ./index.html
npx wrangler pages deploy . --project-name bobi-bar
```
Then in the Pages project → **Custom domains** → add `bar.bobilabs.dev`. If the zone is on
Cloudflare, the CNAME is created automatically.

### Path C — Netlify
```bash
mkdir bobi-bar && cd bobi-bar
cp /path/to/bar-do-bobi.html ./index.html
netlify deploy --prod --dir .
```
Netlify dashboard → **Domain settings** → add domain alias `bar.bobilabs.dev`, then add the
shown CNAME at your DNS provider.

### Path D — VPS (nginx)
```bash
sudo mkdir -p /var/www/bar.bobilabs.dev
sudo cp /path/to/bar-do-bobi.html /var/www/bar.bobilabs.dev/index.html
```
Server block:
```nginx
server {
    listen 80;
    server_name bar.bobilabs.dev;
    root /var/www/bar.bobilabs.dev;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d bar.bobilabs.dev   # HTTPS
```

---

## Step 3 — DNS

Add a record for the subdomain at whoever controls the `bobilabs.dev` zone:

| Type  | Name  | Value                                   |
|-------|-------|-----------------------------------------|
| CNAME | `bar` | (host target from Step 2 — e.g. `cname.vercel-dns.com`) |
| A     | `bar` | (VPS IP, **only** for Path D)           |

Propagation is usually minutes. Verify: `dig +short bar.bobilabs.dev`.

---

## Step 4 — Verify

- [ ] `https://bar.bobilabs.dev` loads with a valid TLS cert
- [ ] Fonts render (Fraunces title, Spectral body) — if blocked, see Notes → CSP
- [ ] **EN / PT toggle** flips all text
- [ ] Filter chips work (All / Ready now / Tried / Not yet / spirits / How-to / Shopping)
- [ ] Tap **"Tried it?"** on a card, reload → the ✓ persists (localStorage)
- [ ] Open on a phone: sticky filter bar scrolls horizontally, cards are tappable, layout is single-column

---

## Notes

- **CSP:** if bobilabs.dev enforces a Content-Security-Policy, allow
  `https://fonts.googleapis.com` (style-src) and `https://fonts.gstatic.com` (font-src),
  or self-host the two fonts and swap the `<link>` for local `@font-face`.
- **Cache:** static file — safe to cache aggressively, but set HTML to
  `Cache-Control: no-cache` (or short max-age) so future edits show up immediately.
- **Favicon (optional):** drop a `favicon.ico` beside `index.html` and add
  `<link rel="icon" href="/favicon.ico">` to `<head>`.
- **Updating later:** editing is just editing this one file. The drinks live in the `D`
  array, the section list in `SECTIONS`, all UI strings in the `T` object, and cocktail
  display names in `NAMES`. Add a drink → push a new object to `D` with a matching `NAMES`
  entry. Redeploy = re-run the Step 2 command for your path.
