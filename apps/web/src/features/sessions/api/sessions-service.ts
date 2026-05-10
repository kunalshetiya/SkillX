import { fetcher } from '@web/lib/api-client';

export type SessionStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Session {
  id: string;
  barterRequestId: string;
  taughtUserSkillId: string;
  mentorId: string;
  learnerId: string;
  scheduledAt: string;
  durationMinutes: number;
  meetLink?: string;
  notes?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;

  // Relations
  mentor: {
    id: string;
    username: string;
    name?: string;
    imageUrl?: string;
  };
  learner: {
    id: string;
    username: string;
    name?: string;
    imageUrl?: string;
  };
  taughtUserSkill: {
    skill: {
      name: string;
    };
  };
}

export const sessionsService = {
  create: (data: {
    barterRequestId: string;
    taughtUserSkillId: string;
    scheduledAt: string;
    durationMinutes?: number;
    meetLink?: string;
    notes?: string;
  }, token?: string | null) => fetcher<Session>('/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token),

  getUpcoming: (token?: string | null) => fetcher<Session[]>('/sessions/upcoming', {}, token),

  getHistory: (token?: string | null) => fetcher<Session[]>('/sessions/history', {}, token),

  updateStatus: (id: string, status: 'COMPLETED' | 'CANCELLED' | 'ONGOING', token?: string | null) => 
    fetcher<Session>(`/sessions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, token),
};
