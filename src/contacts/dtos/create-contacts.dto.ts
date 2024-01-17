import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactsDto {
  @ApiProperty({example: 'State, region..', description: 'Адрес'})
  @IsString()
  address: string;

  @ApiProperty({example: '+79876543210', description: 'Номер телефона'})
  @IsString()
  number: string;

  @ApiProperty({example: 'email@mail.ru', description: 'Почта'})
  @IsString()
  email: string;

  @ApiProperty({example: 'https://whatapp.com/tutu', description: 'Ссылка на WhatsApp'})
  @IsString()
  whatsappLink: string;
}