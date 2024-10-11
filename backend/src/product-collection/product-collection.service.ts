import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductCollection, Prisma } from '@prisma/client';

@Injectable()
export class ProductCollectionService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.ProductCollectionCreateInput,
  ): Promise<ProductCollection> {
    return this.prisma.productCollection.create({
      data,
      include: {
        product: true,
        collection: true,
      },
    });
  }

  async findAll(): Promise<ProductCollection[]> {
    return this.prisma.productCollection.findMany({
      include: {
        product: true,
        collection: true,
      },
    });
  }

  async findOne(id: number): Promise<ProductCollection | null> {
    return this.prisma.productCollection.findUnique({
      where: { id },
      include: {
        product: true,
        collection: true,
      },
    });
  }

  async update(
    id: number,
    data: Prisma.ProductCollectionUpdateInput,
  ): Promise<ProductCollection> {
    return this.prisma.productCollection.update({
      where: { id },
      data,
      include: {
        product: true,
        collection: true,
      },
    });
  }

  async remove(id: number): Promise<ProductCollection> {
    return this.prisma.productCollection.delete({
      where: { id },
      include: {
        product: true,
        collection: true,
      },
    });
  }
}
