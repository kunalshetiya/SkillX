import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { SkillsModule } from './modules/skills/skills.module.js';

@Module({
  imports: [PrismaModule, UsersModule, SkillsModule],
})
export class AppModule {}
