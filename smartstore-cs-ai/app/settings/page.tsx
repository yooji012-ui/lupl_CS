'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Staff = { id: string; login_id: string; name: string; role: string; phone_last4: string; is_active: boolean; created_at: string };

export default function SettingsPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  async function load() { const d = await fetch('/api/staff').then(r => r.json()); setStaff(d.data || []); }
  useEffect(() => { load(); }, []);

  async function add() {
    const res = await fetch('/api/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone_last4: phone }) });
    const data = await res.json();
    if (!res.ok) { alert(data.error || '추가 실패'); return; }
    setName(''); setPhone(''); load(); alert(`직원 아이디는 ${data.data.login_id}, 비밀번호는 휴대폰 뒷자리입니다.`);
  }

  return <>
    <header className="container nav"><Link href="/dashboard" className="logo"><span className="logo-dot" /> CS Mate</Link><nav className="nav-links"><Link href="/dashboard">생성</Link><Link href="/history">기록</Link></nav></header>
    <main className="container">
      <section className="hero"><h1>직원 관리</h1><p>새 직원을 추가하면 아이디가 자동으로 1씩 올라갑니다.</p></section>
      <section className="card panel grid grid-2">
        <input className="input" placeholder="직원 이름" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="휴대폰 뒷자리 4개" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={4} />
        <button className="btn btn-primary" onClick={add}>직원 추가</button>
      </section>
      <div style={{ overflowX: 'auto', marginTop: 16 }}>
        <table className="table"><thead><tr><th>아이디</th><th>이름</th><th>권한</th><th>비밀번호 규칙</th></tr></thead>
        <tbody>{staff.map((s) => <tr key={s.id}><td>{s.login_id}</td><td>{s.name}</td><td>{s.role}</td><td>{s.login_id === '0000' || s.login_id === '0001' ? '1234' : '휴대폰 뒷자리'}</td></tr>)}</tbody></table>
      </div>
    </main>
  </>;
}
