import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BarterRequestsService } from './barter-requests.service.js';
import { CreateBarterRequestDto, UpdateBarterRequestStatusDto } from './dto/barter-request.dto.js';

@ApiTags('barter-requests')
@Controller('barter-requests')
export class BarterRequestsController {
  constructor(private readonly barterRequestsService: BarterRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new barter request' })
  @ApiResponse({ status: 201, description: 'Request created successfully.' })
  create(@Body() createDto: CreateBarterRequestDto) {
    return this.barterRequestsService.create(createDto);
  }

  @Get('incoming')
  @ApiOperation({ summary: 'Get incoming barter requests' })
  findIncoming() {
    return this.barterRequestsService.findIncoming();
  }

  @Get('outgoing')
  @ApiOperation({ summary: 'Get outgoing barter requests' })
  findOutgoing() {
    return this.barterRequestsService.findOutgoing();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update barter request status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBarterRequestStatusDto,
  ) {
    return this.barterRequestsService.updateStatus(id, updateDto);
  }
}
