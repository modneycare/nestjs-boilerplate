import { ApiProperty } from '@nestjs/swagger';

export class CreateTranslationApiKeyDto {
  @ApiProperty({ description: '번역 사이트 ID' })
  translationSiteId: number;

  @ApiProperty({ description: '번역 API Key' })
  apiKey: string;
}
