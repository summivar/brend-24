import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgreementService } from './agreement.service';
import { CreateAgreementDto, EditAgreementDto } from './dtos';
import { AdminGuard } from '../auth/guards';

@ApiTags('Пользовательское соглашение')
@Controller('agreement')
export class AgreementController {
  constructor(private agreementService: AgreementService) {
  }

  @ApiOperation({summary: 'Получение пользовательского соглашения'})
  @Get('get')
  async get() {
    return this.agreementService.get();
  }

  @ApiOperation({summary: 'Создание пользовательского соглашения'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Post('create')
  async create(@Body() createDto: CreateAgreementDto) {
    return this.agreementService.create(createDto);
  }

  @ApiOperation({summary: 'Изменение пользовательского соглашения'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Put('edit')
  async edit(@Body() editDto: EditAgreementDto) {
    return this.agreementService.edit(editDto);
  }
}
