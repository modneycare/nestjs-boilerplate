import { Module } from '@nestjs/common';
import { SourcingSiteController } from './sourcing-site.controller';
import { SourcingSiteService } from './sourcing-site.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SourcingSiteController],
  providers: [SourcingSiteService, PrismaService],
})
export class SourcingSiteModule {}
