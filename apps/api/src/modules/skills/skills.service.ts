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

    return this.prisma.userSkill.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            imageUrl: true,
            isMentor: true,
          },
        },
        skill: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
