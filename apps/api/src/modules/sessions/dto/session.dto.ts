import { IsString, IsNotEmpty, IsInt, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ description: 'ID of the accepted barter request' })
  @IsString()
  @IsNotEmpty()
  barterRequestId: string;

  @ApiProperty({ description: 'ID of the UserSkill being taught' })
  @IsString()
  @IsNotEmpty()
  taughtUserSkillId: string;

  @ApiProperty({ description: 'Scheduled date and time' })
  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

  @ApiProperty({ description: 'Duration in minutes', default: 60 })
  @IsInt()
  @IsOptional()
  durationMinutes?: number;

  @ApiProperty({ description: 'Meeting link (e.g., Google Meet, Zoom)' })
  @IsString()
  @IsOptional()
  meetLink?: string;

  @ApiProperty({ description: 'Optional notes for the session' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSessionStatusDto {
  @ApiProperty({ 
    enum: ['COMPLETED', 'CANCELLED', 'ONGOING'] 
  })
  @IsNotEmpty()
  status: 'COMPLETED' | 'CANCELLED' | 'ONGOING';
}
