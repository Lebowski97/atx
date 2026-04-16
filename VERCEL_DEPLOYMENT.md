# Vercel Deployment Guide (Monorepo)

This repo contains two separate Next.js apps deployed as two Vercel projects:

- `apps/store` (customer storefront)
- `apps/hq` (admin dashboard)

## 1) Create two Vercel projects

Create one project per app from the same Git repo.

### Store project settings

- Root Directory: `apps/store`
- Build Command: `pnpm run build`

### HQ project settings

- Root Directory: `apps/hq`
- Build Command: `pnpm run build`

## 2) Required environment variables

Add these in Vercel Project Settings for each project.

### Store project (`apps/store`)

- `NEXT_PUBLIC_CONVEX_URL`
- `STOREFRONT_SERVER_SECRET`
- `STOREFRONT_SESSION_SECRET`

### HQ project (`apps/hq`)

- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## 3) Convex deployment

Both apps must point to the same Convex deployment URL (`NEXT_PUBLIC_CONVEX_URL`).
If this URL differs between projects, they will not share the same data.

## 4) Common failure modes

- If HQ deploy uses Bun unexpectedly, remove app-level Bun lockfiles and redeploy.
- If Store landing page works but entering passcode errors, check:
  - `STOREFRONT_SERVER_SECRET`
  - `STOREFRONT_SESSION_SECRET`
- If HQ sign-in fails or middleware errors, check:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
