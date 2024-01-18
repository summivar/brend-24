import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DistrictService } from './district.service';
import { CreateDistrictDto, UpdateDistrictDto } from './dtos';
import { AdminGuard } from '../auth/guards';
import { ParseObjectIdPipe } from '../pipes';
import { ObjectId } from 'mongoose';

@ApiTags('Районы')
@Controller('district')
export class DistrictController {
  constructor(private districtService: DistrictService) {
  }

  @ApiOperation({ summary: 'Получение всех районов' })
  @Get('getAllDistrict')
  async getAllDistrict() {
    return this.districtService.getAllDistricts();
  }

  @ApiOperation({ summary: 'Получение района по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID района',
  })
  @Get('get/:id')
  async getById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.districtService.getById(id);
  }

  @ApiOperation({ summary: 'Создание района' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Post('create')
  async create(@Body() createDto: CreateDistrictDto) {
    return this.districtService.createDistrict(createDto.name);
  }

  @ApiOperation({ summary: 'Изменение района' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID района',
  })
  @UseGuards(AdminGuard)
  @Put('edit/:id')
  async edit(
    @Body() createDto: UpdateDistrictDto,
    @Param('id', new ParseObjectIdPipe()) id: ObjectId,
  ) {
    return this.districtService.edit(id, createDto.name);
  }

  @ApiOperation({ summary: 'Удаление района по ID' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ObjectID',
    description: 'ID района',
  })
  @Delete('delete/:id')
  async deleteDistrictById(@Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.districtService.deleteDistrictById(id);
  }

  @ApiOperation({ summary: 'Удаление всех районов' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Delete('deleteAll')
  async deleteAllDistrict() {
    return this.districtService.deleteAllDistrict();
  }
}
