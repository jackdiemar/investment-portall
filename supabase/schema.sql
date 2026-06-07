create table if not exists investments (
  id bigint primary key generated always as identity,
  name text not null,
  category text not null,
  logo text,
  fund_name text,
  sector text,
  description text,
  website text,
  contact_email text,
  investment_date text,
  amount_committed numeric not null default 0,
  amount_called numeric not null default 0,
  current_value numeric not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists cash_flows (
  id bigint primary key generated always as identity,
  investment_id bigint references investments(id) on delete cascade,
  flow_date date not null,
  flow_type text not null,
  amount numeric not null
);

insert into storage.buckets (id, name, public)
values ('data-room', 'data-room', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('updates', 'updates', false)
on conflict (id) do nothing;
