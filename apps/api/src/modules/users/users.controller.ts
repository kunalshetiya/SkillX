import { Controller, Get, Post, Patch, Delete, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "./users.service.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { CreateUserSkillDto } from "./dto/create-user-skill.dto.js";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "Return current user profile." })
  getMe() {
    return this.usersService.getMe();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user profile by ID" })
  @ApiResponse({ status: 200, description: "Return user profile." })
  @ApiResponse({ status: 404, description: "User not found." })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch("me")
  @ApiOperation({ summary: "Update current user profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully." })
  updateMe(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateMe(updateUserDto);
  }

  @Post("skills")
  @ApiOperation({ summary: "Add a new skill to current user" })
  @ApiResponse({ status: 201, description: "Skill added successfully." })
  @ApiResponse({
    status: 409,
    description: "Skill type already exists for user.",
  })
  addUserSkill(@Body() createUserSkillDto: CreateUserSkillDto) {
    return this.usersService.addUserSkill(createUserSkillDto);
  }

  @Delete("skills/:id")
  @ApiOperation({ summary: "Remove a skill from current user" })
  @ApiResponse({ status: 200, description: "Skill removed successfully." })
  @ApiResponse({ status: 404, description: "Skill not found for user." })
  removeUserSkill(@Param("id") id: string) {
    return this.usersService.removeUserSkill(id);
  }
}
