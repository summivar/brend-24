import { Controller, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FakerService } from './faker.service';

@ApiTags('Фейковые данные')
@Controller('faker')
export class FakerController {
  constructor(private fakerService: FakerService) {
  }

  @ApiOperation({summary: 'Создание фейковых мероприятий'})
  @ApiQuery({
    name: 'fakeCount',
    required: false,
    description: 'Количество, сколько нужно создать. Должно быть >= 1. По дефолту = 10'
  })
  @Post('createFakeEvents')
  async createFakeEvents(
    @Query('fakeCount', new ParseIntPipe({optional: true})) fakeCount?: number
  ) {
    return this.fakerService.createFakeEvents(fakeCount);
  }

  @ApiOperation({summary: 'Создание фейковых новостей'})
  @ApiQuery({
    name: 'fakeCount',
    required: false,
    description: 'Количество, сколько нужно создать. Должно быть >= 1. По дефолту = 10'
  })
  @Post('createFakeNews')
  async createFakeNews(
    @Query('fakeCount', new ParseIntPipe({optional: true})) fakeCount?: number
  ) {
    return this.fakerService.createFakeNews(fakeCount);
  }

  // @ApiOperation({summary: 'Создание фейковых участников'})
  // @ApiQuery({
  //   name: 'fakeCount',
  //   required: false,
  //   description: 'Количество, сколько нужно создать. Должно быть >= 1. По дефолту = 10'
  // })
  // @Post('createFakeParticipants')
  // async createFakeParticipants(
  //   @Query('fakeCount', new ParseIntPipe({optional: true})) fakeCount?: number
  // ) {
  //   return this.fakerService.createFakeParticipants(fakeCount);
  // }
}
