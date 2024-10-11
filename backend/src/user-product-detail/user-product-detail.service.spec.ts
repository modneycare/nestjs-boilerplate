import { Test, TestingModule } from '@nestjs/testing';
import { UserProductDetailService } from './user-product-detail.service';

describe('UserProductDetailService', () => {
  let service: UserProductDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProductDetailService],
    }).compile();

    service = module.get<UserProductDetailService>(UserProductDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
