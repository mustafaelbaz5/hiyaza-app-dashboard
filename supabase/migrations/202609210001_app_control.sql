create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_app_admin()
returns boolean language sql security definer set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()) $$;

create table if not exists public.app_control (
  id text primary key default 'main',
  is_blocked boolean not null default false,
  message_ar text not null default 'التطبيق متوقف مؤقتًا.',
  message_en text not null default 'The app is temporarily unavailable.',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
insert into public.app_control (id) values ('main') on conflict (id) do nothing;
alter table public.app_control enable row level security;
drop policy if exists "public can read app control" on public.app_control;
create policy "public can read app control" on public.app_control for select using (true);
drop policy if exists "admins can update app control" on public.app_control;
create policy "admins can update app control" on public.app_control for update using (public.is_app_admin()) with check (public.is_app_admin());
revoke all on public.admin_users from anon, authenticated;
grant execute on function public.is_app_admin() to authenticated;
