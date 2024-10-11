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
import { ProductCollectionService } from './product-collection.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('product-collections')
@UseGuards(JwtAuthGuard)
export class ProductCollectionController {
  constructor(
    private readonly productCollectionService: ProductCollectionService,
  ) {}

  @Post()
  create(
    @Body() createProductCollectionDto: Prisma.ProductCollectionCreateInput,
  ) {
    return this.productCollectionService.create(createProductCollectionDto);
  }

  @Get()
  findAll() {
    return this.productCollectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCollectionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductCollectionDto: Prisma.ProductCollectionUpdateInput,
  ) {
    return this.productCollectionService.update(
      +id,
      updateProductCollectionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCollectionService.remove(+id);
  }
}
