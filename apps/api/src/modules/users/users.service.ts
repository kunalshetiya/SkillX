import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@skillx/database";
import { PrismaService } from "../../common/prisma/prisma.service.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { CreateUserSkillDto } from "./dto/create-user-skill.dto.js";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * JIT Sync: Finds a user by Clerk ID or creates a new one.
   * Called during the /me endpoint flow.
   */
  async findOrCreateUser(clerkId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: clerkId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (user) return user;

    this.logger.log(`Creating new user for Clerk ID: ${clerkId}`);

    // Create new user record
    return this.prisma.user.create({
      data: {
        id: clerkId,
        email: email,
        username: email.split('@')[0] + '_' + Math.random().toString(36).substring(7),
        credits: 100, // Starting credits
      },
      include: {
        skills: true,
      },
    });
  }

  async getMe(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: clerkId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateMe(clerkId: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id: clerkId },
        data: updateUserDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Username already taken");
      }
      throw error;
    }
  }

  async addUserSkill(clerkId: string, createUserSkillDto: CreateUserSkillDto) {
    const { skillName, ...skillDetails } = createUserSkillDto;

    const skill = await this.prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: {
        name: skillName,
        slug: skillName.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    try {
      return await this.prisma.userSkill.create({
        data: {
          ...skillDetails,
          userId: clerkId,
          skillId: skill.id,
        },
        include: {
          skill: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("You have already added this skill type");
      }
      throw error;
    }
  }

  async removeUserSkill(clerkId: string, userSkillId: string) {
    try {
      // Use deleteMany to ensure both ID and userId match for security
      const result = await this.prisma.userSkill.deleteMany({
        where: {
          id: userSkillId,
          userId: clerkId,
        },
      });

      if (result.count === 0) {
        throw new NotFoundException("Skill not found for your profile");
      }
      
      return { id: userSkillId };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException("Skill not found for your profile");
      }
      throw error;
    }
  }
}
