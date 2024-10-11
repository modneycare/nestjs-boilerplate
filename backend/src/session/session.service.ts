import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async validateSession(userId: string, sessionId: string): Promise<boolean> {
    const session = await this.prisma.session.findFirst({
      where: {
        userId,
        id: parseInt(sessionId),
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    return !!session;
  }

  async getSessionCount(userId: string): Promise<number> {
    return this.prisma.session.count({
      where: {
        userId,
      },
    });
  }

  async removeOldestSession(userId: string): Promise<void> {
    const oldestSession = await this.prisma.session.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (oldestSession) {
      await this.prisma.session.delete({
        where: {
          id: oldestSession.id,
        },
      });
    }
  }

  async createSession(userId: string): Promise<number> {
    const session = await this.prisma.session.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시간 후 만료
        token: '',
      },
    });
    return session.id;
  }

  async removeSession(sessionId: number): Promise<void> {
    await this.prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  }
}
