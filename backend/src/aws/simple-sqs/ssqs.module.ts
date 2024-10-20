// src/sqs/sqs.module.ts
import { Module } from '@nestjs/common';
import { SsqsService } from './ssqs.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SqsModule } from "@ssut/nestjs-sqs";
import { SQSClient } from "@aws-sdk/client-sqs";
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../prisma/prisma.module';
import { TranslationModule } from '@/translation/translation.module';
import { PrismaService } from '@/prisma/prisma.service';
@Module({
  imports: [
    TranslationModule,
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PrismaModule,

    SqsModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('configService : ', configService.get('aws'));
        return {
          producers: [{
            name: configService.get('aws.sqs.queueNames.listQueue'),
            queueUrl: configService.get('aws.sqs.urls.listQueue'),
            // region: configService.get('aws.region'),
            sqs: new SQSClient({
              region: configService.get('aws.region'),
              // useQueueUrlAsEndpoint : false,
              // endpoint: configService.get('aws.sqs.urls.listQueue'),
              credentials: {
                accessKeyId: configService.get<string>('aws.AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get<string>('aws.AWS_SECRET_ACCESS_KEY') ,
              }, 
            })
          },
          {
          
            name: configService.get('aws.sqs.queueNames.requestQueue'),
            queueUrl: configService.get('aws.sqs.urls.requestQueue'),
            // region: configService.get('aws.region'),
            sqs: new SQSClient({
              region: configService.get('aws.region'),
              credentials: {
                accessKeyId: configService.get<string>('aws.AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get<string>('aws.AWS_SECRET_ACCESS_KEY') ,
              }, 
            }),

          }
        ], 
          consumers : [
            {
            name: configService.get('aws.sqs.queueNames.listQueue'),
            queueUrl: configService.get('aws.sqs.urls.listQueue'),
            // batchSize
            sqs: new SQSClient({
              region: configService.get('aws.region'),
              
              credentials: {
                accessKeyId: configService.get<string>('aws.AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get<string>('aws.AWS_SECRET_ACCESS_KEY') ,
              }, 

            }),
            
          },
          {
            name: configService.get('aws.sqs.queueNames.requestQueue'),
            queueUrl: configService.get('aws.sqs.urls.requestQueue'),
            // batchSize
            sqs: new SQSClient({
              region: configService.get('aws.region'),
              
              credentials: {
                accessKeyId: configService.get<string>('aws.AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get<string>('aws.AWS_SECRET_ACCESS_KEY') ,
              }, 

            }),
            
          }

        
        ],
        };
      },
    })
  ],
  providers: [SsqsService, PrismaService],
  exports: [SsqsService],
})
export class SsqsModule {}
