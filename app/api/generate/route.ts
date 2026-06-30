import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const schema = z.object({
  inquiry_type: z.string().min(1),
  buyer_name: z.string().optional(),
  product_name: z.string().optional(),
  keyword: z.string().optional(),
  customer_message: z.string().optional(),
  internal_memo: z.string().min(1),
  tone: z.string().default('중간')
});

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: '입력값을 확인해주세요.' }, { status: 400 });
  const input = parsed.data;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `
너는 네이버 스마트스토어 CS 담당자다.
아래 정보를 고객 답변으로 바꿔라.
조건:
- 한글 100자 이내
- 정중하고 자연스럽게
- 과장, 확정, 보장 표현 금지
- 내부 메모가 거칠어도 고객용 표현으로 순화
- 답변만 출력

문의유형: ${input.inquiry_type}
구매자명: ${input.buyer_name || '없음'}
상품명: ${input.product_name || '없음'}
키워드: ${input.keyword || '없음'}
고객문의: ${input.customer_message || '없음'}
내부메모: ${input.internal_memo}
말투: ${input.tone}
`;

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt
  });

  const generated_answer = response.output_text.trim();
  const supabase = supabaseAdmin();
  await supabase.from('cs_generations').insert({
    user_id: user.id,
    ...input,
    generated_answer
  });

  return NextResponse.json({ generated_answer });
}
