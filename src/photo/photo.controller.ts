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
import { PhotoService } from './photo.service';
import { ParseObjectIdPipe } from '../pipes';
import { ObjectId } from 'mongoose';
import { CreatePhotoDto, EditPhotoDto } from './dtos';
import { ValidationException } from '../exceptions';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { FILE_LIMIT } from '../constants/file-limits.constants';
import { AdminGuard } from '../auth/guards';

@ApiTags('Фото')
@Controller('photo')
export class PhotoController {
  constructor(private photoService: PhotoService) {
  }

  @ApiOperation({ summary: 'Получение всех фото' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description:
      'Размер страницы. Выдаёт столько фото, сколько указано здесь, либо же столько, сколько осталось. ' +
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
    return this.photoService.getAll(pageSize, pageNumber);
  }

  @ApiOperation({ summary: 'Добавление фото' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', {
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
  @Post('add')
  async add(@Body() createDto: CreatePhotoDto, @UploadedFile() image: Express.Multer.File) {
    return this.photoService.add(createDto, image);
  }

  @ApiOperation({ summary: 'Изменение фото' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', {
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
    description: 'ID фото',
  })
  @Put('edit/:id')
  async edit(@Body() editDto: EditPhotoDto, @UploadedFile() image: Express.Multer.File, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.photoService.edit(editDto, image, id);
  }

  @ApiOperation({ summary: 'Удаление фото по ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID фото',
  })
  @Delete('delete/:id')
  async deleteById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.photoService.deleteById(id);
  }

  @ApiOperation({ summary: 'Удаление всех фото' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('deleteAll')
  async deleteAll() {
    return this.photoService.deleteAll();
  }
}
