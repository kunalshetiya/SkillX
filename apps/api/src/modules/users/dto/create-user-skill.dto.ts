import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SkillType, SkillLevel } from "@skillx/database";

export class CreateUserSkillDto {
  @ApiProperty({ example: "TypeScript", description: "The name of the skill" })
  @IsString()
  skillName: string;

  @ApiProperty({ enum: SkillType, example: SkillType.OFFERING })
  @IsEnum(SkillType)
  type: SkillType;

  @ApiProperty({ enum: SkillLevel, example: SkillLevel.INTERMEDIATE })
  @IsEnum(SkillLevel)
  level: SkillLevel;

  @ApiPropertyOptional({
    example: 3,
    description: "Years of experience in this skill",
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  yearsExperience?: number;

  @ApiPropertyOptional({
    example: "I have built several production apps using TypeScript.",
    description: "A brief description of your proficiency",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
