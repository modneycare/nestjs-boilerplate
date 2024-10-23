import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
