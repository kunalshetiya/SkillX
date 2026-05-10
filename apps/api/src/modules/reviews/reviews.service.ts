import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    const { sessionId, rating, comment } = dto;

    // 1. Fetch session and verify it's COMPLETED
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'COMPLETED') {
      throw new BadRequestException('Reviews can only be created for completed sessions');
    }

    // 2. Authorization: Current user must be a participant
    const isMentor = session.mentorId === reviewerId;
    const isLearner = session.learnerId === reviewerId;

    if (!isMentor && !isLearner) {
      throw new ForbiddenException('You are not a participant in this session');
    }

    // 3. Prevent self-review
    const reviewedUserId = isMentor ? session.learnerId : session.mentorId;
    if (reviewerId === reviewedUserId) {
        throw new BadRequestException('Users cannot review themselves');
    }

    // 4. Check for existing review (Unique constraint [sessionId, reviewerId])
    try {
      return await this.prisma.review.create({
        data: {
          sessionId,
          reviewerId,
          reviewedUserId,
          rating,
          comment,
        },
        include: {
          reviewer: { select: { id: true, username: true, name: true, imageUrl: true } },
          reviewedUser: { select: { id: true, username: true, name: true, imageUrl: true } },
          session: { include: { taughtUserSkill: { include: { skill: true } } } },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('You have already reviewed this session');
      }
      throw error;
    }
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { reviewedUserId: userId },
      include: {
        reviewer: { select: { id: true, username: true, name: true, imageUrl: true } },
        session: { include: { taughtUserSkill: { include: { skill: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { reviewedUserId: userId },
      include: {
        reviewer: { select: { id: true, username: true, name: true, imageUrl: true } },
        session: { include: { taughtUserSkill: { include: { skill: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReputation(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { reviewedUserId: userId },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)) 
      : 0;

    return {
      averageRating,
      totalReviews,
    };
  }
}
