import { Controller, Get } from '@nestjs/common';
import { GithubService } from './github.service';
import { ApiOperation } from '@nestjs/swagger';

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
