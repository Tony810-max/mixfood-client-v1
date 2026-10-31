# Recruitment API and search visibility

## Findings

- Production `GET https://api.mix-food.io.vn/recruitment` returned 200 with three active positions during inspection. Admin-origin CORS preflight returned 204 and allowed the Authorization header.
- `GET /recruitment/admin/all` without credentials returned 401 as expected. A successful authenticated admin request could not be verified without an account session.
- JWT validation previously returned the role embedded in the token. A user promoted to MANAGER could remain forbidden until token renewal; a demoted admin could retain privileges. Validation now returns the current database role and email.
- Docker/Compose builds defaulted to localhost for the browser API URL. Production defaults now use the public HTTPS API. The inspected admin bundle already used the production API URL, so this is a deployment safeguard rather than a confirmed cause of the reported production failure.
- The admin add-position select could display a remaining position but still submit SERVICE from stale selection state. The submitted value now follows the available selection.

## SEO changes

The Vite build writes HTML with route-specific titles, descriptions, canonical URLs, social metadata and readable evergreen content for the homepage, menu, booking, careers and three role pages. React replaces this initial content when loaded; current vacancies continue to come from the API, avoiding frozen vacancy counts in the build.

The generated sitemap includes the public pages and uses `VITE_SITE_URL`, as does robots.txt. Each role has a permanent descriptive URL linked from the careers list. JobPosting data appears only on a detail page with an active position, and is removed for closed positions or fetch failures. The evergreen role information pages can remain indexed when recruitment is paused.

Google requires JobPosting markup on individual job pages, not listing pages:
https://developers.google.com/search/docs/appearance/structured-data/job-posting

## Deployment and verification

The recruitment page now has an application form (name, phone, email, availability and optional experience). `POST /recruitment/applications` validates and stores submissions only for active positions and is rate limited. `GET /recruitment/admin/applications` is restricted to ADMIN and MANAGER; the recruitment tab displays the latest 100 applications. There is no automatic email delivery or CV file upload.

Administrators/managers can select PART_TIME, FULL_TIME or both, and set a positive salary in VND with HOUR or MONTH as its unit. Clearing the amount means negotiable. Each card has a Save changes action so the settings are submitted together. The website, application employment-type selector and JobPosting salary/type fields use these saved values. Submissions are rejected if the chosen employment type is no longer offered.

Apply `20261029010000_recruitment_terms` and `20261029020000_chatbot_english` after the application migration when releasing these features. Existing vacancies retain both work types and negotiable salary; no salary is invented for existing records.

Deploy backend migration `20261029000000_add_recruitment_applications` before releasing the new form. The Docker entrypoint runs `prisma migrate deploy`; for another deployment method run `pnpm exec prisma migrate deploy` against the intended database. This change generated and validated the Prisma client locally but did not apply a production migration.

1. Rebuild and deploy backend, admin and client from their respective repositories using the existing deployment process. For Docker Compose in each repository: `docker compose up -d --build`. Backend startup applies existing migrations; do not reset or reseed the production database.
2. Confirm admin build configuration: `NEXT_PUBLIC_API_BASE_URL=https://api.mix-food.io.vn`. Client: `VITE_API_BASE_URL=https://api.mix-food.io.vn`, `VITE_SITE_URL=https://mix-food.io.vn`. These variables are baked into the bundles; changing runtime environment variables alone does not update existing bundles.
3. Sign in to admin with an active ADMIN or MANAGER account. Check GET `/recruitment/admin/all` and an intended PATCH in browser Network. 401 means credentials/session; 403 means account role; 404 suggests a stale deployment/proxy; 5xx requires backend logs. Do not make the admin endpoint public.
4. Open `/careers` and `/careers/nhan-vien-phuc-vu` directly. View page source to verify distinct titles, canonicals and initial content. Check `/sitemap.xml` and `/robots.txt`.
5. Validate an active detail URL with Google's Rich Results Test. In the site's verified Search Console property, submit `/sitemap.xml` and request indexing for the careers and role URLs. Search Console access is required and these actions were not performed by this change.

Indexing and ranking depend on Google's crawl and ranking systems; publication does not guarantee immediate indexing or a top position. New roles or job fields should be added to the shared recruitment constants and visible content, without inventing salary, benefits or deadlines.
