import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditContactsDto {
  @ApiProperty({example: 'State, region..', description: 'Адрес'})
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({example: '+79876543210', description: 'Номер телефона'})
  @IsString()
  @IsOptional()
  number: string;

  @ApiProperty({example: 'email@mail.ru', description: 'Почта'})
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({example: 'https://whatapp.com/tutu', description: 'Ссылка на WhatsApp'})
  @IsString()
  @IsOptional()
  whatsappLink: string;
}