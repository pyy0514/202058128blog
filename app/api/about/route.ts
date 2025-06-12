import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
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
      return NextResponse.json(
        { error: '소개 페이지를 불러올 수 없습니다.' },
        { status: 500 }
      );
    }

    // 데이터가 없으면 기본값 반환
    if (!aboutData) {
      return NextResponse.json({
        name: '박윤영',
        title: '풀스택 개발자를 꿈꾸는 컴퓨터공학도',
        school: '한신대학교 컴퓨터공학과 4학년',
        location: '경기도',
        github_url: 'https://github.com/parkyunyoung',
        github_username: '@parkyunyoung',
        notion_url: 'https://www.notion.so/parkyunyoung',
        email: 'parkyunyoung@hanmail.net',
        tech_stacks: [],
        strengths: [],
        projects: [],
        education: '2021년 입학 - 현재 4학년 재학 중',
        education_details: [],
        experience_details: []
      });
    }

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('소개 페이지 API 오류:', error);
    return NextResponse.json(
      { error: '내부 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const supabase = await createServerSupabaseClient();

    // 기존 데이터를 비활성화
    await supabase
      .from('about_page')
      .update({ is_active: false })
      .eq('is_active', true);

    // 새로운 데이터 생성
    const { data, error } = await supabase
      .from('about_page')
      .insert({
        ...body,
        created_by: userId,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('소개 페이지 생성 오류:', error);
      return NextResponse.json(
        { error: '소개 페이지를 저장할 수 없습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('소개 페이지 생성 API 오류:', error);
    return NextResponse.json(
      { error: '내부 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('about_page')
      .update(updateData)
      .eq('id', id)
      .eq('created_by', userId)
      .select()
      .single();

    if (error) {
      console.error('소개 페이지 수정 오류:', error);
      return NextResponse.json(
        { error: '소개 페이지를 수정할 수 없습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('소개 페이지 수정 API 오류:', error);
    return NextResponse.json(
      { error: '내부 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
