import { Module } from '@nestjs/common';
import { ProductCollectionController } from './product-collection.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProductCollectionService } from './product-collection.service';

@Module({
  controllers: [ProductCollectionController],
  providers: [ProductCollectionService, PrismaService],
})
export class ProductCollectionModule {}
