import { PrismaClient } from '@prisma/client';

export const InitUsers = async (prismaClient: PrismaClient) => {
  // Create Admin account
  await prismaClient.user.upsert({
    where: { id: '5839a4f0-87a9-4a22-a669-2a68c736f746' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gmail.com',
      phone: '12345',
      password: '$2b$10$bdS87oU/IB8un3x.hkJ4COISd2ixNNcb2bddl2rIjMNS2xJvpkHDu', // 123456789
      role: 'ADMIN',
      isApproved: true,
    },
  });

  // Create Provider account
  await prismaClient.user.upsert({
    where: { id: '81de6ea8-c73c-42f1-9863-acfb18322ce4' },
    update: {},
    create: {
      name: 'User',
      email: 'user@gmail.com',
      phone: '1234',
      password: '$2b$10$bdS87oU/IB8un3x.hkJ4COISd2ixNNcb2bddl2rIjMNS2xJvpkHDu', // 123456789
      role: 'USER',
      isApproved: true,
    },
  });

  // Create other Verified account
  await prismaClient.user.upsert({
    where: { id: '81de6ea8-c73c-42f1-9863-acfb18322ce7' },
    update: {},
    create: {
      name: 'Manager',
      email: 'MANAGER@gmail.com',
      phone: '12341',
      password: '$2b$10$bdS87oU/IB8un3x.hkJ4COISd2ixNNcb2bddl2rIjMNS2xJvpkHDu', // 123456789
      role: 'MANAGER',
      isApproved: true,
    },
  });
};
