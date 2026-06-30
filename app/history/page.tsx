'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Row = {
  id: string; buyer_name: string; product_name: string; keyword: string; inquiry_type: string; generated_answer: string; created_at: string; app_users?: { name: string; login_id: string };
};

export default function HistoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => { fetch('/api/history').then(r => r.json()).then(d => setRows(d.data || [])); }, []);
  const filtered = useMemo(() => rows.filter((r) => JSON.stringify(r).includes(q)), [rows, q]);

  return <>
    <header className="container nav"><Link href="/dashboard" className="logo"><span className="logo-dot" /> CS Mate</Link><nav className="nav-links"><Link href="/dashboard">생성</Link><Link href="/settings">직원관리</Link></nav></header>
    <main className="container">
      <section className="hero"><h1>전체 답변 기록</h1><p>직원이 만든 모든 답변을 함께 볼 수 있어요.</p></section>
      <input className="input" placeholder="구매자명, 키워드, 상품명, 답변 검색" value={q} onChange={(e) => setQ(e.target.value)} />
      <div style={{ overflowX: 'auto', marginTop: 16 }}>
        <table className="table">
          <thead><tr><th>시간</th><th>직원</th><th>유형</th><th>키워드</th><th>구매자</th><th>답변</th></tr></thead>
          <tbody>{filtered.map((r) => <tr key={r.id}>
            <td>{new Date(r.created_at).toLocaleString('ko-KR')}</td><td>{r.app_users?.name}</td><td>{r.inquiry_type}</td><td>{r.keyword}</td><td>{r.buyer_name}</td><td>{r.generated_answer}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </main>
  </>;
}
