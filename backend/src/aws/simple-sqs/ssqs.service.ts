// src/sqs/sqs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SsqsService {
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string = process.env.SQS_QUEUE_URL; // 환경 변수에서 대기열 URL을 가져옴
  private readonly logger = new Logger(SsqsService.name);

  constructor() {
    this.sqsClient = new SQSClient({ region: process.env.AWS_REGION });
  }

  // @Cron 데코레이터로 주기적으로 실행
  @Cron('*/1 * * * * *') // 1초마다 실행
  async pollMessages() {
    this.logger.log('Polling SQS for messages...');
    await this.receiveMessages();
  }

  async receiveMessages() {
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
    };

    try {
      const command = new ReceiveMessageCommand(params);
      const data = await this.sqsClient.send(command);
      if (data.Messages) {
        this.logger.log(`Received ${data.Messages.length} messages`);
        await this.handleMessages(data.Messages);
      } else {
        this.logger.log('No messages to receive');
      }
    } catch (error) {
      this.logger.error('Error receiving messages:', error);
    }
  }

  private async handleMessages(messages: any[]) {
    for (const message of messages) {
      this.logger.log(`Processing message: ${message.Body}`);

      // 여기서 메시지를 처리하는 로직을 추가
      await this.deleteMessage(message.ReceiptHandle);
    }
  }

  private async deleteMessage(receiptHandle: string) {
    const params = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    };
    try {
      const command = new DeleteMessageCommand(params);
      await this.sqsClient.send(command);
      this.logger.log('Message deleted successfully');
    } catch (error) {
      this.logger.error('Error deleting message:', error);
    }
  }
}
