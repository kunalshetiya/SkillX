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
  getMe: (token?: string | null) => fetcher<UserProfile>('/users/me', {}, token),
  
  updateMe: (data: Partial<UserProfile>, token?: string | null) => 
    fetcher<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token),

  addSkill: (data: {
    skillName: string;
    type: 'OFFERING' | 'LEARNING';
    level: string;
    description?: string;
    yearsExperience?: number;
  }, token?: string | null) => 
    fetcher<UserSkill>('/users/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  removeSkill: (id: string, token?: string | null) => 
    fetcher<void>(`/users/skills/${id}`, {
      method: 'DELETE',
    }, token),
};
