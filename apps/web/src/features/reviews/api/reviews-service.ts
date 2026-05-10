import { fetcher } from '@web/lib/api-client';

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;

  reviewer: {
    id: string;
    username: string;
    name?: string;
    imageUrl?: string;
  };
  session: {
    taughtUserSkill: {
      skill: {
        name: string;
      };
    };
  };
}

export interface Reputation {
  averageRating: number;
  totalReviews: number;
  completedSessionsCount: number;
}

export const reviewsService = {
  create: (data: {
    sessionId: string;
    rating: number;
    comment?: string;
  }, token?: string | null) => fetcher<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token),

  getMyReviews: (token?: string | null) => fetcher<Review[]>('/reviews/me', {}, token),

  getByUser: (userId: string, token?: string | null) => fetcher<Review[]>(`/reviews/user/${userId}`, {}, token),

  getBySession: (sessionId: string, token?: string | null) => fetcher<Review[]>(`/reviews/session/${sessionId}`, {}, token),

  getReputation: (userId: string, token?: string | null) => fetcher<Reputation>(`/reviews/reputation/${userId}`, {}, token),
};
