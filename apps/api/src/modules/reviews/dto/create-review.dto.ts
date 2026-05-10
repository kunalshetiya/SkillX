import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID of the completed session being reviewed' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Optional feedback comment' })
  @IsString()
  @IsOptional()
  comment?: string;
}
