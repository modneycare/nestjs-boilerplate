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
import { MarketService } from './market.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('markets')
@UseGuards(JwtAuthGuard)
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  create(@Body() createMarketDto: Prisma.MarketCreateInput) {
    return this.marketService.create(createMarketDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);
    return this.marketService.findAll(pageNumber, pageSizeNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMarketDto: Prisma.MarketUpdateInput,
  ) {
    return this.marketService.update(+id, updateMarketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketService.remove(+id);
  }
}
