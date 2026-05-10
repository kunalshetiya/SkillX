import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionsService } from './sessions.service.js';
import { CreateSessionDto, UpdateSessionStatusDto } from './dto/session.dto.js';
import { ClerkGuard } from '../../common/guards/clerk.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('sessions')
@Controller('sessions')
@UseGuards(ClerkGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Schedule a new session from an accepted barter request' })
  @ApiResponse({ status: 201, description: 'Session scheduled successfully.' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() createDto: CreateSessionDto) {
    return this.sessionsService.create(user.id, createDto);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming sessions for the current user' })
  findUpcoming(@CurrentUser() user: AuthenticatedUser) {
    return this.sessionsService.findUpcoming(user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get session history for the current user' })
  findHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.sessionsService.findHistory(user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update session status (Complete/Cancel)' })
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateDto: UpdateSessionStatusDto,
  ) {
    return this.sessionsService.updateStatus(user.id, id, updateDto);
  }
}
