import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fastifyHelmet from '@fastify/helmet';
import * as fastifyCompress from '@fastify/compress';
const fs = require('fs');
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import fastifyAxios from 'fastify-axios';
import naverCommerceApi from 'lib/naver';

function onError(error, tag = 'ErrorHandler') {
  // 로그 출력
  console.error(`[${tag}] ${error.stack}`);
  process.exit(1);
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      // ignoreTrailingSlash: true,
      // trustProxy: true,
    }),
    {
      bufferLogs: true,
    },
  );
  

  await app.register(fastifyHelmet);
  await app.register(fastifyCompress);
  await app.register(fastifyCookie);
  await app.register(fastifySession, {
    secret: process.env.JWT_SECRET,
    cookie: {
      secure: false, // HTTPS를 사용하는 경우 true로 설정
    },
  });
  app.enableCors({
    origin: [
      // `${process.env.FRONTEND_URL}`, // Allow requests from your frontend URL
      // 'http://localhost:3000', // Allow requests from localhost:3000
      '*', // Allow requests from all domains
      // 'https://*.crosell.kr',
      // 'https://*.crosell.co.kr'
    ],
    methods: ['*'],
    credentials: true,
  });

  // await app.register(fastifyAxios);
  // (await app.register(naverCommerceApi)).after((err) => {
  //   if (err) {
  //     return onError(err, 'PluginError');
  //   }
  // });

  

  const config = new DocumentBuilder()
    .setTitle('LOG')
    .setDescription('crawler server apis')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await fs.writeFileSync('./swagger.json', JSON.stringify(document));
  await app.listen(6001);
}
bootstrap();
