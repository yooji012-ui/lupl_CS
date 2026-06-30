import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export type Role = 'owner' | 'admin' | 'staff';
export type SessionUser = { id: string; login_id: string; name: string; role: Role };

const cookieName = 'cs_session';

function secret() {
  const value = process.env.APP_JWT_SECRET;
  if (!value) throw new Error('APP_JWT_SECRET 환경변수가 없습니다.');
  return new TextEncoder().encode(value);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret());
  cookies().set(cookieName, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().delete(cookieName);
}
