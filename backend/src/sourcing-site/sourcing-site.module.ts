import { Module } from '@nestjs/common';
import { SourcingSiteController } from './sourcing-site.controller';
import { SourcingSiteService } from './sourcing-site.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SourcingSiteController],
  providers: [SourcingSiteService, PrismaService, JwtService],
})
export class SourcingSiteModule {}
