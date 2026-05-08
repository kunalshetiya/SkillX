import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@skillx/database";
import { PrismaService } from "../../common/prisma/prisma.service.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { CreateUserSkillDto } from "./dto/create-user-skill.dto.js";

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);
  // Placeholder mock user ID for MVP phase
  private readonly MOCK_USER_ID = "mock-user-id";

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedMockUser();
  }

  private async seedMockUser() {
    this.logger.log("Checking for default mock user...");

    await this.prisma.user.upsert({
      where: { id: this.MOCK_USER_ID },
      update: {},
      create: {
        id: this.MOCK_USER_ID,
        email: "dev@skillx.com",
        username: "dev_user",
        name: "Development User",
        bio: "Automated mock user for MVP development.",
        credits: 500,
      },
    });

    this.logger.log("Default mock user ensured.");
  }

  async getMe() {
    const user = await this.prisma.user.findUnique({
      where: { id: this.MOCK_USER_ID },
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

  async updateMe(updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id: this.MOCK_USER_ID },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint for username
        if (error.code === "P2002") {
          throw new ConflictException("Username already taken");
        }
      }
      throw error;
    }
  }

  async addUserSkill(createUserSkillDto: CreateUserSkillDto) {
    const { skillName, ...skillDetails } = createUserSkillDto;

    // 1. Find or create the master skill record
    const skill = await this.prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: {
        name: skillName,
        slug: skillName.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    // 2. Link skill to user
    try {
      return await this.prisma.userSkill.create({
        data: {
          ...skillDetails,
          userId: this.MOCK_USER_ID,
          skillId: skill.id,
        },
        include: {
          skill: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("You have already added this skill type");
        }
      }
      throw error;
    }
  }

  async removeUserSkill(userSkillId: string) {
    try {
      return await this.prisma.userSkill.delete({
        where: {
          id: userSkillId,
          userId: this.MOCK_USER_ID, // Ensure user can only delete their own skills
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException("Skill not found for your profile");
        }
      }
      throw error;
    }
  }

  // Helper to get the current user ID (for future auth integration)
  getMockUserId(): string {
    return this.MOCK_USER_ID;
  }
}
