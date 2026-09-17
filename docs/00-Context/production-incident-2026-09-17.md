# Production Incident: Backend (Railway) Down — 2026-09-17

## Summary

The production backend server is **completely unreachable**. The public site (Netlify) is still up and *looks* functional to a casual visitor, but this is masking the outage — see [Why the homepage still looks fine](#why-the-homepage-still-looks-fine-and-why-thats-a-problem) below. Anything that requires a live write to the database (contact form, calculator leads, admin login) is broken right now for real users.

## Evidence

| Check | Result |
| --- | --- |
| `GET https://server-production-a5a6.up.railway.app/api/health` | **404** — Railway's own "train has not arrived at the station" page (not the app's response — Railway's edge has no active deployment to route to) |
| `https://shiran-gilad.com` (Netlify) | **200**, loads fully, RTL layout and nav correct |
| Browser console on `shiran-gilad.com` | `CORS` errors on `/api/health`, `/api/projects`, `/api/testimonials/published` — all three are the client trying to reach the dead Railway URL |

The "train has not arrived at the station" page is Railway's own platform-level 404, returned when there's no running deployment behind that domain — not an application error.

### Root cause, confirmed via the Railway CLI/API

The project lives under a **different Railway account** than the one this machine's CLI was originally signed into (`netanels@humi.co.il`, which has zero trace of a shirans project). The real project is under **`segal.netanel4@gmail.com`**, workspace "netanelsegal's Projects" — project `glorious-wholeness`, service `server`, domain `server-production-a5a6.up.railway.app` (confirmed match).

Deployment history for that service:
- Last real deploy (`96cef4b0…`, commit "sync package-lock for sharp linux optional deps") built successfully on **2026-05-31** and ran fine for over five weeks.
- Its status flipped to **`REMOVED`** on **2026-07-08T08:13:48Z** — a clean removal, not a crash (no `CRASHED` status, no error-exit pattern).
- Every commit merged after that date only touched `client/` files, so Railway's watch-path rule (`watchPatterns: ["/server/**"]`) never triggered a redeploy — the service has simply sat removed since July 8, silently, for over two months.
- The project's `subscriptionType` is `hobby`, current billing period usage is `$0.00` with no line items, and no usage limit is configured. This is consistent with the service having been stopped and never billed since (nothing running = nothing to bill) — it does **not** rule out a payment-method/plan issue at the time of removal, which isn't visible from the API and needs to be checked in the Railway dashboard's Billing page directly.
- `canRedeploy: true` on that last deployment — a redeploy path exists without rebuilding the project from scratch, once whatever blocked it is resolved.

## Why the homepage still looks fine (and why that's a problem)

The client has a resilience pattern already built in: [`fetchWithFallback`](client/src/utils/fetchWithFallback.ts) wraps the projects/categories/testimonials GET calls ([projects.service.ts](client/src/services/projects.service.ts), [testimonials.service.ts](client/src/services/testimonials.service.ts), [categories.service.ts](client/src/services/categories.service.ts)). If the live API call throws, it silently falls back to a static snapshot bundled into the client build ([`data/shiran.projects.ts`](client/src/data/shiran.projects.ts), [`data/shiran.testimonials.ts`](client/src/data/shiran.testimonials.ts)).

This is why the homepage, projects list, and testimonials all render content despite the backend being fully down — visitors have no way to tell anything is wrong. Two consequences worth knowing:
- Any project or testimonial added/edited via the admin panel **since the last Netlify build** will not show — visitors are seeing a frozen snapshot, silently, with no indication it's stale.
- The outage is invisible from the live site itself. It was only caught here by directly hitting the Railway URL and reading the browser console — there's currently no monitoring/alert that would have caught this automatically.

## What's actually broken for real users right now

No fallback exists for these — they are direct `POST`/mutation calls to the dead backend, so they fail outright:
- **Contact form** ([contact.service.ts](client/src/services/contact.service.ts)) — `POST /api/contact` fails. Note: the EmailJS notification itself is a separate client-side call and may still fire, but the lead is never recorded in the database.
- **Cost Calculator lead submission** ([calculator.service.ts](client/src/services/calculator.service.ts)) — `POST /api/calculator/leads` fails. Calculator config (`GET`) also has no fallback, so the calculator page likely fails to load its config entirely.
- **Admin login and the entire admin dashboard** — authentication and all CRUD operations require the live backend; there's no (and shouldn't be a) offline fallback for these.

## Not affected

- The Netlify-built static site itself (HTML/JS/CSS/fonts/images) — fully up.
- The Netlify build/deploy pipeline — [`generate-sitemap.mjs`](client/scripts/generate-sitemap.mjs) already degrades gracefully if the Railway API is unreachable at build time (falls back to project IDs already in the last-built `sitemap.xml`), so this outage won't break future Netlify deploys.

## Docs discrepancy found along the way

[`docs/00-Context/tasks.md`](tasks.md) still lists the open deploy task as **"Finalize Render (Server) and Netlify (Client) settings"** — the server actually deploys to **Railway** (see [`nixpacks.toml`](../../nixpacks.toml), which is Railway-specific, and `client/.env.production`'s `VITE_API_URL`). Render appears to be leftover from an earlier plan that was never updated after switching to Railway. Updated below.

## Update: Railway service redeployed (2026-09-17, same day)

Redeployed the `server` service from latest `main` (`railway redeploy --from-source`) under the correct account (`segal.netanel4@gmail.com`). Build succeeded, `GET /api/health` now returns `200 {"status":"ok",...}`. The project's plan now shows as `hobby` (was `free` on the last deployment before removal) — consistent with a billing/plan change having been the reason the July 8 removal happened, though this wasn't confirmed via a Billing-page audit trail (not exposed over the API).

## Second, separate issue found immediately after: database is unreachable

With the Railway server back up, `GET /api/projects` and `GET /api/testimonials/published` now return a clean `500 {"error":"HttpError","message":"Failed to fetch projects",...}` — a real backend error, not the CORS symptom it first looked like from the browser (the CORS-blocked message is a side effect of the 500 response, not an actual CORS misconfiguration — `CORS_ORIGIN` is correctly set to `https://shiran-gilad.com` on the service).

Root cause: **the database is not hosted on Railway at all** — there is only one service (`server`) in this project, no Postgres service. `DATABASE_URL` points to a **Supabase** pooler host (`*.pooler.supabase.com`). Supabase's free tier auto-pauses a project after ~7 days of inactivity. This backend has been down for over two months, so the Supabase project has almost certainly auto-paused independently of the Railway outage — meaning fixing Railway alone was not enough.

**This cannot be fixed from Railway or from this session** — it requires logging into the Supabase dashboard and resuming/restoring the paused project. Once that's done, re-check `GET /api/projects` for a real (non-500) response.

## Recommended next steps

1. **Log into the Supabase dashboard** and resume/restore the paused project backing `DATABASE_URL` above — this is the current blocker for all data-backed pages (projects, testimonials, contact, calculator).
2. Once Supabase is resumed, re-verify `GET https://server-production-a5a6.up.railway.app/api/projects` returns real data (not a 500), and re-check `shiran-gilad.com` in a browser for the CORS errors clearing.
3. Consider adding a minimal uptime check (even a free one, e.g. UptimeRobot/Better Uptime hitting `/api/health`) — this incident stayed invisible for **over two months** (Railway service removed 2026-07-08, only discovered 2026-09-17) given the silent fallback behavior described above.
4. Consider whether a paused free-tier Supabase project is an acceptable production dependency going forward, given it silently breaks the backend on any sufficiently long quiet period.
5. Optional, lower priority: surface *something* to visitors when `fetchWithFallback` is serving stale data (even just a console warning is already there — a subtler in-page indicator is a product decision, not urgent).
