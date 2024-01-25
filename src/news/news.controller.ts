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
import { NewsService } from './news.service';
import { CreateNewsDto, EditNewsDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';
import { ParseObjectIdPipe } from '../pipes';
import { ObjectId } from 'mongoose';
import { AdminGuard } from '../auth/guards';

@ApiTags('Новости')
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {
  }

  @ApiOperation({ summary: 'Получение всех новостей, отсортированных по дате, более новые первее' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description:
      'Размер страницы. Выдаёт столько новостей, сколько указано здесь, либо же столько, сколько осталось. ' +
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
  async getAllNews(
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('pageNumber', new ParseIntPipe({ optional: true })) pageNumber?: number,
  ) {
    return this.newsService.getAllNews(pageSize, pageNumber);
  }

  @ApiOperation({ summary: 'Получение новости по slug или id' })
  @ApiQuery({
    name: 'slug',
    required: false,
    description: 'Для поиска по Slug',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Для поиска по ID',
  })
  @Get('getBy')
  async getBy(@Query('slug') slug?: string, @Query('id', new ParseObjectIdPipe({ isOptional: true })) id?: ObjectId) {
    return this.newsService.getBy(slug, id);
  }

  @ApiOperation({ summary: 'Добавление новости' })
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
  @Post('create')
  async create(@Body() createDto: CreateNewsDto, @UploadedFile() image: Express.Multer.File) {
    return this.newsService.create(createDto, image);
  }

  @ApiOperation({ summary: 'Изменение новости' })
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
    description: 'ID новости',
  })
  @Put('edit/:id')
  async edit(@Body() editDto: EditNewsDto, @UploadedFile() image: Express.Multer.File, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.newsService.edit(editDto, image, id);
  }

  @ApiOperation({ summary: 'Удаление новости' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID новости',
  })
  @Delete('delete/:id')
  async deleteById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.newsService.deleteById(id);
  }
}
