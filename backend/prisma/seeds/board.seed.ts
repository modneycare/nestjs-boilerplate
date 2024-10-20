/**게시판 생성 seed */

import { PrismaClient } from '@prisma/client';

export const InitBoard = async (prismaClient: PrismaClient) => {
  await prismaClient.board.createMany({ 
    data: [
      {
        name: '공지사항',
        permission: 'ADMIN_ONLY',
      },
      {
        name: 'TIP',
        permission: 'ADMIN_ONLY',
      },
    ],
  });
};
