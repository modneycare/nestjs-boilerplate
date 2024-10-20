export default {
  accountId: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID : "AKIAWM2I32HZBWRC7WUL",
  AWS_SECRET_ACCESS_KEY : "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",
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
  },
  sqs: {
    localBrokerEndpoint: process.env.SQS_QUEUE_URL,
    queueNames: {
      requestQueue: process.env.SQS_QUEUE_REQUEST_NAME,
      listQueue: process.env.SQS_QUEUE_LIST_NAME,
      detailQueue: process.env.SQS_QUEUE_DETAIL_NAME,
      uploadQueue: process.env.SQS_QUEUE_UPLOAD_NAME,
      updateQueue: process.env.SQS_QUEUE_UPDATE_NAME,
      deleteQueue: process.env.SQS_QUEUE_DELETE_NAME,
    },
    urls : {
      requestQueue: process.env.SQS_QUEUE_REQUEST_URL,
      listQueue: process.env.SQS_QUEUE_LIST_URL,
      detailQueue: process.env.SQS_QUEUE_DETAIL_URL,
      uploadQueue: process.env.SQS_QUEUE_UPLOAD_URL,
      updateQueue: process.env.SQS_QUEUE_UPDATE_URL,
      deleteQueue: process.env.SQS_QUEUE_DELETE_URL,
    }
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
