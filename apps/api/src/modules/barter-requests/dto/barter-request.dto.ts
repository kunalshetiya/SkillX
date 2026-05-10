import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBarterRequestDto {
  @ApiProperty({ description: 'ID of the user to send the request to' })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ description: 'ID of the UserSkill offered by the sender' })
  @IsString()
  @IsNotEmpty()
  offeredUserSkillId: string;

  @ApiProperty({ description: 'ID of the UserSkill requested from the receiver' })
  @IsString()
  @IsNotEmpty()
  requestedUserSkillId: string;

  @ApiProperty({ description: 'Optional message to the receiver', required: false })
  @IsString()
  @IsOptional()
  message?: string;
}

export class UpdateBarterRequestStatusDto {
  @ApiProperty({ 
    description: 'New status of the barter request',
    enum: ['ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED']
  })
  @IsString()
  @IsNotEmpty()
  status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
}
