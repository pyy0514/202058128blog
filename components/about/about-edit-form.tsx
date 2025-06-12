'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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

export default function AboutEditForm() {
  const router = useRouter();
  const [aboutData, setAboutData] = useState<AboutData>({
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
      }
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
      toast.error('데이터를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const method = aboutData.id ? 'PUT' : 'POST';
      const response = await fetch('/api/about', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      });

      if (!response.ok) {
        throw new Error('저장에 실패했습니다.');
      }

      toast.success('소개 페이지가 성공적으로 저장되었습니다.');
      router.push('/about');
    } catch (error) {
      console.error('저장 오류:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const addTechStack = () => {
    setAboutData(prev => ({
      ...prev,
      tech_stacks: [...prev.tech_stacks, { category: '', skills: [] }]
    }));
  };

  const removeTechStack = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      tech_stacks: prev.tech_stacks.filter((_, i) => i !== index)
    }));
  };

  const updateTechStack = (index: number, field: string, value: string | string[]) => {
    setAboutData(prev => ({
      ...prev,
      tech_stacks: prev.tech_stacks.map((stack, i) => 
        i === index ? { ...stack, [field]: value } : stack
      )
    }));
  };

  const addSkillToTechStack = (stackIndex: number, skill: string) => {
    if (!skill.trim()) return;
    
    setAboutData(prev => ({
      ...prev,
      tech_stacks: prev.tech_stacks.map((stack, i) => 
        i === stackIndex 
          ? { ...stack, skills: [...stack.skills, skill.trim()] }
          : stack
      )
    }));
  };

  const removeSkillFromTechStack = (stackIndex: number, skillIndex: number) => {
    setAboutData(prev => ({
      ...prev,
      tech_stacks: prev.tech_stacks.map((stack, i) => 
        i === stackIndex 
          ? { ...stack, skills: stack.skills.filter((_, j) => j !== skillIndex) }
          : stack
      )
    }));
  };

  const addStrength = () => {
    setAboutData(prev => ({
      ...prev,
      strengths: [...prev.strengths, { title: '', description: '' }]
    }));
  };

  const removeStrength = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index)
    }));
  };

  const updateStrength = (index: number, field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      strengths: prev.strengths.map((strength, i) => 
        i === index ? { ...strength, [field]: value } : strength
      )
    }));
  };

  const addProject = () => {
    setAboutData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', tech: '', color: 'blue', features: [] }]
    }));
  };

  const removeProject = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
    setAboutData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addFeatureToProject = (projectIndex: number, feature: string) => {
    if (!feature.trim()) return;
    
    setAboutData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex 
          ? { ...project, features: [...project.features, feature.trim()] }
          : project
      )
    }));
  };

  const removeFeatureFromProject = (projectIndex: number, featureIndex: number) => {
    setAboutData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex 
          ? { ...project, features: project.features.filter((_, j) => j !== featureIndex) }
          : project
      )
    }));
  };

  const addEducationDetail = () => {
    setAboutData(prev => ({
      ...prev,
      education_details: [...prev.education_details, '']
    }));
  };

  const removeEducationDetail = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      education_details: prev.education_details.filter((_, i) => i !== index)
    }));
  };

  const updateEducationDetail = (index: number, value: string) => {
    setAboutData(prev => ({
      ...prev,
      education_details: prev.education_details.map((detail, i) => 
        i === index ? value : detail
      )
    }));
  };

  const addExperienceDetail = () => {
    setAboutData(prev => ({
      ...prev,
      experience_details: [...prev.experience_details, '']
    }));
  };

  const removeExperienceDetail = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      experience_details: prev.experience_details.filter((_, i) => i !== index)
    }));
  };

  const updateExperienceDetail = (index: number, value: string) => {
    setAboutData(prev => ({
      ...prev,
      experience_details: prev.experience_details.map((detail, i) => 
        i === index ? value : detail
      )
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/about')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로 가기
          </Button>
          <h1 className="text-3xl font-bold">소개 페이지 편집</h1>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isSaving} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>소개 페이지 저장</AlertDialogTitle>
              <AlertDialogDescription>
                변경사항을 저장하시겠습니까? 저장 후 소개 페이지에서 확인할 수 있습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave}>저장</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-8">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>개인 기본 정보를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={aboutData.name}
                  onChange={(e) => setAboutData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="title">소개 문구</Label>
                <Input
                  id="title"
                  value={aboutData.title}
                  onChange={(e) => setAboutData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="school">학교 정보</Label>
                <Input
                  id="school"
                  value={aboutData.school}
                  onChange={(e) => setAboutData(prev => ({ ...prev, school: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="location">위치</Label>
                <Input
                  id="location"
                  value={aboutData.location}
                  onChange={(e) => setAboutData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 연락처 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>연락처 & 링크</CardTitle>
            <CardDescription>연락처와 소셜 링크를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={aboutData.github_url}
                  onChange={(e) => setAboutData(prev => ({ ...prev, github_url: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="github_username">GitHub 사용자명</Label>
                <Input
                  id="github_username"
                  value={aboutData.github_username}
                  onChange={(e) => setAboutData(prev => ({ ...prev, github_username: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notion_url">Notion URL</Label>
                <Input
                  id="notion_url"
                  value={aboutData.notion_url}
                  onChange={(e) => setAboutData(prev => ({ ...prev, notion_url: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={aboutData.email}
                  onChange={(e) => setAboutData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 기술 스택 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              기술 스택
              <Button onClick={addTechStack} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                카테고리 추가
              </Button>
            </CardTitle>
            <CardDescription>기술 스택을 카테고리별로 관리하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {aboutData.tech_stacks.map((stack, stackIndex) => (
              <div key={stackIndex} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    placeholder="카테고리명 (예: Frontend)"
                    value={stack.category}
                    onChange={(e) => updateTechStack(stackIndex, 'category', e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => removeTechStack(stackIndex)}
                    size="sm"
                    variant="destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {stack.skills.map((skill, skillIndex) => (
                      <Badge 
                        key={skillIndex} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkillFromTechStack(stackIndex, skillIndex)}
                          className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="기술 이름을 입력하고 Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkillToTechStack(stackIndex, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addSkillToTechStack(stackIndex, input.value);
                        input.value = '';
                      }}
                      size="sm"
                      variant="outline"
                    >
                      추가
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 강점 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              강점 & 특징
              <Button onClick={addStrength} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                강점 추가
              </Button>
            </CardTitle>
            <CardDescription>개발자로서의 강점을 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aboutData.strengths.map((strength, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    placeholder="강점 제목"
                    value={strength.title}
                    onChange={(e) => updateStrength(index, 'title', e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => removeStrength(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="강점에 대한 설명"
                  value={strength.description}
                  onChange={(e) => updateStrength(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 프로젝트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              주요 프로젝트
              <Button onClick={addProject} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                프로젝트 추가
              </Button>
            </CardTitle>
            <CardDescription>진행한 주요 프로젝트들을 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {aboutData.projects.map((project, projectIndex) => (
              <div key={projectIndex} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    placeholder="프로젝트 제목"
                    value={project.title}
                    onChange={(e) => updateProject(projectIndex, 'title', e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={project.color}
                    onChange={(e) => updateProject(projectIndex, 'color', e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="blue">파란색</option>
                    <option value="green">초록색</option>
                    <option value="purple">보라색</option>
                    <option value="orange">주황색</option>
                    <option value="red">빨간색</option>
                  </select>
                  <Button 
                    onClick={() => removeProject(projectIndex)}
                    size="sm"
                    variant="destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <Input
                  placeholder="기술 스택 (예: Next.js + Supabase)"
                  value={project.tech}
                  onChange={(e) => updateProject(projectIndex, 'tech', e.target.value)}
                  className="mb-4"
                />
                
                <div className="space-y-2">
                  <Label>프로젝트 특징</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {feature}
                        <button
                          onClick={() => removeFeatureFromProject(projectIndex, featureIndex)}
                          className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="특징을 입력하고 Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addFeatureToProject(projectIndex, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addFeatureToProject(projectIndex, input.value);
                        input.value = '';
                      }}
                      size="sm"
                      variant="outline"
                    >
                      추가
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 학력 */}
        <Card>
          <CardHeader>
            <CardTitle>학력 정보</CardTitle>
            <CardDescription>학력과 관련 세부사항을 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="education">학력</Label>
              <Input
                id="education"
                value={aboutData.education}
                onChange={(e) => setAboutData(prev => ({ ...prev, education: e.target.value }))}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>학력 세부사항</Label>
                <Button onClick={addEducationDetail} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  항목 추가
                </Button>
              </div>
              
              {aboutData.education_details.map((detail, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={detail}
                    onChange={(e) => updateEducationDetail(index, e.target.value)}
                    placeholder="학력 세부사항"
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => removeEducationDetail(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 경험 */}
        <Card>
          <CardHeader>
            <CardTitle>개인 프로젝트 & 학습 경험</CardTitle>
            <CardDescription>개인 프로젝트와 학습 경험을 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>경험 세부사항</Label>
                <Button onClick={addExperienceDetail} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  항목 추가
                </Button>
              </div>
              
              {aboutData.experience_details.map((detail, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={detail}
                    onChange={(e) => updateExperienceDetail(index, e.target.value)}
                    placeholder="경험 세부사항"
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => removeExperienceDetail(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
