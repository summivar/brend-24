import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class EditEventDto {
  @ApiProperty({ example: 'Name', description: 'Название мероприятия', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'Date', description: 'Время начала мероприятия', required: false })
  @IsString()
  @IsOptional()
  date: string;

  @ApiProperty({ example: 'text', description: 'Описание мероприятия', required: false })
  @IsString()
  @IsOptional()
  description: string;
}