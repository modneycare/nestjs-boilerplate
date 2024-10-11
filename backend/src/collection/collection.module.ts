import { CollectionsService } from './collection.service';
import { CollectionController } from './collection.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [CollectionController],
  providers: [CollectionsService],
})
export class CollectionModule {}
