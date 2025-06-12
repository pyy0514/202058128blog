-- ========================================
-- 개인 정보 업데이트 스크립트
-- 작성일: 2025-01-27
-- 목적: GitHub 및 Notion 주소를 실제 값으로 업데이트
-- ========================================

-- 현재 about_page 테이블의 GitHub 및 Notion 정보 업데이트
UPDATE about_page 
SET 
    github_url = 'https://github.com/yun0-0514',
    github_username = '@yun0-0514',
    notion_url = 'https://www.notion.so/1bb41dfe9493806f83c7e98a60985aef',
    updated_at = NOW()
WHERE id IN (SELECT id FROM about_page LIMIT 1);

-- 업데이트 결과 확인
SELECT 
    name,
    github_url,
    github_username,
    notion_url,
    email,
    updated_at
FROM about_page
WHERE id IN (SELECT id FROM about_page LIMIT 1);
