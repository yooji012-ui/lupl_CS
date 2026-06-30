import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const schema = z.object({ name: z.string().min(1), phone_last4: z.string().regex(/^\d{4}$/) });

function nextLoginId(ids: string[]) {
  const nums = ids.map((id) => Number(id)).filter((n) => Number.isFinite(n));
  const next = Math.max(...nums, 0) + 1;
  return String(next).padStart(4, '0');
}

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  const supabase = supabaseAdmin();
  const { data, error } = await supabase.from('app_users').select('id, login_id, name, role, phone_last4, is_active, created_at').order('login_id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user || user.role === 'staff') return NextResponse.json({ error: '관리자만 가능합니다.' }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: '이름과 휴대폰 뒷자리 4개를 입력해주세요.' }, { status: 400 });

  const supabase = supabaseAdmin();
  const { data: rows } = await supabase.from('app_users').select('login_id');
  const login_id = nextLoginId((rows || []).map((r) => r.login_id));
  const password_hash = await bcrypt.hash(parsed.data.phone_last4, 10);
  const { data, error } = await supabase.from('app_users').insert({
    login_id,
    name: parsed.data.name,
    role: 'staff',
    phone_last4: parsed.data.phone_last4,
    password_hash,
    is_active: true
  }).select('id, login_id, name, role, phone_last4, is_active, created_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
