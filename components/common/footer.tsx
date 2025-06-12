/**
 * 블로그 푸터 컴포넌트
 * 박윤영의 개발일기 개인화 버전
 */

import Link from 'next/link';

// 푸터 네비게이션 링크 타입 정의
interface FooterLink {
  name: string;
  href: string;
  description: string;
}

// 푸터 네비게이션 링크들
const footerLinks: FooterLink[] = [
  { name: '소개', href: '/about', description: '개발자 박윤영 소개' },
  { name: '블로그', href: '/posts', description: '개발 학습 기록' },
  { name: '카테고리', href: '/categories', description: '주제별 글 모음' },
  { name: 'GitHub', href: 'https://github.com/yun0-0514', description: '프로젝트 코드 보기' },
];

export default function Footer() {
  // 현재 연도 자동 계산
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        
        {/* 메인 푸터 콘텐츠 - 반응형 2열/1열 레이아웃 */}
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          
          {/* 좌측: 브랜드 정보 및 저작권 */}
          <div className="flex flex-col items-center space-y-3 md:items-start">
            {/* 브랜드 로고 및 이름 */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                박
              </div>
              <div>
                <span className="font-bold text-lg">윤영의 개발일기</span>
                <p className="text-xs text-muted-foreground -mt-1">주니어 개발자의 성장 기록</p>
              </div>
            </div>
            
            {/* 저작권 정보 */}
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {currentYear} <span className="font-medium">박윤영</span>. Made with ❤️ and ☕
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                한신대학교 컴퓨터공학과 • 첫 개발 블로그 🌱
              </p>
            </div>
          </div>

          {/* 우측: 네비게이션 링크 및 기술 스택 */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            {/* 간단한 소개 */}
            <div className="text-center md:text-right text-sm text-muted-foreground max-w-xs">
              <p>💻 풀스택 개발자를 꿈꾸는</p>
              <p>🎓 컴퓨터공학과 4학년 재학생</p>
            </div>
            
            {/* 기술 스택 미니 뱃지 */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              {['React', 'Next.js', 'Python', 'Java'].map((tech) => (
                <span key={tech} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  {tech}
                </span>
              ))}
            </div>
            
            <nav className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors focus:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  title={link.description}
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {/* 연락처 정보 */}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <Link 
                href="mailto:parkyunyoung@hanmail.net" 
                className="hover:text-blue-600 transition-colors"
                title="이메일 문의"
              >
                📧 Email
              </Link>
              <span>•</span>
              <Link 
                href="https://www.notion.so/1bb41dfe9493806f83c7e98a60985aef" 
                className="hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                title="포트폴리오 보기"
              >
                📑 Notion
              </Link>
            </div>
          </div>
        </div>

        {/* 하단 구분선 및 추가 정보 */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col items-center space-y-3 text-center">
            <p className="text-xs text-muted-foreground">
              🚀 이 블로그는 <span className="font-medium">Next.js 15</span>, <span className="font-medium">Supabase</span>, <span className="font-medium">Clerk</span>로 만들어졌습니다.
            </p>
            <p className="text-xs text-muted-foreground">
              📚 학습 과정과 프로젝트 경험을 기록하며 성장하는 주니어 개발자의 이야기
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}