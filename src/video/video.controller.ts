import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Post,
  Put, Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { ParseObjectIdPipe } from '../pipes';
import { ObjectId } from 'mongoose';
import { CreateVideoDto, EditVideoDto } from './dtos';
import { ValidationException } from '../exceptions';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { FILE_LIMIT } from '../constants';
import { AdminGuard } from '../auth/guards';

@ApiTags('Видео')
@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {
  }

  @ApiOperation({ summary: 'Получение всех видео' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description:
      'Размер страницы. Выдаёт столько видео, сколько указано здесь, либо же столько, сколько осталось. ' +
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
    return this.videoService.getAll(pageSize, pageNumber);
  }

  @ApiOperation({ summary: 'Добавление видео' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Post('add')
  async add(@Body() createDto: CreateVideoDto) {
    return this.videoService.add(createDto);
  }

  @ApiOperation({ summary: 'Изменение видео' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID видео',
  })
  @Put('edit/:id')
  async edit(@Body() editDto: EditVideoDto, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.videoService.edit(editDto, id);
  }

  @ApiOperation({summary: 'Удаление видео по ID'})
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID видео',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('delete/:id')
  async deleteById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.videoService.deleteById(id);
  }

  @ApiOperation({summary: 'Удаление всех видео'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('deleteAll')
  async deleteAll() {
    return this.videoService.deleteAll();
  }
}
