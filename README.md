# Rimaz Portfolio (Next.js + Tailwind + Supabase)

## Quick start
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASS` (used on `/admin`)
   - `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
3. `npm run dev` then open http://localhost:3000

## Supabase schema (SQL)
```sql
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  liveUrl text not null,
  repoUrl text not null,
  techStack text[] default '{}',
  images text[] default '{}',
  featured boolean default false,
  published boolean default true,
  "order" int default 0,
  inserted_at timestamp with time zone default now()
);
```
- Storage bucket: `project-images` (public) for project assets.
- RLS: enable then `allow all` for service role; restrict anon to `published = true` for selects if desired.

## Admin page
- Hidden route: `/admin` (not linked in nav). Requires `NEXT_PUBLIC_ADMIN_PASS`.
- Provides create/update/delete, order, publish toggle, image URL lists.

## Contact form
- Uses Formspree endpoint defined in `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
- Shows success/error state; graceful fallback when env is missing.

## Section order
- Order control (except Home/Contact) stored in `localStorage` under `section-order`.

## Deploy to Vercel
- Set env vars in Vercel dashboard.
- Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADMIN_PASS`, `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
- `npm run build` will be executed by Vercel automatically.





