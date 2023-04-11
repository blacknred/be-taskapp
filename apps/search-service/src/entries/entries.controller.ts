import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllExceptionFilter, Auth, Session } from '@taskapp/shared';
import { EntriesResponseDto } from './dto/entries-response.dto';
import { GetEntriesDto } from './dto/get-entries.dto';
import { GetEntriesQuery } from './queries/impl/get-entries.query';

@Auth()
@ApiTags('Search')
@Controller('search')
@UseFilters(AllExceptionFilter)
export class EntriesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ description: 'List all search results' })
  @ApiOkResponse({ type: EntriesResponseDto })
  getAll(
    @Session('userId') userId,
    @Session('projectIds') projectIds,
    @Query() dto: GetEntriesDto,
  ): Promise<EntriesResponseDto> {
    return this.queryBus.execute(new GetEntriesQuery(dto, userId, projectIds));
  }
}