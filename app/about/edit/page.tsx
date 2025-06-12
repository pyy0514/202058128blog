import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AboutEditForm from '@/components/about/about-edit-form';

export const metadata: Metadata = {
  title: '소개 페이지 편집 | 박윤영의 개발 블로그',
  description: '소개 페이지를 편집합니다.',
};

export default async function AboutEditPage() {
  const { userId } = await auth();
  
  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!userId) {
    redirect('/auth/sign-in?redirect_url=/about/edit');
  }

  return <AboutEditForm />;
}
