import { Module } from '@nestjs/common';
import { SourcingService } from './sourcing.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SourcingController } from './sourcing.controller';
import { SsqsModule } from '@/aws/simple-sqs/ssqs.module';
import { SsqsService } from '@/aws/simple-sqs/ssqs.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    SsqsModule,
    PrismaModule
  ],

  providers: [SourcingService, PrismaService],
  controllers: [SourcingController],

})
export class SourcingModule {}
