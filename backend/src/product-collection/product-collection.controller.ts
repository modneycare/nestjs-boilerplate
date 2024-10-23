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
  Request,
} from '@nestjs/common';
import { ProductCollectionService } from './product-collection.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('product-collections')
@UseGuards(JwtAuthGuard)
@ApiTags('product-collections')
@ApiBearerAuth()
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

  @Get('search')
  search(
    @Query('collection_id') collection_id: string,
    @Query('search_keyword') search_keyword: string,
    @Request() req,
  ) {
    return this.productCollectionService.search(
      +collection_id,
      search_keyword,
      req.user?.id,
    );
  }

  @Post('inspect')
  inspectItems(@Body() data, @Request() req) {
    return this.productCollectionService.inspectItems(data, req);
  }

  @Post('inspect-delete')
  deleteItems(@Body() data, @Request() req) {
    return this.productCollectionService.deleteItems(data, req);
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
