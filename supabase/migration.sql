-- Run this in your Supabase SQL Editor

-- Auto Reply Settings Table
create table if not exists auto_reply_settings (
  id            uuid default gen_random_uuid() primary key,
  email         text unique not null,
  enabled       boolean default false,
  tone          text default 'professional',
  business_name text default '',
  business_type text default 'local service',
  language      text default 'auto',
  signature     text default '',
  rules         jsonb default '[]',
  updated_at    timestamptz default now()
);

-- Auto Reply Log Table
create table if not exists auto_reply_log (
  id            uuid default gen_random_uuid() primary key,
  user_email    text not null,
  from_email    text,
  subject       text,
  reply_sent    text,
  quality_score int,
  language      text,
  created_at    timestamptz default now()
);

-- Subscriptions Table (if not already created)
create table if not exists subscriptions (
  id              uuid default gen_random_uuid() primary key,
  email           text not null,
  plan            text default 'free',
  status          text default 'active',
  stripe_customer text,
  updated_at      timestamptz default now()
);

-- Enable Row Level Security
alter table auto_reply_settings enable row level security;
alter table auto_reply_log       enable row level security;
alter table subscriptions        enable row level security;

-- Policies (service role bypasses these)
create policy "Users can read own settings"
  on auto_reply_settings for select
  using (email = auth.email());

create policy "Users can read own logs"
  on auto_reply_log for select
  using (user_email = auth.email());