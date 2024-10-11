import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDetail, Prisma } from '@prisma/client';

@Injectable()
export class ProductDetailService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductDetailCreateInput): Promise<ProductDetail> {
    return this.prisma.productDetail.create({
      data,
      include: {
        product: true,
        options: true,
        detailImages: true,
      },
    });
  }

  async findAll(): Promise<ProductDetail[]> {
    return this.prisma.productDetail.findMany({
      include: {
        product: true,
        options: true,
        detailImages: true,
      },
    });
  }

  async findOne(id: number): Promise<ProductDetail | null> {
    return this.prisma.productDetail.findUnique({
      where: { id },
      include: {
        product: true,
        options: true,
        detailImages: true,
      },
    });
  }

  async update(
    id: number,
    data: Prisma.ProductDetailUpdateInput,
  ): Promise<ProductDetail> {
    return this.prisma.productDetail.update({
      where: { id },
      data,
      include: {
        product: true,
        options: true,
        detailImages: true,
      },
    });
  }

  async remove(id: number): Promise<ProductDetail> {
    return this.prisma.productDetail.delete({
      where: { id },
      include: {
        product: true,
        options: true,
        detailImages: true,
      },
    });
  }
}
