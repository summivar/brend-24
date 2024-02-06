import { Body, Controller, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards';
import { CreateDisposalDto, EditDisposalDto } from './dtos';
import { DisposalService } from './disposal.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';

@ApiTags('Распоряжение')
@Controller('disposal')
export class DisposalController {
  constructor(private disposalService: DisposalService) {
  }

  @ApiOperation({summary: 'Получение распоряжения'})
  @Get('get')
  async get() {
    return this.disposalService.get();
  }

  @ApiOperation({summary: 'Создание распоряжения'})
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
  async create(@Body() createDto: CreateDisposalDto, @UploadedFile() file: Express.Multer.File) {
    return this.disposalService.create(file);
  }

  @ApiOperation({summary: 'Изменение распоряжения'})
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
  async edit(@Body() editDto: EditDisposalDto, @UploadedFile() file: Express.Multer.File) {
    return this.disposalService.edit(file);
  }
}
