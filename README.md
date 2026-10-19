# Web Aayo

Web Aayo is a three-application digital agency platform:

- `frontend/` — the public Next.js website, forms, first-party event tracking and SEO routes.
- `backend/` — the versioned NestJS API, MongoDB business data, authentication, RBAC and audit trail.
- `admin/` — the secure Next.js business workspace for CRM, projects, finance, CMS, analytics and settings.

The browser applications never connect directly to MongoDB.

```text
Public website ─┐
                ├── HTTPS /api/v1 ── NestJS API ── MongoDB
Admin portal ───┘          │              │
                           └── Socket.IO live chat
                                         ├── Redis / jobs / rate limits
                                         └── Cloudinary / media
```

## Quick start

1. Review every `.env.example` and create deployment-specific secrets. The checked-in `.env` files contain development-only values.
2. Run `docker compose up -d mongodb redis`.
3. In `backend/`, run `npm install`, `npm run seed`, `npm run create-super-admin`, and `npm run start:dev`.
4. In `frontend/`, run `npm install` and `npm run dev`.
5. In `admin/`, run `npm install` and `npm run dev`.

Local URLs: public site `http://localhost:5173`, admin `http://localhost:3001`, API `http://localhost:4000/api/v1`, Swagger `http://localhost:4000/api/docs`.

## Deployment

- Deploy `frontend/` and `admin/` independently on Vercel or an equivalent Next.js platform.
- Deploy `backend/` from its Dockerfile on Render, Railway, Fly.io, AWS, DigitalOcean or a VPS.
- Use MongoDB Atlas with TLS, least-privilege credentials, network restrictions and continuous backups.
- Use managed Redis for distributed throttling, caching and BullMQ jobs.
- Use Cloudinary or equivalent object storage for media bytes; store only metadata and URLs in MongoDB.
- Set `webaayo.com`, `admin.webaayo.com` and `api.webaayo.com` as the application origins, then update the three environment files.

Do not deploy the development secrets. Rotate access and refresh secrets independently and keep API documentation disabled or protected in production.

## Backup and restore

Enable Atlas point-in-time recovery and retention appropriate to the business. Export media-library metadata and retain object-storage versioning. Keep encrypted copies of environment configuration in a secrets manager. Test restores into an isolated database, verify indexes and record the recovery time. Never test restoration against the live database.

## Data and product principles

- Financial, CRM and project records use archival/soft-delete rules where history matters.
- Audit records and analytics events cannot be mutated through the general admin API.
- Analytics events reject sensitive fields and retain only the context required for traffic and conversion reporting.
- Empty dashboards are intentional: charts populate from real recorded data, not placeholders or invented metrics.
- Optional integrations remain configuration-ready until real provider credentials are connected.
