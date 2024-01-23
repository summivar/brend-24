import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditContactsDto {
  @ApiProperty({example: ['State, region..'], description: 'Адрес', required: false})
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  address: string[];

  @ApiProperty({example: ['+79876543210'], description: 'Номер телефона', required: false})
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  number: string[];

  @ApiProperty({example: ['email@mail.ru'], description: 'Почта', required: false})
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({example: 'https://whatapp.com/tutu', description: 'Ссылка на WhatsApp', required: false})
  @IsString()
  @IsOptional()
  whatsappLink: string;
}