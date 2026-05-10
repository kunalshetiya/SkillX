import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "./users.service.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { CreateUserSkillDto } from "./dto/create-user-skill.dto.js";
import { ClerkGuard } from "../../common/guards/clerk.guard.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator.js";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(ClerkGuard)
  @ApiOperation({ summary: "Get current user profile (with JIT sync)" })
  @ApiResponse({ status: 200, description: "Return current user profile." })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findOrCreateUser(user.id, user.email);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user profile by ID" })
  @ApiResponse({ status: 200, description: "Return user profile." })
  @ApiResponse({ status: 404, description: "User not found." })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch("me")
  @UseGuards(ClerkGuard)
  @ApiOperation({ summary: "Update current user profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully." })
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateMe(user.id, updateUserDto);
  }

  @Post("skills")
  @UseGuards(ClerkGuard)
  @ApiOperation({ summary: "Add a new skill to current user" })
  @ApiResponse({ status: 201, description: "Skill added successfully." })
  @ApiResponse({
    status: 409,
    description: "Skill type already exists for user.",
  })
  addUserSkill(@CurrentUser() user: AuthenticatedUser, @Body() createUserSkillDto: CreateUserSkillDto) {
    return this.usersService.addUserSkill(user.id, createUserSkillDto);
  }

  @Delete("skills/:id")
  @UseGuards(ClerkGuard)
  @ApiOperation({ summary: "Remove a skill from current user" })
  @ApiResponse({ status: 200, description: "Skill removed successfully." })
  @ApiResponse({ status: 404, description: "Skill not found for user." })
  removeUserSkill(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.usersService.removeUserSkill(user.id, id);
  }
}
