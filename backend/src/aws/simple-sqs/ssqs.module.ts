// src/sqs/sqs.module.ts
import { Module } from '@nestjs/common';
import { SsqsService } from './ssqs.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SsqsService],
  exports: [SsqsService],
})
export class SsqsModule {}
