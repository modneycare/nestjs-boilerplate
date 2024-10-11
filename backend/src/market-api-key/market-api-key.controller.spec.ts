import { Test, TestingModule } from '@nestjs/testing';
import { MarketApiKeyController } from './market-api-key.controller';

describe('MarketApiKeyController', () => {
  let controller: MarketApiKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketApiKeyController],
    }).compile();

    controller = module.get<MarketApiKeyController>(MarketApiKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
