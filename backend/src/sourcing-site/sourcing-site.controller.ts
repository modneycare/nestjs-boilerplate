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
import { SourcingSiteService } from './sourcing-site.service';
import { Prisma, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('sourcing-sites')
@ApiTags('sourcing-site')
@ApiBearerAuth()
export class SourcingSiteController {
  constructor(private readonly sourcingSiteService: SourcingSiteService) {}

  @Post()
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createSourcingSiteDto: Prisma.SourcingSiteCreateInput) {
    return this.sourcingSiteService.create(createSourcingSiteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Request() req,
  ) {
    console.log('sourcing-site : user : ', req.user);
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);
    return this.sourcingSiteService.findAll(pageNumber, pageSizeNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sourcingSiteService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateSourcingSiteDto: Prisma.SourcingSiteUpdateInput,
  ) {
    return this.sourcingSiteService.update(+id, updateSourcingSiteDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id') id: string) {
    return this.sourcingSiteService.remove(+id);
  }
}
