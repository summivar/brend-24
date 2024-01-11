import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactsDto, EditContactsDto } from './dtos';
import { AdminGuard } from '../auth/guards';

@ApiTags('Контакты')
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {
  }

  @ApiOperation({summary: 'Получение контакта'})
  @Get('get')
  async get() {
    return this.contactsService.get();
  }

  @ApiOperation({summary: 'Создание контакта'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Post('create')
  async create(@Body() createDto: CreateContactsDto) {
    return this.contactsService.create(createDto);
  }

  @ApiOperation({summary: 'Изменение контакта'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminGuard)
  @Put('edit')
  async edit(@Body() editDto: EditContactsDto) {
    return this.contactsService.edit(editDto);
  }
}
