import { Module } from '@nestjs/common';
import { MarketApiKeyController } from './market-api-key.controller';
import { MarketApiKeyService } from './market-api-key.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MarketApiKeyController],
  providers: [MarketApiKeyService, PrismaService],
})
export class MarketApiKeyModule {}
