import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto, EditEventDto } from './dtos';
import { ObjectId } from 'mongoose';
import { ParseObjectIdPipe } from '../pipes';
import { AdminGuard } from '../auth/guards';

@ApiTags('Мероприятия')
@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {
  }

  @ApiOperation({ summary: 'Получение всех мероприятий' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description:
      'Размер страницы. Выдаёт столько мероприятий, сколько указано здесь, либо же столько, сколько осталось. ' +
      'Если не указан один из "pageNumber" и "pageSize", их проигнорируют.',
  })
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    description:
      'Номер страницы. Страницы начинаются с 1. ' +
      'Если не указан один из "pageNumber" и "pageSize", их проигнорируют.',
  })
  @Get('getAll')
  async getAll(
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('pageNumber', new ParseIntPipe({ optional: true })) pageNumber?: number,
  ) {
    return this.eventService.getAll(pageSize, pageNumber);
  }

  @ApiOperation({ summary: 'Получение мероприятия по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID мероприятия',
  })
  @Get('get/:id')
  async getById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.eventService.getById(id);
  }

  @ApiOperation({ summary: 'Создание мероприятия' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Post('create')
  async create(@Body() createDto: CreateEventDto) {
    return this.eventService.create(createDto);
  }

  @ApiOperation({ summary: 'Изменение мероприятия' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID мероприятия',
  })
  @Put('edit/:id')
  async edit(@Body() editDto: EditEventDto, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.eventService.edit(editDto, id);
  }

  @ApiOperation({ summary: 'Удаление всех мероприятий' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('deleteAll')
  async deleteAll() {
    return this.eventService.deleteAll();
  }

  @ApiOperation({ summary: 'Удаление мероприятия по ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID мероприятия',
  })
  @Delete('delete/:id')
  async deleteById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.eventService.deleteById(id);
  }
}
