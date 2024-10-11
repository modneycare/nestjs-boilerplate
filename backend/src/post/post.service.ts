import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts(boardId: number, user: any) {
    const posts = await this.prisma.post.findMany({
      where: { boardId },
      include: {
        board: true,
        user: true,
        comments: true,
        postViews: true,
        postLikes: true,
      },
    });
    return posts;
  }

  async getPost(id: number, user: any) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        board: true,
        user: true,
        comments: true,
        postViews: true,
        postLikes: true,
      },
    });

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
      await this.prisma.postView.create({
        data: {
          postId: id,
          userId: user.id,
        },
      });

      await this.prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    return post;
  }

  async createPost(postData: any) {
    const post = await this.prisma.post.create({
      data: postData,
      include: {
        board: true,
        user: true,
        comments: true,
        postViews: true,
        postLikes: true,
      },
    });
    return post;
  }

  async updatePost(id: number, postData: any) {
    const post = await this.prisma.post.update({
      where: { id },
      data: postData,
      include: {
        board: true,
        user: true,
        comments: true,
        postViews: true,
        postLikes: true,
      },
    });
    return post;
  }

  async deletePost(id: number) {
    await this.prisma.post.delete({
      where: { id },
    });
  }
}
