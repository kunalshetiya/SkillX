import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service.js";
import { GetSkillsQueryDto } from "./dto/get-skills-query.dto.js";
import { Prisma } from "@skillx/database";

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetSkillsQueryDto) {
    const { search, type, level } = query;

    const where: Prisma.UserSkillWhereInput = {
      ...(type && { type }),
      ...(level && { level }),
      ...(search && {
        skill: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    };

    const userSkills = await this.prisma.userSkill.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            imageUrl: true,
            isMentor: true,
            reviewsReceived: {
              select: {
                rating: true,
              },
            },
            mentorSessions: {
              where: { status: 'COMPLETED' },
              select: { id: true },
            },
            learnerSessions: {
              where: { status: 'COMPLETED' },
              select: { id: true },
            },
          },
        },
        skill: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map results to include computed reputation
    return userSkills.map(us => {
      const user = us.user as any;
      const reviews = user.reviewsReceived || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? Number((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews).toFixed(1)) 
        : 0;
      
      const completedSessionsCount = (user.mentorSessions?.length || 0) + (user.learnerSessions?.length || 0);

      // Remove the raw relations to keep the response clean
      const { reviewsReceived, mentorSessions, learnerSessions, ...userClean } = user;

      return {
        ...us,
        user: {
          ...userClean,
          reputation: {
            averageRating,
            totalReviews,
            completedSessionsCount,
          },
        },
      };
    });
  }
}
