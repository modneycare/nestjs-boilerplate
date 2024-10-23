import { Test, TestingModule } from '@nestjs/testing';
import { TranslationApiKeyService } from './translation-api-key.service';

describe('TranslationApiKeyService', () => {
  let service: TranslationApiKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslationApiKeyService],
    }).compile();

    service = module.get<TranslationApiKeyService>(TranslationApiKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
