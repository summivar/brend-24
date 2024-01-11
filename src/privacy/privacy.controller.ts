import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrivacyService } from './privacy.service';
import { CreatePrivacyDto, EditPrivacyDto } from './dtos';
import { AdminGuard } from '../auth/guards';

@ApiTags('Политика конфиденциальности')
@Controller('privacy')
export class PrivacyController {
  constructor(private privacyService: PrivacyService) {
  }

  @ApiOperation({summary: 'Получение политики конфиденциальности'})
  @Get('get')
  async get() {
    return this.privacyService.get();
  }

  @ApiOperation({summary: 'Создание политики конфиденциальности'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Post('create')
  async create(@Body() createDto: CreatePrivacyDto) {
    return this.privacyService.create(createDto);
  }

  @ApiOperation({summary: 'Изменение политики конфиденциальности'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Put('edit')
  async edit(@Body() editDto: EditPrivacyDto) {
    return this.privacyService.edit(editDto);
  }
}
