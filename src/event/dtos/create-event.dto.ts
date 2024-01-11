import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'text', description: 'Название мероприятия' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2024-01-11T11:42:46+0000', description: 'Время начала мероприятия' })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  startTime: Date;

  @ApiProperty({ example: '2024-01-11T11:43:15+0000', description: 'Время окончания мероприятия' })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  endTime: Date;

  @ApiProperty({ example: 'text', description: 'Описание мероприятия' })
  @IsString()
  description: string;
}