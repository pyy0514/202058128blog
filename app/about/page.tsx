import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Github, 
  ExternalLink, 
  Code, 
  Database, 
  Server, 
  Smartphone,
  Brain,
  GraduationCap,
  Mail,
  MapPin,
  Edit
} from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import React from 'react';

// 타입 정의
interface TechStack {
  category: string;
  skills: string[];
}

interface Strength {
  title: string;
  description: string;
}

interface Project {
  title: string;
  tech: string;
  color: string;
  features: string[];
}

interface AboutData {
  id?: string;
  name: string;
  title: string;
  school: string;
  location: string;
  github_url: string;
  github_username: string;
  notion_url: string;
  email: string;
  tech_stacks: TechStack[];
  strengths: Strength[];
  projects: Project[];
  education: string;
  education_details: string[];
  experience_details: string[];
}

export const metadata: Metadata = {
  title: '소개 | 박윤영의 개발 블로그',
  description: '한신대학교 컴퓨터공학과 재학생 박윤영의 기술 스택과 경험을 소개합니다.',
};

// 소개 페이지 데이터 가져오기 함수
async function getAboutData(): Promise<AboutData> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: aboutData, error } = await supabase
      .from('about_page')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('소개 페이지 조회 오류:', error);
      throw error;
    }

    // 데이터가 있으면 반환
    if (aboutData) {
      return {
        id: aboutData.id,
        name: aboutData.name || '박윤영',
        title: aboutData.title || '풀스택 개발자를 꿈꾸는 컴퓨터공학도',
        school: aboutData.school || '한신대학교 컴퓨터공학과 4학년',
        location: aboutData.location || '경기도',
        github_url: aboutData.github_url || 'https://github.com/yun0-0514',
        github_username: aboutData.github_username || '@yun0-0514',
        notion_url: aboutData.notion_url || 'https://www.notion.so/1bb41dfe9493806f83c7e98a60985aef',
        email: aboutData.email || 'parkyunyoung@hanmail.net',
        tech_stacks: aboutData.tech_stacks || [],
        strengths: aboutData.strengths || [],
        projects: aboutData.projects || [],
        education: aboutData.education || '2021년 입학 - 현재 4학년 재학 중',
        education_details: aboutData.education_details || [],
        experience_details: aboutData.experience_details || []
      };
    }
  } catch (error) {
    console.error('소개 데이터 로딩 오류:', error);
  }

  // 기본값 반환
  return {
    name: '박윤영',
    title: '풀스택 개발자를 꿈꾸는 컴퓨터공학도',
    school: '한신대학교 컴퓨터공학과 4학년',
    location: '경기도',
    github_url: 'https://github.com/yun0-0514',
    github_username: '@yun0-0514',
    notion_url: 'https://www.notion.so/1bb41dfe9493806f83c7e98a60985aef',
    email: 'parkyunyoung@hanmail.net',
    tech_stacks: [
      {
        category: 'Frontend',
        skills: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap']
      },
      {
        category: 'Backend',
        skills: ['Python', 'Java', 'Spring Framework', 'Spring Boot', 'Flask API', 'RESTful API', 'C언어', 'Node.js']
      },
      {
        category: 'Database & Cloud',
        skills: ['Supabase', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'AWS', 'Vercel']
      },
      {
        category: 'AI/ML & Data',
        skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter']
      },
      {
        category: 'Tools & Others',
        skills: ['Git', 'GitHub', 'Docker', 'Linux', 'VS Code', 'IntelliJ IDEA', 'Postman', 'Figma']
      }
    ],
    strengths: [
      {
        title: '풀스택 개발 역량',
        description: '프론트엔드부터 백엔드, 데이터베이스까지 전체적인 웹 개발 스택을 다룰 수 있습니다.'
      },
      {
        title: '빠른 학습 능력',
        description: '새로운 기술과 프레임워크를 빠르게 습득하고 적용할 수 있습니다.'
      },
      {
        title: '문제 해결 능력',
        description: '복잡한 문제를 논리적으로 분석하고 효율적인 솔루션을 찾아내는 능력을 갖추고 있습니다.'
      },
      {
        title: '협업 및 소통',
        description: '팀 프로젝트에서 원활한 소통과 협업을 통해 목표를 달성하는 경험이 있습니다.'
      }
    ],
    projects: [
      {
        title: '개인 블로그 플랫폼',
        tech: 'Next.js 15 + Supabase + Clerk',
        color: 'blue',
        features: [
          '서버 사이드 렌더링과 정적 생성 구현',
          '사용자 인증 및 권한 관리',
          '댓글 시스템 및 좋아요 기능',
          '반응형 UI/UX 디자인'
        ]
      },
      {
        title: 'Spring Boot REST API',
        tech: 'Java + Spring Boot + MySQL',
        color: 'green',
        features: [
          'RESTful API 설계 및 구현',
          'JPA를 이용한 데이터베이스 연동',
          'JWT 기반 인증 시스템',
          'API 문서화 (Swagger)'
        ]
      },
      {
        title: '데이터 분석 프로젝트',
        tech: 'Python + Pandas + Scikit-learn',
        color: 'purple',
        features: [
          '공공데이터를 활용한 분석',
          '머신러닝 모델 구현 및 평가',
          '데이터 시각화 (Matplotlib, Seaborn)',
          'Jupyter Notebook 활용'
        ]
      },
      {
        title: 'Flask API 서버',
        tech: 'Python + Flask + SQLAlchemy',
        color: 'orange',
        features: [
          '경량화된 웹 API 서버 구축',
          'SQLAlchemy ORM 활용',
          'CORS 설정 및 보안 처리',
          'Docker를 이용한 배포'
        ]
      }
    ],
    education: '2021년 입학 - 현재 4학년 재학 중',
    education_details: [
      '전공 과목: 자료구조, 알고리즘, 데이터베이스, 소프트웨어공학, 웹프로그래밍',
      '프로젝트: 팀 프로젝트를 통한 웹 애플리케이션 개발 경험',
      '인공지능 관련 과목 이수 및 머신러닝 프로젝트 수행'
    ],
    experience_details: [
      'Next.js와 Supabase를 활용한 개인 블로그 개발 (현재 프로젝트)',
      'Python Flask를 활용한 RESTful API 개발 경험',
      'Java Spring Framework를 이용한 웹 애플리케이션 개발',
      'Python 머신러닝 라이브러리를 활용한 데이터 분석 프로젝트',
      'React를 활용한 반응형 웹 애플리케이션 개발'
    ]
  };
}

export default async function AboutPage() {
  const { userId } = await auth();
  const aboutData = await getAboutData();
  const techStacks = aboutData.tech_stacks || [];
  const strengths = aboutData.strengths || [];
  const projects = aboutData.projects || [];

  // 프로젝트 색상 매핑
  const getProjectColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      orange: 'text-orange-600 dark:text-orange-400',
      red: 'text-red-600 dark:text-red-400'
    };
    return colorMap[color] || colorMap.blue;
  };

  // 아이콘 매핑
  const getCategoryIcon = (category: string): React.ReactElement => {
    const iconMap: Record<string, React.ReactElement> = {
      'Frontend': <Code className="w-5 h-5" />,
      'Backend': <Server className="w-5 h-5" />,
      'Database & Cloud': <Database className="w-5 h-5" />,
      'AI/ML & Data': <Brain className="w-5 h-5" />,
      'Tools & Others': <Smartphone className="w-5 h-5" />
    };
    return iconMap[category] || <Code className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* 편집 버튼 - 로그인한 사용자에게만 표시 */}
        {userId && (
          <div className="fixed top-20 right-4 z-50">
            <Button asChild>
              <Link href="/about/edit" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                편집
              </Link>
            </Button>
          </div>
        )}

        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
              {aboutData.name?.charAt(0) || '박'}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {aboutData.name || '박윤영'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {aboutData.title || '풀스택 개발자를 꿈꾸는 컴퓨터공학도'}
          </p>
          <div className="flex items-center justify-center gap-6 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span>{aboutData.school || '한신대학교 컴퓨터공학과 4학년'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{aboutData.location || '경기도'}</span>
            </div>
          </div>
        </div>

        {/* 연락처 및 링크 */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              연락처 & 링크
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                asChild
              >
                <a href={aboutData.github_url || 'https://github.com/yun0-0514'} target="_blank" rel="noopener noreferrer">
                  <Github className="w-6 h-6" />
                  <span className="font-medium">GitHub</span>
                  <span className="text-sm text-gray-500">{aboutData.github_username || '@yun0-0514'}</span>
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                asChild
              >
                <a href={aboutData.notion_url || 'https://www.notion.so/1bb41dfe9493806f83c7e98a60985aef'} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-6 h-6" />
                  <span className="font-medium">Notion</span>
                  <span className="text-sm text-gray-500">포트폴리오</span>
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                asChild
              >
                <a href={`mailto:${aboutData.email || 'parkyunyoung@hanmail.net'}`}>
                  <Mail className="w-6 h-6" />
                  <span className="font-medium">Email</span>
                  <span className="text-sm text-gray-500">연락하기</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 기술 스택 */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle>🛠️ 기술 스택</CardTitle>
            <CardDescription>
              현재까지 학습하고 경험한 기술들입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStacks.map((stack: TechStack, index: number) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {getCategoryIcon(stack.category)}
                    {stack.category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(stack.skills || []).map((skill: string, skillIndex: number) => (
                      <Badge 
                        key={skillIndex} 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 강점 및 특징 */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle>💪 강점 & 특징</CardTitle>
            <CardDescription>
              개발자로서의 강점과 특징을 소개합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strengths.map((strength: Strength, index: number) => (
                <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700">
                  <h3 className="font-semibold text-lg mb-2 text-purple-800 dark:text-purple-200">
                    {strength.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {strength.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 주요 프로젝트 */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle>🚀 주요 프로젝트</CardTitle>
            <CardDescription>
              학습과 경험을 위해 진행한 주요 프로젝트들입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project: Project, index: number) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <h3 className={`font-semibold text-lg mb-2 ${getProjectColorClass(project.color)}`}>
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {project.tech}
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {(project.features || []).map((feature: string, featureIndex: number) => (
                      <li key={featureIndex}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 학력 및 경험 */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle>🎓 학력 & 경험</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                  {aboutData.school || '한신대학교 컴퓨터공학과'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {aboutData.education || '2021년 입학 - 현재 4학년 재학 중'}
                </p>
                <div className="space-y-2">
                  {(aboutData.education_details || []).map((detail: string, index: number) => (
                    <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      • {detail}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                  개인 프로젝트 & 학습
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  지속적인 자기계발과 실무 경험 쌓기
                </p>
                <div className="space-y-2">
                  {(aboutData.experience_details || []).map((detail: string, index: number) => (
                    <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      • {detail}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 연락하기 CTA */}
        <Card className="text-center shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="py-8">
            <h2 className="text-2xl font-bold mb-4">함께 일하고 싶으시다면</h2>
            <p className="text-blue-100 mb-6">
              새로운 기회와 도전을 기다리고 있습니다. 언제든 연락 주세요!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                asChild
              >
                <a href={`mailto:${aboutData.email || 'parkyunyoung@hanmail.net'}`}>
                  <Mail className="w-5 h-5 mr-2" />
                  이메일 보내기
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <a href={aboutData.github_url || 'https://github.com/yun0-0514'} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub 보기
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
