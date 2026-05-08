import { Module } from '@nestjs/common';
import { BarterRequestsController } from './barter-requests.controller.js';
import { BarterRequestsService } from './barter-requests.service.js';
import { UsersModule } from '../users/users.module.js';
import { PrismaModule } from '../../common/prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [BarterRequestsController],
  providers: [BarterRequestsService],
  exports: [BarterRequestsService],
})
export class BarterRequestsModule {}
