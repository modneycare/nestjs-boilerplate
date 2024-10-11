import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Market, Prisma } from '@prisma/client';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MarketCreateInput): Promise<Market> {
    return this.prisma.market.create({
      data,
      include: this.getFullInclude(),
    });
  }

  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [markets, totalCount] = await Promise.all([
      this.prisma.market.findMany({
        skip,
        take: pageSize,
        include: this.getFullInclude(),
      }),
      this.prisma.market.count(),
    ]);

    const totalPageCount = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPageCount;

    return {
      data: markets,
      meta: {
        currentPage: page,
        pageSize,
        totalCount,
        hasNextPage,
        totalPageCount,
      },
    };
  }

  async findOne(id: number): Promise<Market | null> {
    return this.prisma.market.findUnique({
      where: { id },
      include: this.getFullInclude(),
    });
  }

  async update(id: number, data: Prisma.MarketUpdateInput): Promise<Market> {
    return this.prisma.market.update({
      where: { id },
      data,
      include: this.getFullInclude(),
    });
  }

  async remove(id: number): Promise<Market> {
    return this.prisma.market.delete({
      where: { id },
      include: this.getFullInclude(),
    });
  }

  private getFullInclude() {
    return {
      settings: true,
      stores: true,
      categories: true,
    };
  }
}
