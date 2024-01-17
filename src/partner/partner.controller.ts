import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PartnerService } from './partner.service';
import { ParseObjectIdPipe } from '../pipes';
import { ObjectId } from 'mongoose';
import { CreatePartnerDto, EditPartnerDto } from './dtos';
import { AdminGuard } from '../auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';

@ApiTags('Партнеры')
@Controller('partner')
export class PartnerController {
  constructor(private partnerService: PartnerService) {
  }

  @ApiOperation({ summary: 'Получение всех партнеров' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description:
      'Размер страницы. Выдаёт столько партнеров, сколько указано здесь, либо же столько, сколько осталось. ' +
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
    return this.partnerService.getAll(pageSize, pageNumber);
  }

  @ApiOperation({ summary: 'Получение партнера по id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Для поиска по Id',
  })
  @Get('get/:id')
  async getById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.partnerService.getById(id);
  }

  @ApiOperation({ summary: 'Создание нового партнера' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', {
    limits: {
      fieldSize: FILE_LIMIT.PHOTO_SIZE,
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype.startsWith('image/') && /\.(png|jpeg|jpg)$/.test(extname(file.originalname).toLowerCase())) {
        callback(null, true);
      } else {
        callback(new ValidationException('Only image files with extensions .png, .jpeg, and .jpg are allowed.'), false);
      }
    },
  }))
  @Post('create')
  async create(@Body() createDto: CreatePartnerDto, @UploadedFile() logo: Express.Multer.File) {
    return this.partnerService.create(createDto, logo);
  }

  @ApiOperation({ summary: 'Изменение партнера' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', {
    limits: {
      fieldSize: FILE_LIMIT.PHOTO_SIZE,
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype.startsWith('image/') && /\.(png|jpeg|jpg)$/.test(extname(file.originalname).toLowerCase())) {
        callback(null, true);
      } else {
        callback(new ValidationException('Only image files with extensions .png, .jpeg, and .jpg are allowed.'), false);
      }
    },
  }))
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID парнетра',
  })
  @Put('edit/:id')
  async edit(@Body() editDto: EditPartnerDto, @UploadedFile() logo: Express.Multer.File, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.partnerService.edit(editDto, logo, id);
  }

  @ApiOperation({ summary: 'Удаление партнера по ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID партнера',
  })
  @Delete('delete/:id')
  async deleteById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.partnerService.deleteById(id);
  }

  @ApiOperation({ summary: 'Удаление всех партнеров' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('deleteAll')
  async deleteAll() {
    return this.partnerService.deleteAll();
  }
}
