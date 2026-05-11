import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CreateSessionDto, UpdateSessionStatusDto } from './dto/session.dto.js';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: string, dto: CreateSessionDto) {
    const { barterRequestId, taughtUserSkillId, scheduledAt, durationMinutes, meetLink, notes } = dto;

    // 1. Verify barter request exists and is ACCEPTED
    const barterRequest = await this.prisma.barterRequest.findUnique({
      where: { id: barterRequestId },
      include: {
        offeredUserSkill: true,
        requestedUserSkill: true,
      },
    });

    if (!barterRequest) {
      throw new NotFoundException('Barter request not found');
    }

    if (barterRequest.status !== 'ACCEPTED') {
      throw new BadRequestException('Sessions can only be created for accepted barter requests');
    }

    // 2. Authorization: Current user must be a participant
    if (barterRequest.senderId !== userId && barterRequest.receiverId !== userId) {
      throw new ForbiddenException('You are not a participant in this barter request');
    }

    // 3. Verify taughtUserSkillId belongs to the barter request
    const isOffered = barterRequest.offeredUserSkillId === taughtUserSkillId;
    const isRequested = barterRequest.requestedUserSkillId === taughtUserSkillId;

    if (!isOffered && !isRequested) {
      throw new BadRequestException('The taught skill must be part of the barter request');
    }

    // 4. Derive Mentor and Learner
    let mentorId: string;
    let learnerId: string;

    if (isOffered) {
      mentorId = barterRequest.senderId;
      learnerId = barterRequest.receiverId;
    } else {
      mentorId = barterRequest.receiverId;
      learnerId = barterRequest.senderId;
    }

    // 5. Check if session already exists for this barter (1:1 constraint)
    const existingSession = await this.prisma.session.findUnique({
      where: { barterRequestId },
    });

    if (existingSession) {
      throw new BadRequestException('A session has already been scheduled for this barter request');
    }

    // 6. Create the session
    return this.prisma.session.create({
      data: {
        barterRequestId,
        taughtUserSkillId,
        mentorId,
        learnerId,
        scheduledAt: new Date(scheduledAt),
        durationMinutes: durationMinutes || 60,
        meetLink,
        notes,
        status: 'SCHEDULED',
      },
      include: {
        mentor: { select: { id: true, username: true, name: true, imageUrl: true } },
        learner: { select: { id: true, username: true, name: true, imageUrl: true } },
        taughtUserSkill: { include: { skill: true } },
      },
    });
  }

  async findUpcoming(userId: string) {
    return this.prisma.session.findMany({
      where: {
        OR: [{ mentorId: userId }, { learnerId: userId }],
        status: { in: ['SCHEDULED', 'ONGOING'] },
      },
      include: {
        mentor: { select: { id: true, username: true, name: true, imageUrl: true } },
        learner: { select: { id: true, username: true, name: true, imageUrl: true } },
        taughtUserSkill: { include: { skill: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findHistory(userId: string) {
    return this.prisma.session.findMany({
      where: {
        OR: [{ mentorId: userId }, { learnerId: userId }],
        status: { in: ['COMPLETED', 'CANCELLED', 'NO_SHOW'] },
      },
      include: {
        mentor: { select: { id: true, username: true, name: true, imageUrl: true } },
        learner: { select: { id: true, username: true, name: true, imageUrl: true } },
        taughtUserSkill: { include: { skill: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async updateStatus(userId: string, id: string, dto: UpdateSessionStatusDto) {
    const session = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.mentorId !== userId && session.learnerId !== userId) {
      throw new ForbiddenException('You are not a participant in this session');
    }

    // Terminal state protection
    if (session.status === 'COMPLETED' || session.status === 'CANCELLED' || session.status === 'NO_SHOW') {
      throw new BadRequestException(`Cannot update status of a ${session.status} session`);
    }

    return this.prisma.session.update({
      where: { id },
      data: { status: dto.status },
      include: {
        mentor: { select: { id: true, username: true, name: true, imageUrl: true } },
        learner: { select: { id: true, username: true, name: true, imageUrl: true } },
        taughtUserSkill: { include: { skill: true } },
      },
    });
  }
}
