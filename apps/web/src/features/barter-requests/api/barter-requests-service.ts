import { fetcher } from '@web/lib/api-client';

export type BarterRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface BarterRequest {
  id: string;
  senderId: string;
  receiverId: string;
  offeredUserSkillId: string;
  requestedUserSkillId: string;
  message?: string;
  status: BarterRequestStatus;
  createdAt: string;
  updatedAt: string;
  
  // Included relations
  sender?: {
    id: string;
    username: string;
    name?: string;
    imageUrl?: string;
  };
  receiver?: {
    id: string;
    username: string;
    name?: string;
    imageUrl?: string;
  };
  offeredUserSkill: {
    id: string;
    level: string;
    skill: {
      name: string;
    };
  };
  requestedUserSkill: {
    id: string;
    level: string;
    skill: {
      name: string;
    };
  };
}

export const barterRequestsService = {
  create: (data: {
    receiverId: string;
    offeredUserSkillId: string;
    requestedUserSkillId: string;
    message?: string;
  }) => fetcher<BarterRequest>('/barter-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getIncoming: () => fetcher<BarterRequest[]>('/barter-requests/incoming'),

  getOutgoing: () => fetcher<BarterRequest[]>('/barter-requests/outgoing'),

  updateStatus: (id: string, status: BarterRequestStatus) => 
    fetcher<BarterRequest>(`/barter-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
