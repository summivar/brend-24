import { Test, TestingModule } from '@nestjs/testing';
import { ClauseController } from './clause.controller';

describe('ClauseController', () => {
  let controller: ClauseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClauseController],
    }).compile();

    controller = module.get<ClauseController>(ClauseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
