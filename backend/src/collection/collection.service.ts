import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Collection, Prisma } from '@prisma/client';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CollectionCreateInput): Promise<Collection> {
    return this.prisma.collection.create({ data });
  }

  async findAll(): Promise<Collection[]> {
    return this.prisma.collection.findMany();
  }

  async findOne(id: number): Promise<Collection | null> {
    return this.prisma.collection.findUnique({ where: { id } });
  }

  async update(
    id: number,
    data: Prisma.CollectionUpdateInput,
  ): Promise<Collection> {
    return this.prisma.collection.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Collection> {
    return this.prisma.collection.delete({ where: { id } });
  }
}
