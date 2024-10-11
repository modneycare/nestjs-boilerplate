import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductOption, Prisma } from '@prisma/client';

@Injectable()
export class ProductOptionService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductOptionCreateInput): Promise<ProductOption> {
    return this.prisma.productOption.create({
      data,
      include: {
        productDetail: true,
      },
    });
  }

  async findAll(): Promise<ProductOption[]> {
    return this.prisma.productOption.findMany({
      include: {
        productDetail: true,
      },
    });
  }

  async findOne(id: number): Promise<ProductOption | null> {
    return this.prisma.productOption.findUnique({
      where: { id },
      include: {
        productDetail: true,
      },
    });
  }

  async update(
    id: number,
    data: Prisma.ProductOptionUpdateInput,
  ): Promise<ProductOption> {
    return this.prisma.productOption.update({
      where: { id },
      data,
      include: {
        productDetail: true,
      },
    });
  }

  async remove(id: number): Promise<ProductOption> {
    return this.prisma.productOption.delete({
      where: { id },
      include: {
        productDetail: true,
      },
    });
  }
}
