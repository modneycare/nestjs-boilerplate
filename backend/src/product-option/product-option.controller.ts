import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductOptionService } from './product-option.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('product-options')
@UseGuards(JwtAuthGuard)
export class ProductOptionController {
  constructor(private readonly productOptionService: ProductOptionService) {}

  @Post()
  create(@Body() createProductOptionDto: Prisma.ProductOptionCreateInput) {
    return this.productOptionService.create(createProductOptionDto);
  }

  @Get()
  findAll() {
    return this.productOptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productOptionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductOptionDto: Prisma.ProductOptionUpdateInput,
  ) {
    return this.productOptionService.update(+id, updateProductOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productOptionService.remove(+id);
  }
}
