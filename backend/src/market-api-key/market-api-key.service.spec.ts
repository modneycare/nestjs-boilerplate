import { Test, TestingModule } from '@nestjs/testing';
import { MarketApiKeyService } from './market-api-key.service';

describe('MarketApiKeyService', () => {
  let service: MarketApiKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketApiKeyService],
    }).compile();

    service = module.get<MarketApiKeyService>(MarketApiKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
