import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditVoteDto {
  @ApiProperty({ example: 'link', description: 'Ссылка голосования', required: false })
  @IsString()
  @IsOptional()
  link: string;

  @ApiProperty({ example: 5, description: 'ID голосования', required: false })
  @IsInt()
  @IsOptional()
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