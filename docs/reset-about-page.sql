-- ========================================
-- About 페이지 테이블 재설정 스크립트
-- 작성일: 2025-01-27
-- 특징: about_page 테이블만 드롭하고 새로 생성
-- ========================================

-- ========================================
-- 1. about_page 테이블 완전 삭제
-- ========================================

-- 기존 about_page 테이블 삭제
DROP TABLE IF EXISTS about_page CASCADE;

-- ========================================
-- 2. about_page 테이블 생성
-- ========================================

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
    github_url TEXT DEFAULT 'https://github.com/yun0-0514',
    github_username TEXT DEFAULT '@yun0-0514',
    notion_url TEXT DEFAULT 'https://www.notion.so/1bb41dfe9493806f83c7e98a60985aef',
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
-- 3. 인덱스 생성
-- ========================================

CREATE INDEX idx_about_page_created_by ON about_page(created_by);
CREATE INDEX idx_about_page_is_active ON about_page(is_active);
CREATE INDEX idx_about_page_updated_at ON about_page(updated_at DESC);

-- ========================================
-- 4. 트리거 설정
-- ========================================

-- updated_at 자동 업데이트 함수 (있다면 재사용, 없으면 생성)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- about_page 트리거 적용
CREATE TRIGGER update_about_page_updated_at 
    BEFORE UPDATE ON about_page
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 5. RLS 정책 설정
-- ========================================

-- RLS 활성화
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

-- About 페이지 정책
CREATE POLICY "about_page_select_policy" ON about_page 
    FOR SELECT USING (is_active = true);

CREATE POLICY "about_page_insert_policy" ON about_page 
    FOR INSERT TO authenticated 
    WITH CHECK (auth.jwt()->>'sub' IS NOT NULL);

CREATE POLICY "about_page_update_policy" ON about_page 
    FOR UPDATE TO authenticated 
    USING (auth.jwt()->>'sub' = created_by);

CREATE POLICY "about_page_delete_policy" ON about_page 
    FOR DELETE TO authenticated 
    USING (auth.jwt()->>'sub' = created_by);

-- ========================================
-- 6. 테이블 주석
-- ========================================

COMMENT ON TABLE about_page IS 'About 페이지 관리 테이블';
COMMENT ON COLUMN about_page.created_by IS 'Clerk 사용자 ID (TEXT 타입)';
COMMENT ON COLUMN about_page.tech_stacks IS '기술 스택 (JSON 배열)';
COMMENT ON COLUMN about_page.strengths IS '강점 (JSON 배열)';
COMMENT ON COLUMN about_page.projects IS '프로젝트 (JSON 배열)';

-- ========================================
-- 7. 초기 데이터 삽입
-- ========================================

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
    'https://github.com/yun0-0514',
    '@yun0-0514',
    'https://www.notion.so/1bb41dfe9493806f83c7e98a60985aef',
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
-- 8. 완료 메시지
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ About 페이지 테이블 재설정 완료!';
    RAISE NOTICE '📊 테이블: about_page (새로 생성됨)';
    RAISE NOTICE '🔐 RLS 정책: 4개 정책 적용됨';
    RAISE NOTICE '🎯 초기 데이터: 풍부한 샘플 데이터 삽입됨';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 다음 단계:';
    RAISE NOTICE '  1. 실제 사용자 ID로 created_by 업데이트';
    RAISE NOTICE '  2. About 페이지 확인 및 편집 테스트';
    RAISE NOTICE '========================================';
END $$;
