import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTranslationApiKeyDto } from './dto/create-translation-api-key.dto';
import { UpdateTranslationApiKeyDto } from './dto/update-translation-api-key.dto';

@Injectable()
export class TranslationApiKeyService {
  constructor(private prisma: PrismaService) {}

  async create(createTranslationApiKeyDto: CreateTranslationApiKeyDto, userId: string) {
    return this.prisma.translationAPIKey.create({
      data: {
        ...createTranslationApiKeyDto,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.translationAPIKey.findMany();
  }

  async findOne(id: number) {
    return this.prisma.translationAPIKey.findUnique({
      where: { id },
    });
  }

  async findBySiteId(siteId: number, userId: string) {
    return this.prisma.translationAPIKey.findMany({
      where: { translationSiteId: siteId, userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: number, updateTranslationApiKeyDto: UpdateTranslationApiKeyDto, userId: string) {
    return this.prisma.translationAPIKey.update({
      where: { id },
      data: {
        ...updateTranslationApiKeyDto,
        userId,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.translationAPIKey.delete({
      where: { id },
    });
  }
}
