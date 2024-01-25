import { IsBooleanString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteDto {
  @ApiProperty({ example: 'link', description: 'Ссылка голосования' })
  @IsString()
  link: string;

  @ApiProperty({ example: 'id', description: 'ID голосования' })
  @IsNumber()
  votingId: number;

  @ApiProperty({
    example: 'true',
    description: 'Врублено ли голосование, необязательный. По дефолту false. Принимает "1", "0", "false", "true"',
    required: false,
  })
  @IsBooleanString()
  @IsOptional()
  isEnabled: boolean;
}