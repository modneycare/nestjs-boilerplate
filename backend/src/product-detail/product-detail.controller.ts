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
import { ProductDetailService } from './product-detail.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('product-details')
@UseGuards(JwtAuthGuard)
export class ProductDetailController {
  constructor(private readonly productDetailService: ProductDetailService) {}

  @Post()
  create(@Body() createProductDetailDto: Prisma.ProductDetailCreateInput) {
    return this.productDetailService.create(createProductDetailDto);
  }

  @Get()
  findAll() {
    return this.productDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDetailDto: Prisma.ProductDetailUpdateInput,
  ) {
    return this.productDetailService.update(+id, updateProductDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDetailService.remove(+id);
  }
}
