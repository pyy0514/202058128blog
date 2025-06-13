# 윤영의 개발일기 🚀

주니어 개발자 박윤영의 첫 개발 블로그입니다. Next.js, Clerk, Supabase를 활용해 만들었습니다.

## 📖 프로젝트 소개

안녕하세요! 한신대학교 컴퓨터공학과 4학년 재학 중인 박윤영입니다. 💻  
풀스택 개발자를 꿈꾸며 학습 과정과 프로젝트 경험을 기록하는 개인 블로그입니다.  

**블로그 컨셉**: 주니어 개발자의 성장 기록 📚  
**학습 분야**: React, Next.js, Python, Java, 웹 개발 전반

## 🚀 기술 스택

-   **Frontend**: Next.js 15, TypeScript, Tailwind CSS
-   **Authentication**: Clerk
-   **Database**: Supabase (PostgreSQL)
-   **Styling**: Tailwind CSS, shadcn/ui
-   **Markdown**: react-markdown, rehype, remark
-   **Deployment**: Vercel (예정)

## 📋 주요 기능

-   ✅ 동적 About 페이지 (데이터베이스 기반 CRUD)
-   ✅ 블로그 포스트 작성/수정/삭제
-   ✅ 카테고리 관리
-   ✅ 마크다운 지원
-   ✅ 댓글 및 좋아요 시스템
-   ✅ 반응형 디자인
-   ✅ SEO 최적화
-   ✅ 이미지 업로드 및 최적화
-   ✅ 사용자 인증 (Clerk)
-   ✅ 개인화된 브랜딩 및 UI
-   🔄 첫 번째 블로그 포스트 작성 (예정)
-   🔄 다크모드 (예정)

## ✨ 특별한 기능들

### 🎨 개인화된 브랜딩
-   "윤영의 개발일기" 커스텀 브랜딩
-   개인 아바타 및 그라데이션 디자인
-   한신대학교 컴퓨터공학과 정보 표시
-   개인 GitHub, Notion, 이메일 연동

### 📄 동적 About 페이지
-   데이터베이스 기반 About 페이지 관리
-   관리자 인증을 통한 실시간 편집
-   마크다운 지원으로 풍부한 콘텐츠 작성
-   개인 소개, 기술 스택, 학습 목표 등 포함

### 📱 반응형 디자인

-   모바일, 태블릿, 데스크톱 완벽 대응
-   Tailwind CSS를 활용한 현대적 UI/UX

### 🔍 검색 기능

-   실시간 검색 다이얼로그 (`Ctrl+K`)
-   제목, 내용, 태그 전체 검색
-   검색어 하이라이팅
-   고급 필터링 및 정렬

### ❤️ 좋아요 시스템

-   포스트별 좋아요 기능
-   로컬 스토리지 기반 사용자 상태 관리
-   부드러운 애니메이션 효과
-   접근성 지원

### 💬 댓글 시스템

-   댓글 작성 및 답글 기능
-   실시간 업데이트
-   폼 유효성 검사

### 📝 포스트 관리

-   마크다운 기반 콘텐츠
-   코드 하이라이팅
-   카테고리 및 태그 분류
-   관련 포스트 추천

### 🎨 컴포넌트 시스템

-   재사용 가능한 PostCard 컴포넌트
-   다양한 변형 (Featured, Compact, Related)
-   shadcn/ui 기반 디자인 시스템

## 🛠️ 설치 및 실행

1. **저장소 클론**

```bash
git clone https://github.com/pyy0514/202058128blog.git
cd 202058128blog
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**
   `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Clerk 인증
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase 데이터베이스
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **데이터베이스 설정**
   Supabase 대시보드에서 다음 스크립트들을 순서대로 실행하세요:
   - `docs/database-schema.sql` - 기본 스키마 생성
   - `docs/reset-about-page.sql` - About 페이지 테이블 생성
   - `docs/update-personal-info.sql` - 개인 정보 초기화

5. **개발 서버 실행**

```bash
npm run dev
```

## 🔧 트러블슈팅

### 404 에러 해결

페이지 로드 시 404 에러가 발생하는 경우:

#### 1. 이미지 404 에러

-   존재하지 않는 이미지 URL로 인한 에러
-   자동으로 placeholder 이미지로 대체됨
-   필요시 `scripts/clean-database.sql` 실행하여 잘못된 이미지 URL 정리

#### 2. site.webmanifest 404 에러

-   ✅ 이미 해결됨: `public/site.webmanifest` 파일 생성 완료

#### 3. 잘못된 게시물 데이터

데이터베이스에 테스트 데이터가 남아있는 경우, Supabase SQL Editor에서 다음 스크립트 실행:

```sql
-- 현재 게시물 확인
SELECT id, title, slug, cover_image_url FROM posts ORDER BY created_at DESC;

-- 잘못된 게시물 제거
DELETE FROM posts
WHERE
  title LIKE '%새 게시물 작성%'
  OR title LIKE '%test%'
  OR title LIKE '%가이드%';

-- 잘못된 이미지 URL 정리
UPDATE posts
SET cover_image_url = NULL
WHERE
  cover_image_url IS NOT NULL
  AND (
    cover_image_url LIKE '%example.com%'
    OR cover_image_url LIKE '%placeholder%'
    OR cover_image_url LIKE '%localhost%'
  );
```

#### 4. 개발 중 캐시 문제

```bash
# Next.js 캐시 정리
rm -rf .next
npm run dev

# 브라우저 캐시도 강제 새로고침 (Cmd+Shift+R)
```

## 📁 프로젝트 구조

```
├── app/                 # Next.js App Router
│   ├── about/          # About 페이지 (동적 관리)
│   │   ├── page.tsx    # 메인 About 페이지
│   │   └── edit/       # About 편집 페이지
│   ├── auth/           # 인증 관련 페이지
│   ├── admin/          # 관리자 페이지
│   ├── api/            # API 라우트
│   │   ├── about/      # About 페이지 API
│   │   ├── posts/      # 포스트 API
│   │   ├── comments/   # 댓글 API
│   │   └── likes/      # 좋아요 API
│   ├── posts/          # 블로그 포스트 페이지
│   └── categories/     # 카테고리 페이지
├── components/         # 재사용 가능한 컴포넌트
│   ├── about/          # About 관련 컴포넌트
│   ├── blog/           # 블로그 관련 컴포넌트
│   ├── common/         # 공통 컴포넌트 (Header, Footer)
│   ├── ui/             # UI 컴포넌트 (shadcn/ui)
│   └── admin/          # 관리자 컴포넌트
├── lib/                # 유틸리티 함수 및 설정
├── types/              # TypeScript 타입 정의
├── docs/               # 문서 및 스키마
│   ├── reset-about-page.sql      # About 페이지 DB 스크립트
│   └── update-personal-info.sql  # 개인정보 업데이트 스크립트
├── scripts/            # 데이터베이스 관리 스크립트
└── public/             # 정적 파일
    ├── default-avatar.png        # 기본 아바타
    └── *.jpg                     # 업로드된 이미지들
```

## 🔐 인증 시스템

Clerk를 사용한 사용자 인증:

-   이메일/비밀번호 로그인
-   소셜 로그인 (Google, GitHub 등)
-   보호된 관리자 페이지
-   Supabase RLS와 연동

## 📝 포스트 작성

1. 관리자 권한으로 로그인
2. `/admin/posts/new`에서 새 포스트 작성
3. 마크다운 문법 지원
4. 카테고리 선택
5. 커버 이미지 업로드 (선택사항)
6. 미리보기 기능

## 👤 About 페이지 관리

1. `/about`에서 About 페이지 확인
2. 관리자 권한으로 `/about/edit`에서 편집
3. 마크다운으로 풍부한 콘텐츠 작성
4. 실시간 미리보기 지원

## 🌟 개인화 요소

### 브랜딩
- **블로그명**: "윤영의 개발일기"
- **로고**: 그라데이션 원형 아바타 "박"
- **컬러**: 파란색-보라색 그라데이션 테마

### 개인 정보
- **이름**: 박윤영
- **학교**: 한신대학교 컴퓨터공학과 4학년
- **GitHub**: [yun0-0514](https://github.com/yun0-0514)
- **Notion**: 포트폴리오 페이지 연동
- **이메일**: parkyunyoung@hanmail.net

### 기술 스택 표시
- React, Next.js, Python, Java
- 푸터에 미니 뱃지로 표시
- 학습 중인 기술들 강조

## 🎨 커스터마이징

### 테마 색상

`tailwind.config.ts`에서 색상 팔레트 수정 가능

### 컴포넌트 스타일

`components/` 폴더의 각 컴포넌트에서 스타일 커스터마이징

## 📚 참고 자료

-   [Next.js 문서](https://nextjs.org/docs)
-   [Clerk 문서](https://clerk.com/docs)
-   [Supabase 문서](https://supabase.com/docs)
-   [Tailwind CSS](https://tailwindcss.com/docs)
-   [shadcn/ui](https://ui.shadcn.com/)

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

MIT License - 자세한 내용은 `LICENSE` 파일을 확인하세요.

## 📞 연락처

**박윤영 (Park Yun Young)**
- 🎓 한신대학교 컴퓨터공학과 4학년
- 💻 풀스택 개발자 지망생
- 📧 Email: [parkyunyoung@hanmail.net](mailto:parkyunyoung@hanmail.net)
- 🐙 GitHub: [yun0-0514](https://github.com/yun0-0514)
- 📑 Notion: [포트폴리오](https://www.notion.so/1bb41dfe9493806f83c7e98a60985aef)
- 🔗 블로그: [https://github.com/pyy0514/202058128blog](https://github.com/pyy0514/202058128blog)

---

⭐ 주니어 개발자의 성장 여정을 함께 응원해주세요!
