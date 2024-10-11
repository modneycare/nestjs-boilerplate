import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { PrismaService } from '../prisma/prisma.service';
import { StoreService } from './store.service';

@Module({
  controllers: [StoreController],
  providers: [StoreService, PrismaService],
})
export class StoreModule {}
