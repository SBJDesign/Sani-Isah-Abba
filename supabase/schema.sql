-- Academic Hub: database schema for Supabase
-- Run this once in Supabase → SQL Editor → New query → Run.

create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb
);

create table if not exists public.publications (
  id text primary key,
  title text not null,
  authors text not null,
  venue text not null,
  year int not null,
  type text not null default 'journal' check (type in ('journal','conference','chapter','book','preprint','thesis')),
  doi text,
  url text,
  pdf_url text,
  abstract text,
  keywords text[] default '{}',
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id text primary key,
  title text not null,
  summary text not null,
  body text,
  status text not null default 'ongoing' check (status in ('ongoing','completed')),
  funder text,
  start_year int,
  end_year int,
  tags text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id text primary key,
  title text not null,
  date date not null,
  category text not null default 'news' check (category in ('news','award','talk','grant','media')),
  body text not null,
  link text,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id text primary key,
  name text not null check (char_length(name) <= 200),
  email text not null check (char_length(email) <= 320),
  subject text check (char_length(subject) <= 300),
  body text not null check (char_length(body) <= 10000),
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.gallery (
  id text primary key,
  image_url text not null,
  caption text not null default '',
  date text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Row-level security -------------------------------------------------------
-- Visitors can read the public content and send messages.
-- Only signed-in admins can change anything or read messages.

alter table public.profile      enable row level security;
alter table public.publications enable row level security;
alter table public.projects     enable row level security;
alter table public.posts        enable row level security;
alter table public.messages     enable row level security;
alter table public.gallery      enable row level security;

create policy "public read profile"      on public.profile      for select using (true);
create policy "public read publications" on public.publications for select using (true);
create policy "public read projects"     on public.projects     for select using (true);
create policy "public read posts"        on public.posts        for select using (published or auth.role() = 'authenticated');
create policy "public read gallery"      on public.gallery      for select using (true);
create policy "anyone can send a message" on public.messages    for insert with check (read = false);

create policy "admin write profile"      on public.profile      for all to authenticated using (true) with check (true);
create policy "admin write publications" on public.publications for all to authenticated using (true) with check (true);
create policy "admin write projects"     on public.projects     for all to authenticated using (true) with check (true);
create policy "admin write posts"        on public.posts        for all to authenticated using (true) with check (true);
create policy "admin write gallery"      on public.gallery      for all to authenticated using (true) with check (true);
create policy "admin manage messages"    on public.messages     for all to authenticated using (true) with check (true);

-- Table permissions for the website's API roles --------------------------
-- (Needed if "Automatically expose new tables" is off; harmless otherwise.
--  Row-level security above still decides what each role can actually do.)
grant usage on schema public to anon, authenticated;
grant select on public.profile, public.publications, public.projects, public.posts, public.gallery to anon, authenticated;
grant insert on public.messages to anon;
grant select, insert, update, delete on public.profile, public.publications, public.projects, public.posts, public.gallery, public.messages to authenticated;

-- File storage (PDFs, photos, CV) ------------------------------------------
insert into storage.buckets (id, name, public) values ('files', 'files', true)
  on conflict (id) do nothing;

create policy "public read files"  on storage.objects for select using (bucket_id = 'files');
create policy "admin upload files" on storage.objects for insert to authenticated with check (bucket_id = 'files');
create policy "admin update files" on storage.objects for update to authenticated using (bucket_id = 'files');
create policy "admin delete files" on storage.objects for delete to authenticated using (bucket_id = 'files');

-- IMPORTANT: turn OFF public sign-ups (Authentication → Providers → Email → "Allow new users to sign up")
-- and create admin accounts yourself under Authentication → Users → Add user.
-- Any signed-in user is treated as an admin.
