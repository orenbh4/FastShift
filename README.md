# FastShift

Shift management app with a static frontend, Vercel API routes, Supabase PostgreSQL persistence, and email verification.

## Project Structure

The production deployment is designed for Vercel:

- `public/index.html`, `public/styles.css`, and `public/app.js` are served as the frontend on Vercel.
- `/api` contains the Vercel API entry points.
- `api/[...path].js` forwards API requests to the existing Express app during the transition.
- `db.js` uses the Supabase/PostgreSQL connection from `api/_supabase.js`.
- `mailer.js` is still used by API routes for verification and password reset emails.
- `docker-compose.yml` is only for local PostgreSQL and is ignored by Vercel.
- `.env`, `node_modules`, and log files must not be uploaded to GitHub.

`server.js` is still useful for local development. In Vercel production it is imported by the API function and does not start its own listener.

## Local Development

Local development can use Docker only for PostgreSQL. Docker is not required in Vercel production.

1. Install dependencies:

```bash
npm install
```

2. Start local PostgreSQL:

```bash
docker compose up -d
```

The local PostgreSQL container is exposed on host port `5433` to avoid conflicts with other local PostgreSQL services.

3. Create `.env` from `.env.example` and keep it private:

```bash
copy .env.example .env
```

4. For local Docker PostgreSQL use:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5433/fastshift
DB_SSL=false
```

5. Configure email in `.env`.

For real automatic email, fill:

```env
SESSION_SECRET=replace_with_a_long_random_secret
AUTH_TOKEN_TTL_HOURS=12
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM="FastShift <no-reply@your-domain.com>"
```

If SMTP is empty, the server will still create users in PostgreSQL and print the verification link in the terminal instead of sending email.

`SESSION_SECRET` signs login tokens. Use a long random value and keep it private.

6. Start the app:

```bash
npm start
```

7. Open:

```text
http://localhost:3000
```

To test from an iPhone or Android phone on the same Wi-Fi, open the app with the computer's Wi-Fi IP:

```text
http://YOUR_COMPUTER_IP:3000
```

If the phone cannot open the app, allow Node.js through Windows Firewall for private networks and make sure the phone and computer are on the same Wi-Fi network.

## Production On Vercel + Supabase

Production should not use Docker. `docker-compose.yml` is only for local development and is excluded from Vercel deployment by `.vercelignore`.

In Vercel, configure these Environment Variables:

```env
NODE_ENV=production
APP_BASE_URL=https://your-vercel-domain.vercel.app
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_DATABASE_URL=postgresql://postgres.your-ref:your-password@aws-0-region.pooler.supabase.com:6543/postgres
DATABASE_POOL_MAX=5
SESSION_SECRET=replace_with_a_long_random_secret
AUTH_TOKEN_TTL_HOURS=12
CORS_ORIGINS=https://your-vercel-domain.vercel.app
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM="FastShift <no-reply@your-domain.com>"
```

Use the Supabase Transaction Pooler connection string for Vercel/serverless production.
If the Vercel Supabase integration already created `POSTGRES_URL`, the app can use that too. `SUPABASE_DATABASE_URL` takes priority when both are configured.

Do not add `HOST`, `PORT`, Docker, `.env`, `node_modules`, or local PostgreSQL settings to Vercel production or GitHub.

## API

- `POST /api/users/invite` creates a pending user and sends a verification email.
- `GET /api/verify?token=...` verifies the user from the email link.
- `GET /api/users` returns users according to permissions.
- `POST /api/attendance/toggle` clocks in/out.
- `GET /api/reports?from=YYYY-MM-DD&to=YYYY-MM-DD` generates report data from PostgreSQL.
