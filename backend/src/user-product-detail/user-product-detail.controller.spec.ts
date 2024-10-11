import { Test, TestingModule } from '@nestjs/testing';
import { UserProductDetailController } from './user-product-detail.controller';

describe('UserProductDetailController', () => {
  let controller: UserProductDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProductDetailController],
    }).compile();

    controller = module.get<UserProductDetailController>(UserProductDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
