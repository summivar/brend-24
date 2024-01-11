import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditAboutDto {
  @ApiProperty({example: 'History...', description: 'История конкурса'})
  @IsString()
  @IsOptional()
  history: string;

  @ApiProperty({example: 'For me, for you..', description: 'Для кого этот конкурс'})
  @IsString()
  @IsOptional()
  forWhoThis: string;

  @ApiProperty({example: '1. Samy krutoi', description: 'Номинации конкурса'})
  @IsString()
  @IsOptional()
  nominations: string;

  @ApiProperty({example: 'For you, for me..', description: 'Приглашение на участие'})
  @IsString()
  @IsOptional()
  invitation: string;

  @ApiProperty({example: 'Write us "112" to messenger', description: 'Как принять участие'})
  @IsString()
  @IsOptional()
  howToAccept: string;

  @ApiProperty({example: 'Dont be rude', description: 'Условия участия'})
  @IsString()
  @IsOptional()
  termsOfParticipation: string;
}