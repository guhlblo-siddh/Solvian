-- Run this in Supabase SQL Editor

-- Team Members Table
create table if not exists team_members (
  id           uuid default gen_random_uuid() primary key,
  owner_email  text not null,
  member_email text not null,
  role         text default 'member',
  status       text default 'pending',
  created_at   timestamptz default now(),
  unique(owner_email, member_email)
);

-- Shared Replies Table
create table if not exists shared_replies (
  id             uuid default gen_random_uuid() primary key,
  owner_email    text not null,
  author_email   text not null,
  customer_email text,
  subject        text,
  reply          text,
  quality_score  int,
  language       text,
  tone           text,
  note           text default '',
  comment        text default '',
  status         text default 'pending',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Enable RLS
alter table team_members  enable row level security;
alter table shared_replies enable row level security;

-- Policies
create policy "Owner can manage team"
  on team_members for all
  using (owner_email = auth.email());

create policy "Members can read their team"
  on team_members for select
  using (member_email = auth.email());

create policy "Owner can manage shared replies"
  on shared_replies for all
  using (owner_email = auth.email());

create policy "Authors can insert shared replies"
  on shared_replies for insert
  with check (author_email = auth.email());

-- Indexes for performance
create index if not exists idx_team_members_owner  on team_members(owner_email);
create index if not exists idx_team_members_member on team_members(member_email);
create index if not exists idx_shared_replies_owner on shared_replies(owner_email);