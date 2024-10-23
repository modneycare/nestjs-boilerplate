import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
      include: {
        collections: true,
        details: true,
        failureLogs: true,
        UserProductDetail: true,
      },
    });
  }

  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: pageSize,
        include: {
          collections: true,
          details: {
            include: {
              options: true,
              detailImages: true,
            },
          },
          failureLogs: true,
          UserProductDetail: {
            include: {
              customImages: true,
              marketUploads: true,
              shippingTemplate: true,
              imageTemplate: true,
              notes: true,
              categoryTemplate: true,
            },
          },
        },
      }),
      this.prisma.product.count(),
    ]);

    const totalPageCount = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPageCount;

    return {
      products,
      totalCount,
      hasNextPage,
      totalPageCount,
    };
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        collections: true,
        details: {
          include: {
            options: true,
            detailImages: true,
          },
        },
        failureLogs: true,
        UserProductDetail: {
          include: {
            customImages: true,
            marketUploads: true,
            shippingTemplate: true,
            imageTemplate: true,
            notes: true,
            categoryTemplate: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        collections: true,
        details: {
          include: {
            options: true,
            detailImages: true,
          },
        },
        failureLogs: true,
        UserProductDetail: {
          include: {
            customImages: true,
            marketUploads: true,
            shippingTemplate: true,
            imageTemplate: true,
            notes: true,
            categoryTemplate: true,
          },
        },
      },
    });
  }

  async remove(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
      include: {
        collections: true,
        details: {
          include: {
            options: true,
            detailImages: true,
          },
        },
        failureLogs: true,
        UserProductDetail: {
          include: {
            customImages: true,
            marketUploads: true,
            shippingTemplate: true,
            imageTemplate: true,
            notes: true,
            categoryTemplate: true,
          },
        },
      },
    });
  }
}
