import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CollectionsService } from './collection.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestCollectionListDto } from './dto/get-collection-list.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('collections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CollectionController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Body() createCollectionDto: Prisma.CollectionCreateInput) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Post('list')
  getList(
    @Request() req,
    @Body() requestCollectionListDto: RequestCollectionListDto,
  ) {
    console.log('[GET]collection-list : ', req.user?.id);

    return this.collectionsService.getRequestList(
      req.user?.id,
      requestCollectionListDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: Prisma.CollectionUpdateInput,
  ) {
    return this.collectionsService.update(+id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.collectionsService.remove(+id, req.user?.id);
  }
}
