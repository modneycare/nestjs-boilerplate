import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Collection, Prisma } from '@prisma/client';
import { RequestCollectionListDto } from './dto/get-collection-list.dto';
import { convertToKoreanISOString } from '@/utils/datetime.util';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CollectionCreateInput): Promise<Collection> {
    const result = await this.prisma.collection.create({ data });
    // TODO : request get item list
    return result;
  }

  async findAll(): Promise<Collection[]> {
    return await this.prisma.collection.findMany();
  }

  async findOne(id: number): Promise<Collection | null> {
    return await this.prisma.collection.findUnique({ where: { id } });
  }

  async update(
    id: number,
    data: Prisma.CollectionUpdateInput,
  ): Promise<Collection> {
    return await this.prisma.collection.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: string): Promise<Collection> {
    return await this.prisma.collection.delete({ where: { id, userId } });
  }

  async getRequestList(
    userId: string,
    requestCollectionListDto: RequestCollectionListDto,
  ): Promise<any> {
    console.log(
      'start_date : ',
      convertToKoreanISOString(requestCollectionListDto.start_date),
    );
    const data = await this.prisma.collection.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: requestCollectionListDto.start_date,
          lte: requestCollectionListDto.end_date,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log('data : ', data);
    return data;
  }
}
