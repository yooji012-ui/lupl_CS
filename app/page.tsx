'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('0000');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true); setError('');
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login_id: loginId, password }) });
    setLoading(false);
    if (!res.ok) { const data = await res.json(); setError(data.error || '로그인 실패'); return; }
    router.push('/dashboard');
  }

  return <main className="container hero">
    <div className="grid grid-2" style={{ alignItems: 'center', minHeight: '86vh' }}>
      <section>
        <div className="logo"><span className="logo-dot" /> CS Mate</div>
        <h1 style={{ marginTop: 28 }}>스마트스토어 CS 답변을 빠르게 만들어요.</h1>
        <p>키워드, 구매자명, 대략적인 내용만 넣으면 AI가 100자 이내 답변을 정중하게 만들어줍니다.</p>
      </section>
      <section className="card panel">
        <h2 style={{ marginTop: 0 }}>로그인</h2>
        <div className="grid">
          <label><span className="label">아이디</span><input className="input" value={loginId} onChange={(e) => setLoginId(e.target.value)} /></label>
          <label><span className="label">비밀번호</span><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error && <p style={{ color: '#d33', margin: 0 }}>{error}</p>}
          <button className="btn btn-primary" onClick={login} disabled={loading}>{loading ? '확인 중...' : '로그인'}</button>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>관리자: 0000 / 1234 · 직원: 0001 / 1234</p>
        </div>
      </section>
    </div>
  </main>;
}
