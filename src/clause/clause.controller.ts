import { Body, Controller, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards';
import { CreateClauseDto, EditClauseDto } from './dtos';
import { ClauseService } from './clause.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';

@ApiTags('Положение')
@Controller('clause')
export class ClauseController {
  constructor(private clauseService: ClauseService) {
  }

  @ApiOperation({ summary: 'Получение положения' })
  @Get('get')
  async get() {
    return this.clauseService.get();
  }

  @ApiOperation({ summary: 'Создание положения' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fieldSize: FILE_LIMIT.PDF_SIZE,
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype === 'application/pdf' && /\.(pdf)$/.test(extname(file.originalname).toLowerCase())) {
        callback(null, true);
      } else {
        callback(new ValidationException('Only PDF files with the extension .pdf are allowed.'), false);
      }
    },
  }))
  @UseGuards(AdminGuard)
  @Post('create')
  async create(@Body() createDto: CreateClauseDto, @UploadedFile() file: Express.Multer.File) {
    return this.clauseService.create(file);
  }

  @ApiOperation({ summary: 'Изменение положения' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fieldSize: FILE_LIMIT.PDF_SIZE,
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype === 'application/pdf' && /\.(pdf)$/.test(extname(file.originalname).toLowerCase())) {
        callback(null, true);
      } else {
        callback(new ValidationException('Only PDF files with the extension .pdf are allowed.'), false);
      }
    },
  }))
  @UseGuards(AdminGuard)
  @Put('edit')
  async edit(@Body() editDto: EditClauseDto, @UploadedFile() file: Express.Multer.File) {
    return this.clauseService.edit(file);
  }
}
