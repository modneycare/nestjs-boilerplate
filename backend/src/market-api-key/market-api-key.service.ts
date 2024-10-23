import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketAPIKey, Prisma, User } from '@prisma/client';

@Injectable()
export class MarketApiKeyService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MarketAPIKeyCreateInput): Promise<MarketAPIKey> {
    return await this.prisma.marketAPIKey.create({
      data: {
        ...data,
      },
      include: this.getFullInclude(),
    });
  }

  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [marketApiKeys, totalCount] = await Promise.all([
      this.prisma.marketAPIKey.findMany({
        skip,
        take: pageSize,
        include: this.getFullInclude(),
      }),
      this.prisma.marketAPIKey.count(),
    ]);

    const totalPageCount = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPageCount;

    return {
      data: marketApiKeys,
      meta: {
        currentPage: page,
        pageSize,
        totalCount,
        hasNextPage,
        totalPageCount,
      },
    };
  }

  async findOne(id: number): Promise<MarketAPIKey | null> {
    return await this.prisma.marketAPIKey.findUnique({
      where: { id },
      include: this.getFullInclude(),
    });
  }

  async update(
    id: number,
    data: Prisma.MarketAPIKeyUpdateInput,
  ): Promise<MarketAPIKey> {
    return await this.prisma.marketAPIKey.update({
      where: { id },
      data,
      include: this.getFullInclude(),
    });
  }

  async remove(id: number): Promise<MarketAPIKey> {
    return await this.prisma.marketAPIKey.delete({
      where: { id },
      include: this.getFullInclude(),
    });
  }

  private getFullInclude() {
    return {
      store: true,
    };
  }
}
