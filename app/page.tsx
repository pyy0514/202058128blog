/**
 * 블로그 홈페이지 컴포넌트 (2025년 새로운 Third-Party Auth 방식)
 * Hero 섹션, 최신 포스트, 카테고리 섹션으로 구성
 * 실제 Supabase 데이터베이스와 연동
 */

import { Suspense } from 'react';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Database } from '@/types/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, Eye, ArrowRight } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export const dynamic = "force-dynamic";

// 타입 정의
type Post = Database['public']['Tables']['posts']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

type PostWithCategory = Post & {
  categories?: Category | null;
};

// 날짜 포맷팅 함수
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 최신 게시물 조회
async function getLatestPosts(): Promise<PostWithCategory[]> {
  try {
    console.log('=== 홈페이지: 최신 게시물 조회 ===');
    const supabase = await createServerSupabaseClient();

    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        view_count,
        created_at,
        content,
        status,
        author_id,
        category_id,
        updated_at,
        categories (
          id,
          name,
          slug,
          color,
          description,
          created_at,
          updated_at
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('최신 게시물 조회 오류:', error);
      return [];
    }

    console.log(`✅ 최신 게시물 ${posts?.length || 0}개 조회 성공`);
    return (posts || []).map(post => ({
      ...post,
      categories: Array.isArray(post.categories)
        ? (post.categories[0] || null)
        : post.categories ?? null,
    }));
  } catch (error) {
    console.error('최신 게시물 조회 중 오류:', error);
    return [];
  }
}

// 카테고리 목록 조회
async function getCategories(): Promise<Category[]> {
  try {
    console.log('=== 홈페이지: 카테고리 목록 조회 ===');
    const supabase = await createServerSupabaseClient();

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
      .limit(6); // 홈페이지에는 최대 6개만 표시

    if (error) {
      console.error('카테고리 조회 오류:', error);
      return [];
    }

    console.log(`✅ 카테고리 ${categories?.length || 0}개 조회 성공`);
    return categories || [];
  } catch (error) {
    console.error('카테고리 조회 중 오류:', error);
    return [];
  }
}

export default async function Home() {
  // 서버 컴포넌트에서 데이터 조회
  const [latestPosts, categories] = await Promise.all([
    getLatestPosts(),
    getCategories()
  ]);

  return (
    <div id="main-content" className="py-16">
      {/* Hero 섹션 */}
      <section className="text-center mb-20 relative">
        {/* 배경 장식 */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-10 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* 개인 소개 */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-white dark:ring-gray-800">
              박
            </div>
            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              👨‍💻 주니어 개발자 • 한신대학교 컴퓨터공학과 4학년
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            윤영의 개발일기
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
            🚀 <strong>첫 개발 블로그</strong>에 오신 것을 환영합니다!
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            풀스택 개발자를 꿈꾸며 <span className="text-blue-600 font-medium">React, Next.js, Python, Java</span> 등을 학습하고 있습니다. 
            실습 프로젝트와 학습 과정을 기록하며 함께 성장해나가요! 💪
          </p>
          
          {/* 기술 스택 미리보기 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['React', 'Next.js', 'TypeScript', 'Python', 'Java', 'Spring Boot'].map((tech) => (
              <span key={tech} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border">
                {tech}
              </span>
            ))}
          </div>
          
          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/posts"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-medium text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📚 개발 글 읽어보기
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-background px-8 py-3 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700"
            >
              👋 제 소개 보기
            </Link>
          </div>
          
          {/* 추가 소개 텍스트 */}
          <div className="mt-12 text-sm text-muted-foreground">
            <p>🎯 <strong>목표:</strong> 실무 역량을 갖춘 풀스택 개발자</p>
            <p className="mt-1">📖 <strong>학습 중:</strong> 웹 개발 전반, AI/ML, 데이터 분석</p>
          </div>
        </div>
      </section>

      {/* 최신 게시물 섹션 */}
      <section className="mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              📝 최근 작성한 글들
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              개발 공부하면서 배운 것들과 프로젝트 경험을 기록하고 있어요. 
              저와 함께 성장해나가는 과정을 지켜봐 주세요! 🌱
            </p>
            <div className="mt-6">
              <Link
                href="/posts"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 dark:bg-blue-950 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
              >
                전체 글 목록 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader className="p-0">
                    {post.cover_image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {/* 카테고리 */}
                      {post.categories && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: `${post.categories.color}20`, color: post.categories.color }}
                        >
                          {post.categories.name}
                        </Badge>
                      )}

                      {/* 제목 */}
                      <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/posts/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* 요약 */}
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      {/* 메타 정보 */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* 빈 상태 */
            <Card className="text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">아직 게시물이 없습니다</h3>
                  <p className="text-muted-foreground mb-6">
                    첫 번째 블로그 글을 작성해보세요!
                  </p>
                  
                  <SignedIn>
                    <Button asChild>
                      <Link href="/admin/posts/create">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        첫 글 작성하기
                      </Link>
                    </Button>
                  </SignedIn>
                  
                  <SignedOut>
                    <p className="text-sm text-muted-foreground">
                      게시물을 작성하려면 로그인이 필요합니다.
                    </p>
                  </SignedOut>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              🗂️ 공부 주제별 모아보기
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              배우고 있는 기술들을 주제별로 정리했어요. 관심 있는 분야를 클릭해서 관련 글들을 확인해보세요!
            </p>
            <div className="mt-6">
              <Link
                href="/categories"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 dark:bg-blue-950 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
              >
                모든 카테고리 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="text-center p-6 hover:shadow-md transition-all duration-200 group-hover:scale-105">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name.charAt(0)}
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            /* 카테고리 빈 상태 */
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">
                  아직 카테고리가 없습니다.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
