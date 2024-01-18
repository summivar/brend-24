import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CoverService } from './cover.service';
import { AdminGuard } from '../auth/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';
import { AddPhotosCoverDto } from './dtos';

@ApiTags('Обложки')
@Controller('cover')
export class CoverController {
  constructor(private coverService: CoverService) {
  }

  @ApiOperation({ summary: 'Получение обложки' })
  @Get('get')
  async get() {
    return this.coverService.get();
  }

  @ApiOperation({ summary: 'Добавление фото к обложке' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
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
  @Post('addPhotos')
  async addPhotosToCover(@Body() addPhotosCoverDto: AddPhotosCoverDto, @UploadedFiles() photos: Array<Express.Multer.File>) {
    return this.coverService.addPhotosToCover(photos);
  }

  @ApiOperation({ summary: 'Удаление фото из обложки' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'index',
    required: true,
    example: 'index',
    description: 'index удаляемой фото, начинается с 0',
  })
  @Delete('deletePhoto/:index')
  async deletePhoto(@Param('index', new ParseIntPipe()) index: number) {
    return this.coverService.deletePhoto(index);
  }
}
