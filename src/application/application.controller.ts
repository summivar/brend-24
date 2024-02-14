import { Body, Controller, Delete, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards';
import {
  CreateApplicationLbkDto,
  CreateApplicationLbmoDto,
  EditApplicationLbkDto,
  EditApplicationLbmoDto,
} from './dtos';
import { ApplicationService } from './application.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';

@ApiTags('Форма заявки ЛБК и ЛБМО')
@Controller('application')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {
  }

  @ApiOperation({ summary: 'Получение формы заявки ЛБК' })
  @Get('get/lbk')
  async getLBK() {
    return this.applicationService.getLBK();
  }

  @ApiOperation({ summary: 'Получение формы заявки ЛБМО' })
  @Get('get/lbmo')
  async getLBMO() {
    return this.applicationService.getLBMO();
  }

  @ApiOperation({ summary: 'Создание формы заявки ЛБК' })
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
  @Post('create/lbk')
  async createLBK(@Body() createDto: CreateApplicationLbkDto, @UploadedFile() file: Express.Multer.File) {
    return this.applicationService.createLBK(file);
  }

  @ApiOperation({ summary: 'Создание формы заявки ЛБМО' })
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
  @Post('create/lbmo')
  async createLBMO(@Body() createDto: CreateApplicationLbmoDto, @UploadedFile() file: Express.Multer.File) {
    return this.applicationService.createLBMO(file);
  }

  @ApiOperation({ summary: 'Изменение формы заявки ЛБК' })
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
  @Put('edit/lbk')
  async editLBK(@Body() editDto: EditApplicationLbkDto, @UploadedFile() file: Express.Multer.File) {
    return this.applicationService.editLBK(file);
  }

  @ApiOperation({ summary: 'Изменение формы заявки ЛБМО' })
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
  @Put('edit/lbmo')
  async editLBMO(@Body() editDto: EditApplicationLbmoDto, @UploadedFile() file: Express.Multer.File) {
    return this.applicationService.editLBMO(file);
  }

  @ApiOperation({ summary: 'Удаление формы ЛБК' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('delete/lbk')
  async deleteLBK() {
    return this.applicationService.deleteLBK();
  }

  @ApiOperation({ summary: 'Удаление формы ЛБК' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('delete/lbmo')
  async deleteLBMO() {
    return this.applicationService.deleteLBMO();
  }
}
