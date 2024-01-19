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
import { WinnerService } from './winner.service';
import { AdminGuard } from '../auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';
import { ParseObjectIdPipe } from '../pipes';
import { ObjectId } from 'mongoose';
import { CreateWinnerDto, EditWinnerDto } from './dtos';

@ApiTags('Победители')
@Controller('winner')
export class WinnerController {
  constructor(private winnerService: WinnerService) {
  }

  @ApiOperation({ summary: 'Получение всех победителей' })
  @Get('getAll')
  async getAll() {
    return this.winnerService.getAll();
  }

  @ApiOperation({ summary: 'Получение победителя по Id' })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID победителя',
  })
  @Get('get/:id')
  async getById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.winnerService.getById(id);
  }

  @ApiOperation({ summary: 'Создание победителя' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
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
  @Post('create')
  async create(@Body() createDto: CreateWinnerDto, @UploadedFile() file: Express.Multer.File) {
    return this.winnerService.create(createDto, file);
  }

  @ApiOperation({ summary: 'Изменение победителя' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
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
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID победителя',
  })
  @Put('edit/:id')
  async edit(@Body() editDto: EditWinnerDto, @UploadedFile() file: Express.Multer.File, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.winnerService.edit(id, editDto, file);
  }

  @ApiOperation({ summary: 'Удаление победителя по ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID победителя',
  })
  @Delete('delete/:id')
  async deleteById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.winnerService.deleteById(id);
  }

  @ApiOperation({ summary: 'Удаление всех победителей' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('deleteAll')
  async deleteAll() {
    return this.winnerService.deleteAll();
  }
}
