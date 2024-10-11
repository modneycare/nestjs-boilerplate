import { Test, TestingModule } from '@nestjs/testing';
import { SourcingSiteController } from './sourcing-site.controller';

describe('SourcingSiteController', () => {
  let controller: SourcingSiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SourcingSiteController],
    }).compile();

    controller = module.get<SourcingSiteController>(SourcingSiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
