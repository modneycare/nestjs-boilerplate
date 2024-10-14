import { Module } from '@nestjs/common';
import { SourcingService } from './sourcing.service';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SourcingController } from './sourcing.controller';

@Module({
  imports: [
    PrismaModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [SourcingService, PrismaService],
  controllers: [SourcingController],
})
export class SourcingModule {}
