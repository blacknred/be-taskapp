import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedRequestDto } from '@taskapp/service-core';
import { IsIn, IsOptional, IsUUID, Length } from 'class-validator';

export class GetTagsDto extends OmitType(PaginatedRequestDto, ['sort.field']) {
  @ApiProperty({ type: 'string', example: 'name', required: false })
  @IsOptional()
  @IsIn(['name'], {
    message: 'Must be a one of the fields: "name"',
  })
  'sort.field'?: 'name';

  @ApiProperty({
    type: 'uuid',
    example: 'b4db61c5-d10e-4ed3-a903-b8fd75fc3d30',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'Must be an uuid' })
  projectId: string;

  @ApiProperty({ type: 'string', example: 'Extra feature', required: false })
  @IsOptional()
  @Length(0, 30, { message: 'Must have up to 50 chars' })
  name?: string;
}