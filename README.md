# CS Mate - 스마트스토어 CS 답변 생성기

네이버 스마트스토어 CS 답변을 100자 이내로 자동 생성하고, 생성 기록을 Supabase에 저장하는 웹앱입니다.

## 준비물

1. GitHub 계정
2. Supabase 프로젝트
3. Vercel 계정
4. OpenAI API Key

> ChatGPT Plus 구독과 OpenAI API 과금은 별도입니다. OpenAI Platform에서 API 결제수단을 등록해야 합니다.

## 설치

```bash
npm install
cp .env.example .env.local
```

`.env.local`에 값을 넣으세요.

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
APP_JWT_SECRET=긴랜덤문자
```

## Supabase 설정

1. Supabase > SQL Editor 접속
2. `supabase/schema.sql` 내용을 복사해서 실행
3. 아래 명령으로 기본 계정 생성

```bash
npm run seed
```

기본 계정:

- 관리자: `0000` / `1234`
- 직원: `0001` / `1234`

새 직원은 웹앱의 직원관리에서 추가합니다. 아이디는 `0002`, `0003`처럼 자동 증가하고 비밀번호는 휴대폰 뒷자리입니다.

## 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 배포

1. GitHub에 이 폴더 업로드
2. Vercel에서 GitHub 저장소 연결
3. Vercel 환경변수에 `.env.local`과 같은 값 등록
4. Deploy 클릭

## 색상

신뢰감을 주는 3가지 색만 사용합니다.

- 네이비: `#102a43`
- 그린: `#03c75a`
- 화이트: `#ffffff`

## 1차 기능

- 관리자/직원 로그인
- AI CS 답변 생성
- 한글 100자 이내 답변
- 답변 자동 저장
- 전체 직원 기록 공유
- 직원 추가
