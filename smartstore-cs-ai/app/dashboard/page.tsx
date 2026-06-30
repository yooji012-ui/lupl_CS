import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { inquiryTypes } from '@/lib/csTypes';
import CsForm from './CsForm';

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect('/');
  return <>
    <header className="container nav">
      <Link href="/dashboard" className="logo"><span className="logo-dot" /> CS Mate</Link>
      <nav className="nav-links">
        <Link href="/history">기록</Link>
        <Link href="/settings">직원관리</Link>
        <form action="/api/auth/logout" method="post"><button>로그아웃</button></form>
      </nav>
    </header>
    <main className="container">
      <section className="hero">
        <span className="badge">{user.name} · {user.role}</span>
        <h1>오늘 문의 답변 만들기</h1>
        <p>고객에게 보여줄 말투로 자동 변환됩니다. 만든 답변은 전체 직원이 볼 수 있게 저장돼요.</p>
      </section>
      <CsForm inquiryTypes={[...inquiryTypes]} />
    </main>
  </>;
}
