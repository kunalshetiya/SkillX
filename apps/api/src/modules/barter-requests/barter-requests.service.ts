import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import { CreateBarterRequestDto, UpdateBarterRequestStatusDto } from './dto/barter-request.dto.js';

@Injectable()
export class BarterRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(senderId: string, dto: CreateBarterRequestDto) {
    const { receiverId, offeredUserSkillId, requestedUserSkillId, message } = dto;

    if (senderId === receiverId) {
      throw new BadRequestException('You cannot send a barter request to yourself');
    }

    // 1. Verify offered skill
    const offeredSkill = await this.prisma.userSkill.findUnique({
      where: { id: offeredUserSkillId },
    });

    if (!offeredSkill || offeredSkill.userId !== senderId) {
      throw new NotFoundException('Offered skill not found in your profile');
    }

    if (offeredSkill.type !== 'OFFERING') {
      throw new BadRequestException('You can only offer skills you are teaching');
    }

    // 2. Verify requested skill
    const requestedSkill = await this.prisma.userSkill.findUnique({
      where: { id: requestedUserSkillId },
    });

    if (!requestedSkill || requestedSkill.userId !== receiverId) {
      throw new NotFoundException('Requested skill not found for this user');
    }

    if (requestedSkill.type !== 'OFFERING') {
      throw new BadRequestException('You can only request skills the receiver is teaching');
    }

    // 3. Create the request
    return this.prisma.barterRequest.create({
      data: {
        senderId,
        receiverId,
        offeredUserSkillId,
        requestedUserSkillId,
        message,
        status: 'PENDING',
      },
      include: {
        offeredUserSkill: { include: { skill: true } },
        requestedUserSkill: { include: { skill: true } },
        receiver: true,
      },
    });
  }

  async findIncoming(userId: string) {
    return this.prisma.barterRequest.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          select: { id: true, username: true, name: true, imageUrl: true }
        },
        offeredUserSkill: { include: { skill: true } },
        requestedUserSkill: { include: { skill: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOutgoing(userId: string) {
    return this.prisma.barterRequest.findMany({
      where: { senderId: userId },
      include: {
        receiver: {
          select: { id: true, username: true, name: true, imageUrl: true }
        },
        offeredUserSkill: { include: { skill: true } },
        requestedUserSkill: { include: { skill: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(userId: string, id: string, dto: UpdateBarterRequestStatusDto) {
    const request = await this.prisma.barterRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Barter request not found');
    }

    // Authorization logic
    if (dto.status === 'ACCEPTED' || dto.status === 'REJECTED') {
      if (request.receiverId !== userId) {
        throw new ForbiddenException('Only the receiver can accept or reject a request');
      }
    }

    if (dto.status === 'CANCELLED') {
      if (request.senderId !== userId) {
        throw new ForbiddenException('Only the sender can cancel a request');
      }
    }

    // Basic state machine validation
    if (request.status !== 'PENDING' && dto.status !== 'COMPLETED') {
        throw new BadRequestException(`Cannot transition from ${request.status} to ${dto.status}`);
    }

    return this.prisma.barterRequest.update({
      where: { id },
      data: { status: dto.status },
      include: {
        sender: true,
        receiver: true,
        offeredUserSkill: { include: { skill: true } },
        requestedUserSkill: { include: { skill: true } },
      },
    });
  }
}
