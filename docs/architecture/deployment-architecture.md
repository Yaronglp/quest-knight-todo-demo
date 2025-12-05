# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**

- **Platform:** Vercel (Static Site Hosting)
- **Build Command:** `cd frontend && pnpm run build`
- **Output Directory:** `frontend/dist`
- **CDN/Edge:** Automatic deployment to 100+ edge locations worldwide

**Rationale:** Vercel provides zero-config deployment with automatic HTTPS, global CDN, preview deployments for every PR, and a free tier sufficient for MVP.

## CI/CD Pipeline

**GitHub Actions:**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - name: Install dependencies
        working-directory: frontend
        run: pnpm install --frozen-lockfile
      - name: Run linter
        working-directory: frontend
        run: pnpm run lint
      - name: Run type check
        working-directory: frontend
        run: pnpm run typecheck
      - name: Run tests
        working-directory: frontend
        run: pnpm run test:coverage
      - name: Build
        working-directory: frontend
        run: pnpm run build
```

**Vercel Configuration:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": { "cache-control": "public, max-age=31536000, immutable" },
      "dest": "/assets/$1"
    },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

## Environments

| Environment | Frontend URL | Purpose | Deployment Trigger |
|-------------|--------------|---------|-------------------|
| **Development** | `http://localhost:5173` | Local development | Manual (`pnpm run dev`) |
| **Preview** | `quest-knight-pr-{number}.vercel.app` | PR review | Automatic on PR creation |
| **Production** | `questknight.com` | Live environment | Automatic on push to `main` |

## Rollback Strategy

**Vercel Instant Rollback:**

Via Vercel Dashboard: Deployments → Select previous deployment → "Promote to Production"

**Emergency Maintenance Mode:**

Set `VITE_MAINTENANCE_MODE=true` via Vercel environment variable and redeploy.

