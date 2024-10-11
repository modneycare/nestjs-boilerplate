import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserProductDetail, Prisma } from '@prisma/client';

@Injectable()
export class UserProductDetailService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.UserProductDetailCreateInput,
  ): Promise<UserProductDetail> {
    return this.prisma.userProductDetail.create({
      data,
      include: this.getFullInclude(),
    });
  }

  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [userProductDetails, totalCount] = await Promise.all([
      this.prisma.userProductDetail.findMany({
        skip,
        take: pageSize,
        include: this.getFullInclude(),
      }),
      this.prisma.userProductDetail.count(),
    ]);

    const totalPageCount = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPageCount;

    return {
      userProductDetails,
      totalCount,
      hasNextPage,
      totalPageCount,
    };
  }

  async findOne(id: number): Promise<UserProductDetail | null> {
    return this.prisma.userProductDetail.findUnique({
      where: { id },
      include: this.getFullInclude(),
    });
  }

  async update(
    id: number,
    data: Prisma.UserProductDetailUpdateInput,
  ): Promise<UserProductDetail> {
    return this.prisma.userProductDetail.update({
      where: { id },
      data,
      include: this.getFullInclude(),
    });
  }

  async remove(id: number): Promise<UserProductDetail> {
    return this.prisma.userProductDetail.delete({
      where: { id },
      include: this.getFullInclude(),
    });
  }

  private getFullInclude() {
    return {
      product: {
        include: {
          collections: true,
          details: {
            include: {
              options: true,
              detailImages: true,
            },
          },
          failureLogs: true,
        },
      },
      user: true,
      customImages: true,
      marketUploads: true,
      categoryMapping: true,
      shippingTemplate: true,
      imageTemplate: true,
      notes: true,
    };
  }
}
