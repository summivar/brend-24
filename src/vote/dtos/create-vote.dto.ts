import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteDto {
  @ApiProperty({ example: 'link', description: 'Ссылка голосования' })
  @IsString()
  link: string;

  @ApiProperty({ example: 5, description: 'ID голосования' })
  @IsInt()
  votingId: number;

  @ApiProperty({
    example: 'true',
    description: 'Врублено ли голосование, необязательный. По дефолту false.',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isEnabled: boolean;
}