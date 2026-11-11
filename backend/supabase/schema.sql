-- Portfolio database schema for Supabase (Postgres).
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- Only the Express backend talks to these tables, using the service_role key.
-- RLS is enabled with no policies, so the public anon key can read or write nothing.

-- Site content: a single row (id = 1) holding every editable section.
create table if not exists public.site_content (
    id              smallint primary key default 1 check (id = 1),
    hero            jsonb not null default '{}'::jsonb,
    about           jsonb not null default '{}'::jsonb,
    skills          jsonb not null default '[]'::jsonb,
    projects        jsonb not null default '[]'::jsonb,
    contact         jsonb not null default '{}'::jsonb,
    admin_username  text  not null default 'admin',
    admin_password  text  not null default 'admin123',
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- Contact form messages.
create table if not exists public.messages (
    id          uuid primary key default gen_random_uuid(),
    name        text,
    email       text,
    subject     text,
    message     text,
    created_at  timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);

-- Keep updated_at current on every content change.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
    before update on public.site_content
    for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;
alter table public.messages     enable row level security;
