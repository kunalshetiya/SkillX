import { fetcher } from '@web/lib/api-client';

export interface UserSummary {
  id: string;
  username: string;
  name?: string;
  imageUrl?: string;
  isMentor: boolean;
}

export interface SkillSummary {
  id: string;
  name: string;
  slug: string;
}

export interface MarketplaceSkill {
  id: string;
  type: 'OFFERING' | 'LEARNING';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  description?: string;
  yearsExperience?: number;
  user: UserSummary;
  skill: SkillSummary;
}

export interface GetSkillsParams {
  search?: string;
  type?: 'OFFERING' | 'LEARNING';
  level?: string;
}

export const marketplaceService = {
  getSkills: (params: GetSkillsParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.type) searchParams.append('type', params.type);
    if (params.level) searchParams.append('level', params.level);

    const queryString = searchParams.toString();
    return fetcher<MarketplaceSkill[]>(`/skills${queryString ? `?${queryString}` : ''}`);
  },
};
