import { Module } from '@nestjs/common';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  controllers: [ProductDetailController],
  providers: [ProductDetailService, PrismaService, JwtService],
})
export class ProductDetailModule {}
