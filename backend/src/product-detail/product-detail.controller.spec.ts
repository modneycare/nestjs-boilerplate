import { Test, TestingModule } from '@nestjs/testing';
import { ProductDetailController } from './product-detail.controller';

describe('ProductDetailController', () => {
  let controller: ProductDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductDetailController],
    }).compile();

    controller = module.get<ProductDetailController>(ProductDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
