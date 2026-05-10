import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { SkillsModule } from './modules/skills/skills.module.js';
import { BarterRequestsModule } from './modules/barter-requests/barter-requests.module.js';
import { SessionsModule } from './modules/sessions/sessions.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SkillsModule,
    BarterRequestsModule,
    SessionsModule,
    ReviewsModule,
  ],
})
export class AppModule {}

