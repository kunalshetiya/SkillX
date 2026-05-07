import { fetcher } from '@web/lib/api-client';

export interface UserSkill {
  id: string;
  type: 'OFFERING' | 'LEARNING';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  skill: {
    name: string;
    slug: string;
  };
  description?: string;
  yearsExperience?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  name?: string;
  bio?: string;
  imageUrl?: string;
  credits: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills: UserSkill[];
}

export const profileService = {
  getMe: () => fetcher<UserProfile>('/users/me'),
  
  updateMe: (data: Partial<UserProfile>) => 
    fetcher<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  addSkill: (data: {
    skillName: string;
    type: 'OFFERING' | 'LEARNING';
    level: string;
    description?: string;
    yearsExperience?: number;
  }) => 
    fetcher<UserSkill>('/users/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
