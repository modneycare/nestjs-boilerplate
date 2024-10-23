'use strict';
const fp = require('fastify-plugin');
/**
 * Naver Plugin
 */
module.exports = fp(async (fastify, opts) => {
  opts.axiosNaverInstance = await require('./config')(fastify, opts);

  const api = fastify.decorate('naverCommerce', {
    api: require('./apis')(fastify, opts),
    ChannelProduct: require('./channel-product')(fastify, opts),
    errors: require('./error'),
  });
});
