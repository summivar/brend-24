import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAboutDto {
  @ApiProperty({example: 'History...', description: 'История конкурса'})
  @IsString()
  history: string;

  @ApiProperty({example: 'For me, for you..', description: 'Для кого этот конкурс'})
  @IsString()
  forWhoThis: string;

  @ApiProperty({example: '1. Samy krutoi', description: 'Номинации конкурса'})
  @IsString()
  nominations: string;

  @ApiProperty({example: 'For you, for me..', description: 'Приглашение на участие'})
  @IsString()
  invitation: string;

  @ApiProperty({example: 'Write us "112" to messenger', description: 'Как принять участие'})
  @IsString()
  howToAccept: string;

  @ApiProperty({example: 'Dont be rude', description: 'Условия участия'})
  @IsString()
  termsOfParticipation: string;
}