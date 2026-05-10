import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ClerkGuard } from '../../common/guards/clerk.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(ClerkGuard)
  @ApiOperation({ summary: 'Create a new review for a completed session' })
  @ApiResponse({ status: 201, description: 'Review created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid session status or self-review.' })
  @ApiResponse({ status: 409, description: 'Session already reviewed by this user.' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() createDto: CreateReviewDto) {
    return this.reviewsService.create(user.id, createDto);
  }

  @Get('me')
  @UseGuards(ClerkGuard)
  @ApiOperation({ summary: 'Get reviews received by the current user' })
  getMyReviews(@CurrentUser() user: AuthenticatedUser) {
    return this.reviewsService.getMyReviews(user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reviews received by a specific user' })
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }

  @Get('reputation/:userId')
  @ApiOperation({ summary: 'Get aggregated reputation stats for a user' })
  getReputation(@Param('userId') userId: string) {
    return this.reviewsService.getReputation(userId);
  }
}
