import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'text', description: 'Название мероприятия' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Date', description: 'Время начала мероприятия' })
  @IsString()
  date: string;

  @ApiProperty({ example: 'text', description: 'Описание мероприятия' })
  @IsString()
  description: string;
}