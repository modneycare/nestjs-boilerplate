import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ProductCollection,
  Prisma,
  Product,
  Collection,
  CollectionStatus,
} from '@prisma/client';

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
        product: {
          include: {
            details: true,
            UserProductDetail: true,
          },
        },
        collection: true,
      },
    });
  }

  async search(
    collection_id: number,
    search_keyword: string,
    user_id: string,
  ): Promise<ProductCollection[]> {
    const result = await this.prisma.productCollection.findMany({
      where: {
        AND: [
          {
            ...(collection_id === 0 ? {} : { collectionId: collection_id }),
            product: {
              name: {
                contains: search_keyword,
              },
            },
            collection: { userId: user_id },
          },
        ],
      },
      include: {
        product: {
          include: {
            details: true,
            UserProductDetail: true,
          },
        },
        collection: {
          select: {
            name: true,
            id: true,
            sourcingSiteId: true,
            site: true,
            siteName: true,
            collectOption: true,
          },
        },
      },
    });

    return result;
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

  async deleteItems(data: number[], req: Request) {
    return await this.prisma.productCollection.deleteMany({
      where: {
        id: { in: data },
      },
    });
  }

  async inspectItems(data: number[], req: Request) {
    const collectionProducts = await this.prisma.productCollection.findMany({
      where: {
        id: { in: data },
      },
      select: {
        productId: true,
        collectionId: true,
      },
    });
    return await this.prisma.userProductDetail.updateMany({
      where: {
        productId: { in: collectionProducts.map((item) => item.productId) },
        collectionId: {
          in: collectionProducts.map((item) => item.collectionId),
        },
      },
      data: {
        status: CollectionStatus.REVIEWING,
      },
    });
  }
}
