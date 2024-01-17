import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CoversService } from './covers.service';
import { CreateCoverDto } from './dtos';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';
import { AdminGuard } from '../auth/guards';
import { ParseObjectIdPipe } from '../pipes';
import { ObjectId } from 'mongoose';

@ApiTags('Обложки')
@Controller('covers')
export class CoversController {
  constructor(private coverService: CoversService) {
  }

  @ApiOperation({ summary: 'Получение всех обложек' })
  @Get('getAll')
  async getAll() {
    return this.coverService.getAll();
  }

  @ApiOperation({ summary: 'Получение обложки по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID обложки',
  })
  @Get('get/:id')
  async getById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.coverService.getById(id);
  }

  @ApiOperation({ summary: 'Создание обложки' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('photos', 10, {
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
  async create(@Body() createDto: CreateCoverDto, @UploadedFiles() photos: Array<Express.Multer.File>) {
    return this.coverService.create(photos);
  }

  @ApiOperation({ summary: 'Добавление фото к обложке' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('photos', 10, {
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
    description: 'ID обложки',
  })
  @Post('addPhoto/:id')
  async addPhotosToCover(
    @Body() createDto: CreateCoverDto,
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @Param('id', new ParseObjectIdPipe()) id: ObjectId,
  ) {
    return this.coverService.addPhotosToCover(id, photos);
  }

  @ApiOperation({ summary: 'Удаление обложки по ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID обложки',
  })
  @Delete('delete/:id')
  async deleteParticipantById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.coverService.deleteById(id);
  }

  @ApiOperation({ summary: 'Удаление всех обложек' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('deleteAll')
  async deleteAllParticipants() {
    return this.coverService.deleteAll();
  }
}
