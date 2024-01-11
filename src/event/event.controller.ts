import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
  @Get('getAll')
  async getAll() {
    return this.eventService.getAll();
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
  @Put('edit')
  async edit(@Body() editDto: EditEventDto) {
    return this.eventService.edit(editDto);
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
