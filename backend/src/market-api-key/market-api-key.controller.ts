import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MarketApiKeyService } from './market-api-key.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('market-api-keys')
@UseGuards(JwtAuthGuard)
export class MarketApiKeyController {
  constructor(private readonly marketApiKeyService: MarketApiKeyService) {}

  @Post()
  create(@Body() createMarketApiKeyDto: Prisma.MarketAPIKeyCreateInput) {
    return this.marketApiKeyService.create(createMarketApiKeyDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);
    return this.marketApiKeyService.findAll(pageNumber, pageSizeNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketApiKeyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMarketApiKeyDto: Prisma.MarketAPIKeyUpdateInput,
  ) {
    return this.marketApiKeyService.update(+id, updateMarketApiKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketApiKeyService.remove(+id);
  }
}
