import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BarterRequestsService } from './barter-requests.service.js';
import { CreateBarterRequestDto, UpdateBarterRequestStatusDto } from './dto/barter-request.dto.js';
import { ClerkGuard } from '../../common/guards/clerk.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('barter-requests')
@Controller('barter-requests')
@UseGuards(ClerkGuard)
export class BarterRequestsController {
  constructor(private readonly barterRequestsService: BarterRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new barter request' })
  @ApiResponse({ status: 201, description: 'Request created successfully.' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() createDto: CreateBarterRequestDto) {
    return this.barterRequestsService.create(user.id, createDto);
  }

  @Get('incoming')
  @ApiOperation({ summary: 'Get incoming barter requests' })
  findIncoming(@CurrentUser() user: AuthenticatedUser) {
    return this.barterRequestsService.findIncoming(user.id);
  }

  @Get('outgoing')
  @ApiOperation({ summary: 'Get outgoing barter requests' })
  findOutgoing(@CurrentUser() user: AuthenticatedUser) {
    return this.barterRequestsService.findOutgoing(user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update barter request status' })
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateDto: UpdateBarterRequestStatusDto,
  ) {
    return this.barterRequestsService.updateStatus(user.id, id, updateDto);
  }
}
