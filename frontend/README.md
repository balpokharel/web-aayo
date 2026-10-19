# Web Aayo Public Website

The customer-facing Web Aayo site, built with Next.js/Vinext for portable local development and Sites deployment.

## Included

- Responsive home, services, work, pricing, about, blog, contact, quote, privacy and terms pages
- Search-friendly metadata, sitemap, robots, structured routes and useful empty states
- Validated contact and quote forms connected to the Web Aayo API
- First-party analytics events with no sensitive form content
- Site-aware assistant with an offline knowledge fallback and Socket.IO live-chat handoff
- Original Web Aayo hero artwork stored in `public/images/`

## Local development

1. Copy `.env.example` to `.env` and set the API URL.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:5173`.

The public content API has safe starter content for services and pricing when the backend is not running. Form submissions and human live chat require the backend; they never show a fake success state.

## Production

Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` and the optional Turnstile site key. Run `npm run typecheck` and `npm run build`. The checked-in Sites manifest identifies the hosted project; do not commit generated `.sites-runtime`, `.vinext` or `.wrangler` state.
