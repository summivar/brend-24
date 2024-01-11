import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { CreateAboutDto, EditAboutDto } from './dtos';
import { AdminGuard } from '../auth/guards';

@ApiTags('О конкурсе')
@Controller('about')
export class AboutController {
  constructor(private aboutService: AboutService) {
  }

  @ApiOperation({summary: 'Получение информации о конкурсе'})
  @Get('get')
  async get() {
    return this.aboutService.get();
  }

  @ApiOperation({summary: 'Создание информации о конкурсе'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Post('create')
  async create(@Body() createDto: CreateAboutDto) {
    return this.aboutService.create(createDto);
  }

  @ApiOperation({summary: 'Изменение информации о конкурсе'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Put('edit')
  async edit(@Body() editDto: EditAboutDto) {
    return this.aboutService.edit(editDto);
  }
}
