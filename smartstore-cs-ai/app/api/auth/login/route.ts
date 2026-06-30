import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSession } from '@/lib/auth';

const schema = z.object({ login_id: z.string().min(4), password: z.string().min(4) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: '아이디와 비밀번호를 확인해주세요.' }, { status: 400 });

  const { login_id, password } = parsed.data;
  const supabase = supabaseAdmin();
  const { data: user, error } = await supabase.from('app_users').select('*').eq('login_id', login_id).eq('is_active', true).single();
  if (error || !user) return NextResponse.json({ error: '로그인 정보가 맞지 않습니다.' }, { status: 401 });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return NextResponse.json({ error: '로그인 정보가 맞지 않습니다.' }, { status: 401 });

  await createSession({ id: user.id, login_id: user.login_id, name: user.name, role: user.role });
  return NextResponse.json({ ok: true });
}
