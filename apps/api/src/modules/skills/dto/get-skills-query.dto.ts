import { IsOptional, IsString, IsEnum } from 'class-validator';
import { SkillType, SkillLevel } from '@skillx/database';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSkillsQueryDto {
  @ApiPropertyOptional({ description: 'Search by skill name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: SkillType, description: 'Filter by offering or learning' })
  @IsOptional()
  @IsEnum(SkillType)
  type?: SkillType;

  @ApiPropertyOptional({ enum: SkillLevel, description: 'Filter by proficiency level' })
  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;
}
