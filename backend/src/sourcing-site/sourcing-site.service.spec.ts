import { Test, TestingModule } from '@nestjs/testing';
import { SourcingSiteService } from './sourcing-site.service';

describe('SourcingSiteService', () => {
  let service: SourcingSiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SourcingSiteService],
    }).compile();

    service = module.get<SourcingSiteService>(SourcingSiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
