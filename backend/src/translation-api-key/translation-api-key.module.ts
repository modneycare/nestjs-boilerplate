import { Module } from '@nestjs/common';
import { TranslationApiKeyController } from './translation-api-key.controller';
import { TranslationApiKeyService } from './translation-api-key.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { TranslationModule } from '@/translation/translation.module';

@Module({
  imports: [PrismaModule , TranslationModule],
  controllers: [TranslationApiKeyController],
  providers: [TranslationApiKeyService]
})
export class TranslationApiKeyModule {}
