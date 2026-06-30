'use client';
import { useState } from 'react';

export default function CsForm({ inquiryTypes }: { inquiryTypes: string[] }) {
  const [form, setForm] = useState({ inquiry_type: inquiryTypes[0], buyer_name: '', product_name: '', keyword: '', customer_message: '', internal_memo: '', tone: '중간' });
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) { setForm((prev) => ({ ...prev, [key]: value })); }

  async function generate() {
    setLoading(true); setAnswer('');
    const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { alert(data.error || '생성 실패'); return; }
    setAnswer(data.generated_answer);
  }

  async function copy() { await navigator.clipboard.writeText(answer); alert('복사했어요.'); }

  return <section className="grid grid-2" style={{ alignItems: 'start', paddingBottom: 48 }}>
    <div className="card panel grid">
      <label><span className="label">문의 유형</span><select className="select" value={form.inquiry_type} onChange={(e) => update('inquiry_type', e.target.value)}>{inquiryTypes.map((t) => <option key={t}>{t}</option>)}</select></label>
      <div className="grid grid-2">
        <label><span className="label">구매자명</span><input className="input" value={form.buyer_name} onChange={(e) => update('buyer_name', e.target.value)} placeholder="예: 김유지" /></label>
        <label><span className="label">상품명</span><input className="input" value={form.product_name} onChange={(e) => update('product_name', e.target.value)} placeholder="예: 선글라스" /></label>
      </div>
      <label><span className="label">키워드</span><input className="input" value={form.keyword} onChange={(e) => update('keyword', e.target.value)} placeholder="예: 매진, 재입고, 배송지연" /></label>
      <label><span className="label">고객 문의 내용</span><textarea className="textarea" value={form.customer_message} onChange={(e) => update('customer_message', e.target.value)} placeholder="고객이 남긴 말을 붙여넣기" /></label>
      <label><span className="label">내가 말하고 싶은 내용</span><textarea className="textarea" value={form.internal_memo} onChange={(e) => update('internal_memo', e.target.value)} placeholder="예: 아 미안 매진이야" /></label>
      <label><span className="label">말투</span><select className="select" value={form.tone} onChange={(e) => update('tone', e.target.value)}><option>중간</option><option>더 정중하게</option><option>짧게</option><option>사과 강조</option></select></label>
      <button className="btn btn-primary" onClick={generate} disabled={loading || !form.internal_memo}>{loading ? '생성 중...' : '답변 생성'}</button>
    </div>
    <div className="card panel">
      <h2 style={{ marginTop: 0 }}>생성 결과</h2>
      <div className="card" style={{ padding: 20, minHeight: 180, background: '#fff' }}>{answer || <span className="muted">여기에 답변이 나와요.</span>}</div>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn btn-secondary" onClick={copy} disabled={!answer}>복사하기</button>
        <button className="btn btn-ghost" onClick={generate} disabled={loading || !form.internal_memo}>다시 생성</button>
      </div>
    </div>
  </section>;
}
