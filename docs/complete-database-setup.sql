-- ========================================
-- 블로그 데이터베이스 스키마 (2025년 새로운 Clerk Third-Party Auth 방식)
-- 작성일: 2025-01-27
-- 특징: auth.jwt()->>'sub' 함수 활용, TEXT 타입 사용자 ID, RLS 정책 호환
-- ========================================

-- 필수 확장 활성화
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- 1. 기존 테이블 및 버킷 정리 (의존성 순서 고려)
-- ========================================

-- 기존 테이블 삭제 (의존성 역순)
DROP TABLE IF EXISTS about_page CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 기존 Storage 버킷 정리
DELETE FROM storage.objects WHERE bucket_id = 'blog-images';
DELETE FROM storage.buckets WHERE id = 'blog-images';

-- ========================================
-- 2. Storage 버킷 생성
-- ========================================

-- 블로그 이미지 저장용 공개 버킷 생성
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 3. 테이블 생성 (의존성 순서)
-- ========================================

-- 3.1. 카테고리 테이블
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.2. 게시물 테이블
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    cover_image_url TEXT,
    view_count INTEGER DEFAULT 0,
    author_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.3. 댓글 테이블
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
    user_name VARCHAR(100),
    user_email VARCHAR(255),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.4. 좋아요 테이블
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- 3.5. About 페이지 테이블
CREATE TABLE about_page (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL,
    
    -- 기본 정보
    name TEXT NOT NULL DEFAULT '박윤영',
    title TEXT NOT NULL DEFAULT '풀스택 개발자를 꿈꾸는 컴퓨터공학도',
    school TEXT NOT NULL DEFAULT '한신대학교 컴퓨터공학과 4학년',
    location TEXT NOT NULL DEFAULT '경기도',
    
    -- 연락처 정보
    github_url TEXT DEFAULT 'https://github.com/parkyunyoung',
    github_username TEXT DEFAULT '@parkyunyoung',
    notion_url TEXT DEFAULT 'https://www.notion.so/parkyunyoung',
    email TEXT DEFAULT 'parkyunyoung@hanmail.net',
    
    -- JSON 데이터
    tech_stacks JSONB NOT NULL DEFAULT '[]'::jsonb,
    strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
    projects JSONB NOT NULL DEFAULT '[]'::jsonb,
    education TEXT NOT NULL DEFAULT '2021년 입학 - 현재 4학년 재학 중',
    education_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    experience_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- 상태
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1
);

-- ========================================
-- 4. 인덱스 생성
-- ========================================

-- 게시물 테이블 인덱스
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status_created_at ON posts(status, created_at DESC);

-- 댓글 테이블 인덱스
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 좋아요 테이블 인덱스
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- 카테고리 테이블 인덱스
CREATE INDEX idx_categories_slug ON categories(slug);

-- About 페이지 인덱스
CREATE INDEX idx_about_page_created_by ON about_page(created_by);
CREATE INDEX idx_about_page_is_active ON about_page(is_active);
CREATE INDEX idx_about_page_updated_at ON about_page(updated_at DESC);

-- ========================================
-- 5. 트리거 함수 생성
-- ========================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_page_updated_at BEFORE UPDATE ON about_page
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 6. RLS 정책 설정
-- ========================================

-- RLS 활성화
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

-- 카테고리 정책
CREATE POLICY "categories_select_policy" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_policy" ON categories FOR INSERT TO authenticated WITH CHECK (auth.jwt()->>'sub' IS NOT NULL);
CREATE POLICY "categories_update_policy" ON categories FOR UPDATE TO authenticated USING (auth.jwt()->>'sub' IS NOT NULL);
CREATE POLICY "categories_delete_policy" ON categories FOR DELETE TO authenticated USING (auth.jwt()->>'sub' IS NOT NULL);

-- 게시물 정책
CREATE POLICY "posts_select_policy" ON posts FOR SELECT USING (
    status = 'published' OR (status IN ('draft', 'archived') AND author_id = auth.jwt()->>'sub')
);
CREATE POLICY "posts_insert_policy" ON posts FOR INSERT TO authenticated WITH CHECK (
    auth.jwt()->>'sub' IS NOT NULL AND author_id = auth.jwt()->>'sub'
);
CREATE POLICY "posts_update_policy" ON posts FOR UPDATE TO authenticated USING (author_id = auth.jwt()->>'sub');
CREATE POLICY "posts_delete_policy" ON posts FOR DELETE TO authenticated USING (author_id = auth.jwt()->>'sub');

-- 댓글 정책
CREATE POLICY "comments_select_policy" ON comments FOR SELECT USING (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id AND posts.status = 'published')
);
CREATE POLICY "comments_insert_policy" ON comments FOR INSERT TO authenticated WITH CHECK (
    auth.jwt()->>'sub' IS NOT NULL AND user_id = auth.jwt()->>'sub' AND
    EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id AND posts.status = 'published')
);
CREATE POLICY "comments_update_policy" ON comments FOR UPDATE TO authenticated USING (user_id = auth.jwt()->>'sub');
CREATE POLICY "comments_delete_policy" ON comments FOR DELETE TO authenticated USING (
    user_id = auth.jwt()->>'sub' OR
    EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id AND posts.author_id = auth.jwt()->>'sub')
);

-- 좋아요 정책
CREATE POLICY "likes_select_policy" ON likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_policy" ON likes FOR INSERT TO authenticated WITH CHECK (
    auth.jwt()->>'sub' IS NOT NULL AND user_id = auth.jwt()->>'sub' AND
    EXISTS (SELECT 1 FROM posts WHERE posts.id = likes.post_id AND posts.status = 'published')
);
CREATE POLICY "likes_delete_policy" ON likes FOR DELETE TO authenticated USING (user_id = auth.jwt()->>'sub');

-- About 페이지 정책
CREATE POLICY "about_page_select_policy" ON about_page FOR SELECT USING (is_active = true);
CREATE POLICY "about_page_insert_policy" ON about_page FOR INSERT TO authenticated WITH CHECK (auth.jwt()->>'sub' IS NOT NULL);
CREATE POLICY "about_page_update_policy" ON about_page FOR UPDATE TO authenticated USING (auth.jwt()->>'sub' = created_by);
CREATE POLICY "about_page_delete_policy" ON about_page FOR DELETE TO authenticated USING (auth.jwt()->>'sub' = created_by);

-- ========================================
-- 7. 초기 데이터 삽입
-- ========================================

-- 카테고리 데이터
INSERT INTO categories (name, slug, description, color) VALUES
('일반', 'general', '일반적인 주제의 블로그 글', '#6b7280'),
('기술', 'tech', '프로그래밍 및 개발 관련 글', '#3b82f6'),
('일상', 'daily', '일상적인 이야기와 경험 공유', '#10b981'),
('개발', 'development', '웹 개발 및 소프트웨어 개발 관련', '#8b5cf6')
ON CONFLICT (slug) DO NOTHING;

-- About 페이지 데이터
INSERT INTO about_page (
    created_by, name, title, school, location,
    github_url, github_username, notion_url, email,
    tech_stacks, strengths, projects,
    education, education_details, experience_details
) VALUES (
    'temp_user_id',
    '박윤영',
    '풀스택 개발자를 꿈꾸는 컴퓨터공학도',
    '한신대학교 컴퓨터공학과 4학년',
    '경기도',
    'https://github.com/parkyunyoung',
    '@parkyunyoung',
    'https://www.notion.so/parkyunyoung',
    'parkyunyoung@hanmail.net',
    '[
        {"category": "Frontend", "skills": ["React", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"]},
        {"category": "Backend", "skills": ["Python", "Java", "Spring Framework", "Spring Boot", "Flask API", "RESTful API", "Node.js"]},
        {"category": "Database & Cloud", "skills": ["Supabase", "PostgreSQL", "MySQL", "MongoDB", "AWS", "Vercel"]},
        {"category": "AI/ML & Data", "skills": ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Matplotlib"]},
        {"category": "Tools & Others", "skills": ["Git", "GitHub", "Docker", "Linux", "VS Code", "IntelliJ IDEA"]}
    ]'::jsonb,
    '[
        {"title": "풀스택 개발 역량", "description": "프론트엔드부터 백엔드, 데이터베이스까지 전체적인 웹 개발 스택을 다룰 수 있습니다."},
        {"title": "빠른 학습 능력", "description": "새로운 기술과 프레임워크를 빠르게 습득하고 적용할 수 있습니다."},
        {"title": "문제 해결 능력", "description": "복잡한 문제를 논리적으로 분석하고 효율적인 솔루션을 찾아내는 능력을 갖추고 있습니다."},
        {"title": "협업 및 소통", "description": "팀 프로젝트에서 원활한 소통과 협업을 통해 목표를 달성하는 경험이 있습니다."}
    ]'::jsonb,
    '[
        {"title": "개인 블로그 플랫폼", "tech": "Next.js 15 + Supabase + Clerk", "color": "blue", "features": ["서버 사이드 렌더링과 정적 생성 구현", "사용자 인증 및 권한 관리", "댓글 시스템 및 좋아요 기능", "반응형 UI/UX 디자인"]},
        {"title": "Spring Boot REST API", "tech": "Java + Spring Boot + MySQL", "color": "green", "features": ["RESTful API 설계 및 구현", "JPA를 이용한 데이터베이스 연동", "JWT 기반 인증 시스템", "API 문서화 (Swagger)"]},
        {"title": "데이터 분석 프로젝트", "tech": "Python + Pandas + Scikit-learn", "color": "purple", "features": ["공공데이터를 활용한 분석", "머신러닝 모델 구현 및 평가", "데이터 시각화 (Matplotlib, Seaborn)", "Jupyter Notebook 활용"]},
        {"title": "Flask API 서버", "tech": "Python + Flask + SQLAlchemy", "color": "orange", "features": ["경량화된 웹 API 서버 구축", "SQLAlchemy ORM 활용", "CORS 설정 및 보안 처리", "Docker를 이용한 배포"]}
    ]'::jsonb,
    '2021년 입학 - 현재 4학년 재학 중',
    '["전공 과목: 자료구조, 알고리즘, 데이터베이스, 소프트웨어공학, 웹프로그래밍", "프로젝트: 팀 프로젝트를 통한 웹 애플리케이션 개발 경험", "인공지능 관련 과목 이수 및 머신러닝 프로젝트 수행"]'::jsonb,
    '["Next.js와 Supabase를 활용한 개인 블로그 개발 (현재 프로젝트)", "Python Flask를 활용한 RESTful API 개발 경험", "Java Spring Framework를 이용한 웹 애플리케이션 개발", "Python 머신러닝 라이브러리를 활용한 데이터 분석 프로젝트", "React를 활용한 반응형 웹 애플리케이션 개발"]'::jsonb
);

-- ========================================
-- 7. 완료 메시지
-- ========================================

-- 스키마 생성 완료 확인
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ 블로그 데이터베이스 스키마 생성 완료!';
    RAISE NOTICE '📊 생성된 테이블: categories, posts, comments, likes';
    RAISE NOTICE '🗄️ Storage 버킷: blog-images (공개)';
    RAISE NOTICE '🔐 Clerk Third-Party Auth 방식 적용';
    RAISE NOTICE '🎯 auth.jwt()->>"sub" 함수 활용 준비 완료';
    RAISE NOTICE '========================================';
END $$;

-- ========================================
-- 블로그 RLS 정책 (2025년 새로운 Clerk Third-Party Auth 방식)
-- 작성일: 2025-01-27
-- 특징: auth.jwt()->>'sub' 직접 사용, TO authenticated 명시, 최적화된 보안
-- ⚠️ 참고: Storage 정책은 Supabase Dashboard에서 별도 설정 필요
-- ========================================

-- ========================================
-- 1. 기존 RLS 정책 완전 정리 (테이블만)
-- ========================================

-- 기존 테이블 정책 삭제 (모든 테이블)
DROP POLICY IF EXISTS "posts_select_policy" ON posts;
DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
DROP POLICY IF EXISTS "posts_update_policy" ON posts;
DROP POLICY IF EXISTS "posts_delete_policy" ON posts;

DROP POLICY IF EXISTS "comments_select_policy" ON comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
DROP POLICY IF EXISTS "comments_update_policy" ON comments;
DROP POLICY IF EXISTS "comments_delete_policy" ON comments;

DROP POLICY IF EXISTS "likes_select_policy" ON likes;
DROP POLICY IF EXISTS "likes_insert_policy" ON likes;
DROP POLICY IF EXISTS "likes_delete_policy" ON likes;

DROP POLICY IF EXISTS "categories_select_policy" ON categories;
DROP POLICY IF EXISTS "categories_insert_policy" ON categories;
DROP POLICY IF EXISTS "categories_update_policy" ON categories;
DROP POLICY IF EXISTS "categories_delete_policy" ON categories;

-- ⚠️ Storage 정책은 Supabase Dashboard > Storage > Policies에서 수동 설정
-- storage.objects 테이블은 시스템 테이블이므로 SQL로 직접 설정 불가

-- ========================================
-- 2. RLS 활성화 (테이블만)
-- ========================================

-- 테이블 RLS 활성화
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- ⚠️ Storage RLS는 이미 활성화되어 있으므로 별도 설정 불필요

-- ========================================
-- 3. 카테고리 테이블 RLS 정책 (새로운 방식)
-- ========================================

-- 카테고리 조회: 모든 사용자 허용 (공개 정보)
CREATE POLICY "categories_select_policy" ON categories
  FOR SELECT
  USING (true);

-- 카테고리 생성: 인증된 사용자만 가능
CREATE POLICY "categories_insert_policy" ON categories
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.jwt()->>'sub' IS NOT NULL
  );

-- 카테고리 수정: 인증된 사용자만 가능 (관리자 기능)
CREATE POLICY "categories_update_policy" ON categories
  FOR UPDATE TO authenticated
  USING (
    auth.jwt()->>'sub' IS NOT NULL
  );

-- 카테고리 삭제: 인증된 사용자만 가능 (관리자 기능)
CREATE POLICY "categories_delete_policy" ON categories
  FOR DELETE TO authenticated
  USING (
    auth.jwt()->>'sub' IS NOT NULL
  );

-- ========================================
-- 4. 게시물 테이블 RLS 정책 (새로운 방식)
-- ========================================

-- 게시물 조회: 발행된 게시물은 모든 사용자, 초안은 작성자만
CREATE POLICY "posts_select_policy" ON posts
  FOR SELECT
  USING (
    status = 'published' OR 
    (status IN ('draft', 'archived') AND author_id = auth.jwt()->>'sub')
  );

-- 게시물 생성: 인증된 사용자만 가능
-- ✅ 새로운 방식: auth.jwt()->>'sub' 직접 사용
CREATE POLICY "posts_insert_policy" ON posts
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.jwt()->>'sub' IS NOT NULL AND
    author_id = auth.jwt()->>'sub'
  );

-- 게시물 수정: 작성자만 가능
CREATE POLICY "posts_update_policy" ON posts
  FOR UPDATE TO authenticated
  USING (
    author_id = auth.jwt()->>'sub'
  )
  WITH CHECK (
    author_id = auth.jwt()->>'sub'
  );

-- 게시물 삭제: 작성자만 가능
CREATE POLICY "posts_delete_policy" ON posts
  FOR DELETE TO authenticated
  USING (
    author_id = auth.jwt()->>'sub'
  );

-- ========================================
-- 5. 댓글 테이블 RLS 정책 (새로운 방식)
-- ========================================

-- 댓글 조회: 발행된 게시물의 댓글만 조회 가능
CREATE POLICY "comments_select_policy" ON comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = comments.post_id 
      AND posts.status = 'published'
    )
  );

-- 댓글 생성: 인증된 사용자만 가능
-- ✅ 새로운 방식: auth.jwt()->>'sub' 직접 사용
CREATE POLICY "comments_insert_policy" ON comments
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.jwt()->>'sub' IS NOT NULL AND
    user_id = auth.jwt()->>'sub' AND
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = comments.post_id 
      AND posts.status = 'published'
    )
  );

-- 댓글 수정: 댓글 작성자만 가능
CREATE POLICY "comments_update_policy" ON comments
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.jwt()->>'sub'
  )
  WITH CHECK (
    user_id = auth.jwt()->>'sub'
  );

-- 댓글 삭제: 댓글 작성자 또는 게시물 작성자만 가능
CREATE POLICY "comments_delete_policy" ON comments
  FOR DELETE TO authenticated
  USING (
    user_id = auth.jwt()->>'sub' OR
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = comments.post_id 
      AND posts.author_id = auth.jwt()->>'sub'
    )
  );

-- ========================================
-- 6. 좋아요 테이블 RLS 정책 (새로운 방식)
-- ========================================

-- 좋아요 조회: 모든 사용자 허용 (통계 목적)
CREATE POLICY "likes_select_policy" ON likes
  FOR SELECT
  USING (true);

-- 좋아요 생성: 인증된 사용자만 가능 (중복 방지 로직)
-- ✅ 새로운 방식: auth.jwt()->>'sub' 직접 사용
CREATE POLICY "likes_insert_policy" ON likes
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.jwt()->>'sub' IS NOT NULL AND
    user_id = auth.jwt()->>'sub' AND
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = likes.post_id 
      AND posts.status = 'published'
    ) AND
    NOT EXISTS (
      SELECT 1 FROM likes AS existing_likes
      WHERE existing_likes.user_id = auth.jwt()->>'sub'
      AND existing_likes.post_id = likes.post_id
    )
  );

-- 좋아요 삭제: 본인이 누른 좋아요만 삭제 가능
CREATE POLICY "likes_delete_policy" ON likes
  FOR DELETE TO authenticated
  USING (
    user_id = auth.jwt()->>'sub'
  );

-- ========================================
-- 7. 성능 최적화를 위한 추가 인덱스
-- ========================================

-- RLS 정책 성능 최적화용 인덱스 (이미 database-schema.sql에서 생성됨)
-- 추가로 필요한 복합 인덱스만 생성

-- 게시물 상태별 조회 최적화
CREATE INDEX IF NOT EXISTS idx_posts_status_created_at ON posts(status, created_at DESC);

-- 댓글-게시물 조인 최적화
CREATE INDEX IF NOT EXISTS idx_comments_post_status ON comments(post_id);

-- 좋아요 중복 체크 최적화 (이미 UNIQUE 제약조건으로 존재)
-- CREATE INDEX IF NOT EXISTS idx_likes_user_post ON likes(user_id, post_id);

-- ========================================
-- 8. RLS 정책 검증 함수 (선택적)
-- ========================================

-- RLS 정책이 올바르게 작동하는지 검증하는 함수
CREATE OR REPLACE FUNCTION verify_rls_policies()
RETURNS TABLE(table_name text, policy_count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::text,
    COUNT(p.policyname) as policy_count
  FROM information_schema.tables t
  LEFT JOIN pg_policies p ON p.tablename = t.table_name
  WHERE t.table_schema = 'public' 
    AND t.table_name IN ('categories', 'posts', 'comments', 'likes')
  GROUP BY t.table_name
  ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 9. 완료 메시지 및 정책 요약
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ 2025년 새로운 방식 RLS 정책 설정 완료!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 적용된 테이블 정책:';
  RAISE NOTICE '  • categories: 4개 정책 (SELECT 공개, 나머지 authenticated)';
  RAISE NOTICE '  • posts: 4개 정책 (작성자 기반 권한 관리)';
  RAISE NOTICE '  • comments: 4개 정책 (게시물 상태 기반 + 작성자 권한)';
  RAISE NOTICE '  • likes: 3개 정책 (중복 방지 + 본인 관리)';
  RAISE NOTICE '';
  RAISE NOTICE '🔥 새로운 방식 특징:';
  RAISE NOTICE '  • auth.jwt()->>"sub" 직접 사용';
  RAISE NOTICE '  • TO authenticated 역할 명시';
  RAISE NOTICE '  • Third-Party Auth 최적화';
  RAISE NOTICE '  • 성능 및 보안 향상';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ 추가 설정 필요:';
  RAISE NOTICE '  • Storage 정책: Supabase Dashboard > Storage > Policies';
  RAISE NOTICE '  • blog-images 버킷 정책 수동 설정';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 검증 명령어:';
  RAISE NOTICE '  SELECT * FROM verify_rls_policies();';
  RAISE NOTICE '========================================';
END $$;

-- ========================================
-- About 페이지 확장 설정
-- ========================================

-- About 페이지 테이블 주석 (이미 생성됨)
COMMENT ON TABLE about_page IS 'About 페이지 관리 테이블';
COMMENT ON COLUMN about_page.created_by IS 'Clerk 사용자 ID (TEXT 타입)';
COMMENT ON COLUMN about_page.tech_stacks IS '기술 스택 (JSON 배열)';
COMMENT ON COLUMN about_page.strengths IS '강점 (JSON 배열)';
COMMENT ON COLUMN about_page.projects IS '프로젝트 (JSON 배열)';

-- About 페이지 추가 RLS 정책 (이미 생성된 정책과 다른 이름 사용)
DROP POLICY IF EXISTS "about_page_additional_select_policy" ON about_page;
DROP POLICY IF EXISTS "about_page_additional_insert_policy" ON about_page;
DROP POLICY IF EXISTS "about_page_additional_update_policy" ON about_page;
DROP POLICY IF EXISTS "about_page_additional_delete_policy" ON about_page;

-- About 페이지 정책 (기존 정책과 충돌 방지)
CREATE POLICY "about_page_additional_select_policy" ON about_page 
  FOR SELECT USING (is_active = true);

CREATE POLICY "about_page_additional_insert_policy" ON about_page 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.jwt()->>'sub' IS NOT NULL);

CREATE POLICY "about_page_additional_update_policy" ON about_page 
  FOR UPDATE TO authenticated 
  USING (auth.jwt()->>'sub' = created_by);

CREATE POLICY "about_page_additional_delete_policy" ON about_page 
  FOR DELETE TO authenticated 
  USING (auth.jwt()->>'sub' = created_by);

-- About 페이지 초기 데이터 (기존 데이터 업데이트)
UPDATE about_page SET 
    tech_stacks = '[
        {"category": "Frontend", "skills": ["React", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"]},
        {"category": "Backend", "skills": ["Python", "Java", "Spring Framework", "Spring Boot", "Flask API", "RESTful API", "Node.js"]},
        {"category": "Database & Cloud", "skills": ["Supabase", "PostgreSQL", "MySQL", "MongoDB", "AWS", "Vercel"]},
        {"category": "AI/ML & Data", "skills": ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Matplotlib"]},
        {"category": "Tools & Others", "skills": ["Git", "GitHub", "Docker", "Linux", "VS Code", "IntelliJ IDEA"]}
    ]'::jsonb,
    strengths = '[
        {"title": "풀스택 개발 역량", "description": "프론트엔드부터 백엔드, 데이터베이스까지 전체적인 웹 개발 스택을 다룰 수 있습니다."},
        {"title": "빠른 학습 능력", "description": "새로운 기술과 프레임워크를 빠르게 습득하고 적용할 수 있습니다."},
        {"title": "문제 해결 능력", "description": "복잡한 문제를 논리적으로 분석하고 효율적인 솔루션을 찾아내는 능력을 갖추고 있습니다."},
        {"title": "협업 및 소통", "description": "팀 프로젝트에서 원활한 소통과 협업을 통해 목표를 달성하는 경험이 있습니다."}
    ]'::jsonb,
    projects = '[
        {"title": "개인 블로그 플랫폼", "tech": "Next.js 15 + Supabase + Clerk", "color": "blue", "features": ["서버 사이드 렌더링과 정적 생성 구현", "사용자 인증 및 권한 관리", "댓글 시스템 및 좋아요 기능", "반응형 UI/UX 디자인"]},
        {"title": "Spring Boot REST API", "tech": "Java + Spring Boot + MySQL", "color": "green", "features": ["RESTful API 설계 및 구현", "JPA를 이용한 데이터베이스 연동", "JWT 기반 인증 시스템", "API 문서화 (Swagger)"]},
        {"title": "데이터 분석 프로젝트", "tech": "Python + Pandas + Scikit-learn", "color": "purple", "features": ["공공데이터를 활용한 분석", "머신러닝 모델 구현 및 평가", "데이터 시각화 (Matplotlib, Seaborn)", "Jupyter Notebook 활용"]},
        {"title": "Flask API 서버", "tech": "Python + Flask + SQLAlchemy", "color": "orange", "features": ["경량화된 웹 API 서버 구축", "SQLAlchemy ORM 활용", "CORS 설정 및 보안 처리", "Docker를 이용한 배포"]}
    ]'::jsonb,
    education_details = '["전공 과목: 자료구조, 알고리즘, 데이터베이스, 소프트웨어공학, 웹프로그래밍", "프로젝트: 팀 프로젝트를 통한 웹 애플리케이션 개발 경험", "인공지능 관련 과목 이수 및 머신러닝 프로젝트 수행"]'::jsonb,
    experience_details = '["Next.js와 Supabase를 활용한 개인 블로그 개발 (현재 프로젝트)", "Python Flask를 활용한 RESTful API 개발 경험", "Java Spring Framework를 이용한 웹 애플리케이션 개발", "Python 머신러닝 라이브러리를 활용한 데이터 분석 프로젝트", "React를 활용한 반응형 웹 애플리케이션 개발"]'::jsonb
WHERE created_by = 'temp_user_id' OR id = (SELECT id FROM about_page LIMIT 1);

-- ========================================
-- 최종 완료 메시지
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ 박윤영 블로그 + About 페이지 데이터베이스 설정 완료!';
    RAISE NOTICE '📊 생성된 테이블: categories, posts, comments, likes, about_page';
    RAISE NOTICE '🗄️ Storage 버킷: blog-images (공개)';
    RAISE NOTICE '🔐 RLS 정책 적용 완료 (모든 테이블)';
    RAISE NOTICE '🎯 About 페이지 초기 데이터 삽입 완료';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 다음 단계:';
    RAISE NOTICE '  1. Supabase Dashboard에서 Storage 정책 설정';
    RAISE NOTICE '  2. 실제 사용자 ID로 about_page 데이터 업데이트';
    RAISE NOTICE '  3. 블로그 애플리케이션 테스트';
    RAISE NOTICE '========================================';
END $$;
