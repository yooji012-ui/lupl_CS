create extension if not exists pgcrypto;

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  login_id text unique not null,
  name text not null,
  role text not null check (role in ('owner', 'admin', 'staff')),
  phone_last4 text,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists cs_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references app_users(id),
  buyer_name text,
  product_name text,
  keyword text,
  inquiry_type text,
  customer_message text,
  internal_memo text,
  generated_answer text not null,
  tone text not null default '중간',
  created_at timestamptz not null default now()
);

create table if not exists cs_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  template_rule text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into cs_templates (title, category, template_rule)
values (
  '기본 답변',
  '공통',
  '고객에게 감사 인사를 하고, 상황을 정중하게 안내한다. 불편이 있으면 사과하고, 확정되지 않은 내용은 확정적으로 말하지 않는다. 답변은 한글 100자 이내로 작성한다.'
)
on conflict do nothing;
