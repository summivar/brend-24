import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactsDto {
  @ApiProperty({example: 'State, region..', description: 'Адрес'})
  @IsString()
  address: string;

  @ApiProperty({example: ['+79876543210'], description: 'Номер телефона'})
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  number: string[];

  @ApiProperty({example: ['email@mail.ru'], description: 'Почта'})
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  email: string[];

  @ApiProperty({example: 'https://whatapp.com/tutu', description: 'Ссылка на WhatsApp'})
  @IsString()
  whatsappLink: string;
}