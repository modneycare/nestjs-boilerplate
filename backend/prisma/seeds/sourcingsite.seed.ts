import { PrismaClient } from '@prisma/client';

export const InitSourcingSite = async (prismaClient: PrismaClient) => {
  await prismaClient.sourcingSite.createMany({
    // 1 : sellian
    // 2 : crosell
    data: [
      {
        name: '아마존',
        defaultUrl: 'https://amazon.com/',
        activeWebSite: [1, 2],
      },
      {
        name: '알리',
        defaultUrl: 'https://www.aliexpress.com/',
        activeWebSite: [1, 2],
      },
      {
        name: '라쿠텐',
        defaultUrl: 'https://www.rakuten.co.jp/',
        activeWebSite: [1, 2],
      },
      {
        name: '타오바오',
        defaultUrl: 'https://world.taobao.com/',
        activeWebSite: [1, 2],
      },
      {
        name: '테무',
        defaultUrl: 'https://www.temu.com/',
        activeWebSite: [1, 2],
      },
      {
        name: '잘란도',
        defaultUrl: 'https://en.zalando.de/',
        activeWebSite: [1],
      },
      {
        name: '올리브영',
        defaultUrl: 'https://www.oliveyoung.co.kr/',
        activeWebSite: [1],
      },
      {
        name: '이베이',
        defaultUrl: 'https://www.ebay.com/',
        activeWebSite: [1, 2],
      },
    ],
  });
};
