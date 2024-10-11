import { Module } from '@nestjs/common';
import { ProductOptionController } from './product-option.controller';
import { ProductOptionService } from './product-option.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProductOptionController],
  providers: [ProductOptionService, PrismaService],
})
export class ProductOptionModule {}
