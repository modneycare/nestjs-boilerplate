import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SourcingSite, Prisma, User } from '@prisma/client';

@Injectable()
export class SourcingSiteService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SourcingSiteCreateInput): Promise<SourcingSite> {
    return this.prisma.sourcingSite.create({
      data,
      //   include: this.getFullInclude(),
    });
  }

  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [sourcingSites, totalCount] = await Promise.all([
      this.prisma.sourcingSite.findMany({
        skip,
        take: pageSize,
        // include: this.getFullInclude(),
      }),
      this.prisma.sourcingSite.count(),
    ]);

    const totalPageCount = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPageCount;

    return {
      data: sourcingSites,
      meta: {
        currentPage: page,
        pageSize,
        totalCount,
        hasNextPage,
        totalPageCount,
      },
    };
  }

  async findOne(id: number): Promise<SourcingSite | null> {
    return this.prisma.sourcingSite.findUnique({
      where: { id },
      //   include: this.getFullInclude(),
    });
  }

  async update(
    id: number,
    data: Prisma.SourcingSiteUpdateInput,
  ): Promise<SourcingSite> {
    return this.prisma.sourcingSite.update({
      where: { id },
      data,
      //   include: this.getFullInclude(),
    });
  }

  async remove(id: number): Promise<SourcingSite> {
    return this.prisma.sourcingSite.delete({
      where: { id },
      //   include: this.getFullInclude(),
    });
  }

  private getFullInclude() {
    return {
      products: true,
    };
  }

  async findAllSellian(user: User) {
    const data = await this.prisma.sourcingSite.findMany({
      where: { activeWebSite: { has: 1 } },
      distinct: ['id'],
    });
    return data;
  }

  async findAllCrosell(user: User) {

    const _user = await this.prisma.user.findUnique({
      where : { 
        id : user.id
      }
    });
    if ( ["ADMIN","MANAGER"].includes(_user.role)) {
      return await this.prisma.sourcingSite.findMany({
        where : { 
          activeWebSite : { 
            has : 2
          }
        }, 
        orderBy : { 
          id : 'asc'
        }
      });
    }
    const data = await this.prisma.sourcingSite.findMany({
      where: {
        activeWebSite: {
          has: 2,
        },
        
        // TOOD : 페이먼트플랜이랑 연계해서 실행
        userSourcingSites: {
          some: {
            userId: user.id,
          },
        },
      },
      orderBy : { 
        id : 'asc'
      }
    });
    return data;

    // const data =  await this.prisma.userSourcingSite.findFirst({
    //   where: {
    //     userId: user.id,
    //     AND : {
    //       sourcingSites : {
    //         some : {
    //           activeWebSite : {
    //             has : 2
    //           }
    //         }
    //       }
    //     }

    //   },
    //   include : {
    //     sourcingSites : {
    //       distinct : ['id']
    //     }
    //   },
    //   distinct : ['sourcingSiteId']
    // });
    // return data?.sourcingSites??[]
  }
}
