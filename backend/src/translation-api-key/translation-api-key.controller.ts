import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { TranslationApiKeyService } from './translation-api-key.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CreateTranslationApiKeyDto, UpdateTranslationApiKeyDto } from './dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TranslationService } from '@/translation/translation.service';
import { ResponseDto } from '@/utils/response.dto';

@Controller('translation-api-key')
@UseGuards(JwtAuthGuard)
@ApiTags('Translation API Key')
export class TranslationApiKeyController {
  constructor(
    private readonly translationApiKeyService: TranslationApiKeyService,
    private readonly translationService: TranslationService,
) {}

  @Post()
  create(@Body() createTranslationApiKeyDto: CreateTranslationApiKeyDto, @Request() req) {

    return this.translationApiKeyService.create(createTranslationApiKeyDto, req.user!.id!);
  }

  @Post('/check')
  @ApiOkResponse({
    description: 'users response',
    type: ResponseDto,
  })
  check(@Body() checkTranslationApiKeyDto: CreateTranslationApiKeyDto, @Request() req) {
    return this.translationService.check(checkTranslationApiKeyDto.translationSiteId, checkTranslationApiKeyDto.apiKey);
  }

  @Get()
  findAll() {
    return this.translationApiKeyService.findAll();
  }


  @Get('/:id')
  findBySiteId(@Param('id') id: string, @Request() req) {
    return this.translationApiKeyService.findBySiteId(+id, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTranslationApiKeyDto: UpdateTranslationApiKeyDto, @Request() req) {
    return this.translationApiKeyService.update(+id, updateTranslationApiKeyDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.translationApiKeyService.remove(+id);
  }
}
