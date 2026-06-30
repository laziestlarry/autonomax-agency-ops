# AIKAGAN Domain Deployment Plan

## Overview

`autonomax-engine.fly.dev` → `aikagan.com` (Squarespace domain, Vercel static page currently)

## Option A: Subdomain (Recommended for parallel operation)

Point `app.aikagan.com` (or `engine.aikagan.com`) to the Fly.io app.

| Step | Action | Where |
|------|--------|-------|
| 1 | Add CNAME record: `app` → `autonomax-engine.fly.dev` | Squarespace DNS panel |
| 2 | Add custom domain to Fly.io | `flyctl certs add app.aikagan.com` |
| 3 | Set env vars on Fly.io | `flyctl secrets set FRONTEND_URL=https://app.aikagan.com CANONICAL_BASE_URL=https://app.aikagan.com CORS_ORIGIN=https://app.aikagan.com` |
| 4 | Update `fly.toml` `[env]` section | Change FRONTEND_URL & CORS_ORIGIN to new domain |
| 5 | Deploy | Push to GitHub → auto-deploy via Actions |
| 6 | Verify | Visit `https://app.aikagan.com` — should load the app with working Stripe checkout |

**Pros**: Vercel static store stays live at root domain. Clean separation.
**Cons**: Two domains for one brand.

## Option B: Root Domain (Replace Vercel page entirely)

Replace the current Vercel-deployed static store with the Fly.io SPA at `aikagan.com`.

| Step | Action | Where |
|------|--------|-------|
| 1 | Remove Vercel DNS records for `aikagan.com` | Vercel dashboard → Domains |
| 2 | Add A/ALIAS record: `@` → `fly.io` IPs (check `flyctl ips list`) | Squarespace DNS panel |
| 3 | Add custom domain to Fly.io | `flyctl certs add aikagan.com` |
| 4 | Set root domain env vars | `flyctl secrets set FRONTEND_URL=https://aikagan.com CANONICAL_BASE_URL=https://aikagan.com CORS_ORIGIN=https://aikagan.com` |
| 5 | Update `fly.toml` `[env]` | Change to `https://aikagan.com` |
| 6 | Deploy | Push to GitHub → auto-deploy |
| 7 | Verify | Visit `https://aikagan.com` |

**Pros**: Single domain, unified brand.
**Cons**: Loses the current Vercel product store (unless migrated into the app).

## Option C: Dual-Site (Vercel + Fly.io on same domain via path)

Keep Vercel at `aikagan.com` for the store, mount the Fly.io SPA at `aikagan.com/app`.

| Step | Action | Where |
|------|--------|-------|
| 1 | Add `_redirects` or rewrites on Vercel | Proxy `/app/*` to `autonomax-engine.fly.dev` |
| 2 | Set Fly.io env to sub-path aware | `FRONTEND_URL=https://aikagan.com/app` |
| 3 | Update SPA router | Add `base: "/app"` (requires Vite config change) |

**Pros**: Single root domain, keeps existing store.
**Cons**: More complex routing; Vercel proxying adds latency.

## Environment Variables to Update (all options)

After DNS change:

```bash
flyctl secrets set \
  FRONTEND_URL=https://ENGINE.YOUR-DOMAIN.com \
  CANONICAL_BASE_URL=https://ENGINE.YOUR-DOMAIN.com \
  CORS_ORIGIN=https://ENGINE.YOUR-DOMAIN.com
```

Also update `fly.toml`:
```toml
[env]
  FRONTEND_URL = "https://ENGINE.YOUR-DOMAIN.com"
  CORS_ORIGIN = "https://ENGINE.YOUR-DOMAIN.com"
```

## Stripe Redirects (auto-updated)

The checkout session uses `FRONTEND_URL` for `success_url` / `cancel_url`:
- `success_url`: `{FRONTEND_URL}/launch?session_id={CHECKOUT_SESSION_ID}`
- `cancel_url`: `{FRONTEND_URL}/monetization`

Updating the env var handles all Stripe redirects automatically.

## Quick Prerequisites

- [ ] Squarespace DNS: ability to add CNAME or ALIAS records
- [ ] Fly.io CLI installed (`brew install flyctl`)
- [ ] Logged into Fly.io (`flyctl auth login`)
- [ ] Vercel project access (if keeping Vercel page)

## Recommended Order of Operations

1. **First**: Set all Fly.io secrets with the new domain URL
2. **Then**: Add DNS record (the domain will 404 until Fly.io cert provisions, which can take 1-30 min)
3. **Then**: `flyctl certs add <domain>` — Fly.io auto-provisions Let's Encrypt TLS
4. **Then**: Push code change → auto-deploy
5. **Finally**: Verify at the new domain
