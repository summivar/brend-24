import { Body, Controller, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards';
import { CreateCommissionDto, EditCommissionDto } from './dtos';
import { CommissionService } from './commission.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';

@ApiTags('Коммиссия')
@Controller('commission')
export class CommissionController {
  constructor(private commissionService: CommissionService) {
  }

  @ApiOperation({summary: 'Получение комиссии'})
  @Get('get')
  async get() {
    return this.commissionService.get();
  }

  @ApiOperation({summary: 'Создание комиссии'})
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
  async create(@Body() createDto: CreateCommissionDto, @UploadedFile() file: Express.Multer.File) {
    return this.commissionService.create(file);
  }

  @ApiOperation({summary: 'Изменение комиссии'})
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
  async edit(@Body() editDto: EditCommissionDto, @UploadedFile() file: Express.Multer.File) {
    return this.commissionService.edit(file);
  }
}
