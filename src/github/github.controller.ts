import { Controller, Get } from '@nestjs/common';
import { GithubService } from './github.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Github')
@Controller('github')
export class GithubController {
  constructor(private githubService: GithubService) {
  }

  @ApiOperation({ summary: 'Pull' })
  @Get('getPull')
  async getPull() {
    return this.githubService.getPull();
  }
}
