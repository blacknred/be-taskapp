import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SortingDto {
  @IsString({ message: 'Must be a string' })
  field: string;
  @IsString({ message: 'Must be a string' })
  direction: string;
}

export class GetTasksDto extends PartialType(CreateTaskDto) {
  @IsNumber(null, { message: 'Must be an integer' })
  limit: number;
  @IsString({ message: 'Must be a string' })
  cursor: string;
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  sorting?: SortingDto;
}
