import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards';
import { CreateVoteDto, EditVoteDto } from './dtos';

@ApiTags('Голосование')
@Controller('vote')
export class VoteController {
  constructor(private voteService: VoteService) {
  }

  @ApiOperation({ summary: 'Получение голосования' })
  @Get('get')
  async get() {
    return this.voteService.get();
  }

  @ApiOperation({ summary: 'Создание голосования' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Post('create')
  async create(@Body() createDto: CreateVoteDto) {
    return this.voteService.create(createDto);
  }

  @ApiOperation({ summary: 'Изменение голосования' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Put('edit')
  async edit(@Body() editDto: EditVoteDto) {
    return this.voteService.edit(editDto);
  }
}
