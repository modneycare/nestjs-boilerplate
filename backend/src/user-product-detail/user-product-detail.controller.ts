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
import { UserProductDetailService } from './user-product-detail.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-product-details')
@UseGuards(JwtAuthGuard)
export class UserProductDetailController {
  constructor(
    private readonly userProductDetailService: UserProductDetailService,
  ) {}

  @Post()
  create(
    @Body() createUserProductDetailDto: Prisma.UserProductDetailCreateInput,
  ) {
    return this.userProductDetailService.create(createUserProductDetailDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    const { userProductDetails, totalCount, hasNextPage, totalPageCount } =
      await this.userProductDetailService.findAll(pageNumber, pageSizeNumber);

    return {
      data: userProductDetails,
      meta: {
        currentPage: pageNumber,
        pageSize: pageSizeNumber,
        totalCount,
        hasNextPage,
        totalPageCount,
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userProductDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserProductDetailDto: Prisma.UserProductDetailUpdateInput,
  ) {
    return this.userProductDetailService.update(
      +id,
      updateUserProductDetailDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userProductDetailService.remove(+id);
  }
}
