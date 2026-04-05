# 딥클래스 API 발급 가이드

이 문서는 딥클래스 사이트에 필요한 외부 API 키 발급 절차를 안내합니다.

---

## 1. Supabase (DB + 인증)

Supabase는 데이터베이스와 소셜 로그인을 한번에 처리합니다.

1. https://supabase.com 접속 → "Start your project" 클릭
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. 프로젝트명: `deepclass`, 비밀번호 설정, Region: `Northeast Asia (Tokyo)` 선택
5. 생성 완료 후 Settings → API 에서 확인:
   - `Project URL` → `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`로 저장
   - `anon public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`로 저장

---

## 2. Google OAuth (구글 로그인)

1. https://console.cloud.google.com 접속
2. 새 프로젝트 생성 (이름: `deepclass`)
3. API 및 서비스 → OAuth 동의 화면 설정
   - 앱 이름: `딥클래스`
   - 사용자 유형: `외부`
4. 사용자 인증 정보 → OAuth 2.0 클라이언트 ID 생성
   - 애플리케이션 유형: `웹 애플리케이션`
   - 승인된 리디렉션 URI: `https://<your-supabase-url>/auth/v1/callback`
5. 발급된 클라이언트 ID와 시크릿을 Supabase → Authentication → Providers → Google에 입력

---

## 3. Kakao OAuth (카카오 로그인)

1. https://developers.kakao.com 접속 → 로그인
2. 내 애플리케이션 → 애플리케이션 추가
   - 앱 이름: `딥클래스`
3. 앱 설정 → 앱 키에서 `REST API 키` 확인
4. 카카오 로그인 → 활성화 설정 ON
5. 동의항목에서 `닉네임`, `이메일` 필수 동의 설정
6. Redirect URI: `https://<your-supabase-url>/auth/v1/callback`
7. REST API 키와 Client Secret을 Supabase → Authentication → Providers → Kakao에 입력

---

## 4. Naver OAuth (네이버 로그인)

1. https://developers.naver.com 접속 → 로그인
2. Application → 애플리케이션 등록
   - 애플리케이션 이름: `딥클래스`
   - 사용 API: `네이버 로그인` 선택
   - 필수 제공 정보: `이름`, `이메일`, `프로필 사진`
3. 로그인 오픈 API 서비스 환경: `WEB`
   - 서비스 URL: `https://deepclass.site`
   - Callback URL: `https://<your-supabase-url>/auth/v1/callback`
4. Client ID와 Client Secret을 Supabase → Authentication → Providers에서 설정
   (Supabase는 네이버를 기본 지원하지 않으므로 Custom OIDC Provider로 설정)

---

## 5. Naver Search API (뉴스 검색)

1. https://developers.naver.com 접속
2. Application → 애플리케이션 등록
   - 애플리케이션 이름: `딥클래스 뉴스`
   - 사용 API: `검색` 선택
3. 발급된 키 확인:
   - `Client ID` → `.env.local`에 `NAVER_CLIENT_ID`로 저장
   - `Client Secret` → `NAVER_CLIENT_SECRET`으로 저장
4. 일일 호출 한도: 25,000건 (무료)

---

## 6. YouTube Data API v3

1. https://console.cloud.google.com 접속 (2번에서 만든 프로젝트 사용)
2. API 및 서비스 → 라이브러리 → "YouTube Data API v3" 검색 → 사용 설정
3. 사용자 인증 정보 → API 키 생성
4. 발급된 키 → `.env.local`에 `YOUTUBE_API_KEY`로 저장
5. 일일 할당량: 10,000 단위 (검색 1회 = 100 단위 → 약 100회/일)

---

## .env.local 파일 예시

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 채워주세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxx

# Naver Search API
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# YouTube Data API
YOUTUBE_API_KEY=your_youtube_api_key
```

> Google/Kakao/Naver OAuth 키는 Supabase 대시보드에서 직접 설정하므로 .env.local에 넣지 않아도 됩니다.

---

## 발급 순서 추천

1. **Supabase** → DB와 인증 기반 먼저 세팅
2. **Google OAuth + YouTube API** → 구글 콘솔에서 한번에 처리
3. **Kakao OAuth** → 카카오 개발자 센터
4. **Naver OAuth + Search API** → 네이버 개발자 센터에서 한번에 처리

모든 API 발급이 완료되면 알려주세요. 바로 연동 작업을 진행하겠습니다.
