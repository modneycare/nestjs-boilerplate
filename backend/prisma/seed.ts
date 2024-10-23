import { PrismaClient } from '@prisma/client';
import { InitUserRoles } from './seeds/user-role.seed';
import { InitUsers } from './seeds/user.seed';
import { InitSourcingSite, InitUserSourcingSiteCrosell, InitUserSourcingSiteSellian } from './seeds/sourcingsite.seed';
import { InitBoard } from './seeds/board.seed';
import { InitTranslationSite } from './seeds/translationSite.seed';
// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create one dummy article
  // await InitArticles(prisma);
  // // INIT ROLES
  // await InitUserRoles(prisma);
  //INIT Users
  // await InitUsers(prisma);
  // await InitSourcingSite(prisma);
  // await InitBoard(prisma);
  // await InitTranslationSite(prisma);
  await InitUserSourcingSiteCrosell(prisma);
  await InitUserSourcingSiteSellian(prisma);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
