import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class EditEventDto {
  @ApiProperty({ example: 'Name', description: 'Название мероприятия', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: '2024-01-11T11:42:46+0000', description: 'Время начала мероприятия', required: false })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @IsOptional()
  startTime: Date;

  @ApiProperty({ example: '2024-01-11T11:43:15+0000', description: 'Время окончания мероприятия', required: false })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @IsOptional()
  endTime: Date;

  @ApiProperty({ example: 'text', description: 'Описание мероприятия', required: false })
  @IsString()
  @IsOptional()
  description: string;
}