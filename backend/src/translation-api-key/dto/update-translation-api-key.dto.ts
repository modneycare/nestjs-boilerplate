import { CreateTranslationApiKeyDto } from "./create-translation-api-key.dto";
import { PartialType } from '@nestjs/swagger';

export class UpdateTranslationApiKeyDto extends PartialType(CreateTranslationApiKeyDto) {
 
}
