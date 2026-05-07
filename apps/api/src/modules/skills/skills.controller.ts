import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkillsService } from './skills.service.js';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto.js';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Find all skills in the marketplace' })
  @ApiResponse({ status: 200, description: 'Return list of user skills with user info.' })
  findAll(@Query() query: GetSkillsQueryDto) {
    return this.skillsService.findAll(query);
  }
}
