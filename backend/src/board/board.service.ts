import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class BoardService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.board.findMany();
    }

    async create(data: Prisma.BoardCreateInput) {
        return this.prisma.board.create({ data });
    }

    async update(params: { where: Prisma.BoardWhereUniqueInput; data: Prisma.BoardUpdateInput }) {
        const { where, data } = params;
        return this.prisma.board.update({
          data,
          where,
        });
      }

    async delete(where: Prisma.BoardWhereUniqueInput) {
        return this.prisma.board.delete({ where });
    }

    async findOne(id :  string) {
        return this.prisma.board.findUnique({ 
            where : {
                id : parseInt(id)
            }, 
            include : { 
                posts : { 
                    orderBy : { 
                        createdAt : 'desc'
                    }
                }
            }
        });
    }

    async findMany(params: { skip?: number; take?: number; cursor?: Prisma.BoardWhereUniqueInput; where?: Prisma.BoardWhereInput; orderBy?: Prisma.BoardOrderByWithRelationInput }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.board.findMany({ skip, take, cursor, where, orderBy });
    }
    

}
