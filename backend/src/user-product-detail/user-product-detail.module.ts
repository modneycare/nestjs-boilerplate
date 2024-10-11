import { Module } from '@nestjs/common';
import { UserProductDetailController } from './user-product-detail.controller';
import { UserProductDetailService } from './user-product-detail.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserProductDetailController],
  providers: [UserProductDetailService, PrismaService],
})
export class UserProductDetailModule {}
