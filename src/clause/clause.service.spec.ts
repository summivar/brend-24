import { Test, TestingModule } from '@nestjs/testing';
import { ClauseService } from './clause.service';

describe('ClauseService', () => {
  let service: ClauseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClauseService],
    }).compile();

    service = module.get<ClauseService>(ClauseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
