import { PrismaClient } from '@prisma/client';

export const InitUsers = async (prismaClient: PrismaClient) => {
  // Create Admin account
  await prismaClient.user.upsert({
    where: { email: 'admin@gmail.com' },
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
    where: { email: 'user@gmail.com' },
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
    where: { email: 'MANAGER@gmail.com' },
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

  await prismaClient.user.upsert({
    where: { email: 'test' },
    update: {},
    create: {
      name: 'test',
      email: 'test',
      phone: '12341',
      password: '$2b$10$bdS87oU/IB8un3x.hkJ4COISd2ixNNcb2bddl2rIjMNS2xJvpkHDu', // 123456789
      role: 'MANAGER',
      isApproved: true,
    },
  });

  await prismaClient.user.upsert({
    where: { email: 'crosell' },
    update: {},
    create: {
      name: 'crosell',
      email: 'crosell',
      phone: '12341',
      password: '$2b$10$bdS87oU/IB8un3x.hkJ4COISd2ixNNcb2bddl2rIjMNS2xJvpkHDu', // 123456789
      role: 'MANAGER',
      isApproved: true,
    },
  });

  await prismaClient.user.upsert({
    where: { email: 'sellian' },
    update: {},
    create: {
      name: 'sellian',
      email: 'sellian',
      phone: '12341',
      password: '$2b$10$bdS87oU/IB8un3x.hkJ4COISd2ixNNcb2bddl2rIjMNS2xJvpkHDu', // 123456789
      role: 'MANAGER',
      isApproved: true,
    },
  });


};
