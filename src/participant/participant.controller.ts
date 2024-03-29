import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto, EditParticipantDto } from './dtos';
import { ParseObjectIdPipe } from '../pipes';
import { ObjectId, Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_LIMIT } from '../constants';
import { extname } from 'path';
import { ValidationException } from '../exceptions';
import { AdminGuard } from '../auth/guards';

@ApiTags('Участники')
@Controller('participant')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {
  }

  @ApiOperation({ summary: 'Получение всех участников' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description:
      'Размер страницы. Выдаёт столько участников, сколько указано здесь, либо же столько, сколько осталось. ' +
      'Если не указан один из "pageNumber" и "pageSize", их проигнорируют.',
  })
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    description:
      'Номер страницы. Страницы начинаются с 1. ' +
      'Если не указан один из "pageNumber" и "pageSize", их проигнорируют.',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'При sort=true, вывод от новых к старым. При sort=false или undefined, вывод от старых к новым',
  })
  @Get('getAllParticipants')
  async getAllParticipants(
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('pageNumber', new ParseIntPipe({ optional: true })) pageNumber?: number,
    @Query('sort', new ParseBoolPipe({ optional: true })) sort?: boolean,
  ) {
    return this.participantService.getAllParticipants(pageSize, pageNumber, sort);
  }

  @ApiOperation({ summary: 'Получение участника по name или Id' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Для поиска по name',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Для поиска по Id',
  })
  @Get('getParticipantBy')
  async getParticipantBy(@Query('name') name?: string, @Query('id', new ParseObjectIdPipe({ isOptional: true })) id?: ObjectId) {
    return this.participantService.getParticipantBy(name, id);
  }

  @ApiOperation({ summary: 'Получение участников по district' })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID district',
  })
  @Get('getAllByDistrict/:id')
  async getAllByDistrict(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.participantService.getAllParticipantsByDistrictId(id);
  }

  @Get('getAllByDistrict')
  async getAllByDistrictWithoutId() {
    return this.participantService.getAllParticipantsByDistrictId();
  }

  @ApiOperation({ summary: 'Добавление участника' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', {
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
  async create(@Body() createDto: CreateParticipantDto, @UploadedFile() logo: Express.Multer.File) {
    return this.participantService.create(createDto, logo);
  }

  @ApiOperation({ summary: 'Изменение участника' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', {
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
    description: 'ID участника',
  })
  @Put('edit/:id')
  async edit(@Body() editDto: EditParticipantDto, @UploadedFile() logo: Express.Multer.File, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.participantService.edit(editDto, logo, id);
  }

  @ApiOperation({ summary: 'Удаление всех участников' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('deleteAll')
  async deleteAllParticipants() {
    return this.participantService.deleteAllParticipants();
  }

  @ApiOperation({ summary: 'Удаление участника по ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID участника',
  })
  @Delete('delete/:id')
  async deleteParticipantById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.participantService.deleteParticipantById(id);
  }
}
