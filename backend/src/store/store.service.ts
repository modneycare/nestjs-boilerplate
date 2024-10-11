import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Store, Prisma } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.StoreCreateInput): Promise<Store> {
    return this.prisma.store.create({
      data,
      include: this.getFullInclude(),
    });
  }

  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [stores, totalCount] = await Promise.all([
      this.prisma.store.findMany({
        skip,
        take: pageSize,
        include: this.getFullInclude(),
      }),
      this.prisma.store.count(),
    ]);

    const totalPageCount = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPageCount;

    return {
      data: stores,
      meta: {
        currentPage: page,
        pageSize,
        totalCount,
        hasNextPage,
        totalPageCount,
      },
    };
  }

  async findOne(id: number): Promise<Store | null> {
    return this.prisma.store.findUnique({
      where: { id },
      include: this.getFullInclude(),
    });
  }

  async update(id: number, data: Prisma.StoreUpdateInput): Promise<Store> {
    return this.prisma.store.update({
      where: { id },
      data,
      include: this.getFullInclude(),
    });
  }

  async remove(id: number): Promise<Store> {
    return this.prisma.store.delete({
      where: { id },
      include: this.getFullInclude(),
    });
  }

  private getFullInclude() {
    return {
      user: true,
      market: true,
      apiKey: true,
      MarketUpload: true,
    };
  }
}
