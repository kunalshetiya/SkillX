export { 
  PrismaClient, 
  Prisma, 
  SkillType, 
  SkillLevel, 
  BarterRequestStatus, 
  SessionStatus, 
  CreditTransactionType 
} from './generated/client/index.js';

import { PrismaClient } from './generated/client/index.js';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
