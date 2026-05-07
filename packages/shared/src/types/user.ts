export interface PublicUser {
  id: string;
  email: string;
  name?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  imageUrl?: string;
}
