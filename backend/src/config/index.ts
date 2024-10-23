import aws from './aws.config';
import translate from './translate.config';
import { Env } from '../shared/enums/env.enum';
import crawler from './crawler.confg';

export const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV || Env.Dev,
  stage: process.env.STAGE,
  isOffline: process.env.IS_OFFLINE === 'true',
  appName: process.env.APP_NAME || undefined,
  appGlobalPrefix: process.env.APP_GLOBAL_PREFIX || undefined,
  enableSwagger: process.env.ENABLE_SWAGGER || false,
  aws,
  translate,
  crawler
};

export default (): any => config;
