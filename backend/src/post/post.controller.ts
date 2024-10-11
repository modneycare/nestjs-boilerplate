import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query('boardId') boardId: string, @Request() req) {
    const posts = await this.postsService.getPosts(parseInt(boardId), req.user);
    return posts;
  }

  @Get(':id')
  async getPost(@Param('id') id: string, @Request() req) {
    const post = await this.postsService.getPost(parseInt(id), req.user);
    return post;
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async createPost(@Body() postData: any) {
    const post = await this.postsService.createPost(postData);
    return post;
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async updatePost(@Param('id') id: string, @Body() postData: any) {
    const post = await this.postsService.updatePost(parseInt(id), postData);
    return post;
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async deletePost(@Param('id') id: string) {
    await this.postsService.deletePost(parseInt(id));
    return { message: '게시물이 삭제되었습니다.' };
  }
}
