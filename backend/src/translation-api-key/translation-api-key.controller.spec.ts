import { Test, TestingModule } from '@nestjs/testing';
import { TranslationApiKeyController } from './translation-api-key.controller';

describe('TranslationApiKeyController', () => {
  let controller: TranslationApiKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationApiKeyController],
    }).compile();

    controller = module.get<TranslationApiKeyController>(TranslationApiKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
