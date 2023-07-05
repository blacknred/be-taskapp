import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsUUID, Length } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    type: 'uuid',
    example: 'b4db61c5-d10e-4ed3-a903-b8fd75fc3d30',
  })
  @IsUUID(4, { message: 'Must be an uuid' })
  projectId: string;

  @ApiProperty({ type: 'string', example: 'Extra feature' })
  @Length(5, 30, { message: 'Must have from 3 to 50 chars' })
  name: string;

  @ApiProperty({ type: 'hex color', example: '#333333' })
  @IsOptional()
  @IsHexColor({ message: 'Non valid hex color' })
  color?: string;
}