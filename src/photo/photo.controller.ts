import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
  @Get('getAll')
  async getAll() {
    return this.photoService.getAll();
  }

  @ApiOperation({ summary: 'Добавление фото' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', {
    limits: {
      fieldSize: FILE_LIMIT.PHOTO_SIZE
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype.startsWith('image/') && /\.(png|jpeg|jpg)$/.test(extname(file.originalname).toLowerCase())) {
        callback(null, true);
      } else {
        callback(new ValidationException('Only image files with extensions .png, .jpeg, and .jpg are allowed.'), false);
      }
    }
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
      fieldSize: FILE_LIMIT.PHOTO_SIZE
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype.startsWith('image/') && /\.(png|jpeg|jpg)$/.test(extname(file.originalname).toLowerCase())) {
        callback(null, true);
      } else {
        callback(new ValidationException('Only image files with extensions .png, .jpeg, and .jpg are allowed.'), false);
      }
    }
  }))
  @Put('edit')
  async edit(@Body() editDto: EditPhotoDto, @UploadedFile() image: Express.Multer.File) {
    return this.photoService.edit(editDto, image);
  }

  @ApiOperation({summary: 'Удаление фото по ID'})
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

  @ApiOperation({summary: 'Удаление всех фото'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('deleteAll')
  async deleteAll() {
    return this.photoService.deleteAll();
  }
}
