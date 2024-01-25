import { IsBooleanString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditVoteDto {
  @ApiProperty({ example: 'link', description: 'Ссылка голосования', required: false })
  @IsString()
  @IsOptional()
  link: string;

  @ApiProperty({ example: 'id', description: 'ID голосования', required: false })
  @IsNumber()
  @IsOptional()
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