import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
