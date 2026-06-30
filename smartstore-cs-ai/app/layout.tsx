import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CS Mate',
  description: '네이버 스마트스토어 CS 답변 생성기'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
