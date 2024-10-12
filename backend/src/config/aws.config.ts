export default {
  accountId: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION,
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
  },
  sqs: {
    localBrokerEndpoint: process.env.SQS_QUEUE_URL,
    queueNames: {
      emailQueue: process.env.EMAIL_QUEUE_NAME,
    },
  },
  ses: {
    defaultSenderAddress: process.env.DEFAULT_SENDER_ADDRESS,
    mailHog: {
      enabled: process.env.MAILHOG_ENABLED === 'true',
      host: process.env.MAILHOG_HOST,
      smtpPort: process.env.MAILHOG_SMTP_PORT,
      uiPort: process.env.MAILHOG_UI_PORT,
    },
  },
};
