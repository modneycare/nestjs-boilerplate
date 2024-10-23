'use strict';

const { STATUS_ERROR } = require('./errors');
const bcrypt = require('bcrypt');
const FormData = require('form-data');

module.exports = async (fastify, opts) => {
  const RETRY_COUNT = 2;
  const REDIS_KEY__NAVER_API_TOKEN = 'NaverAccessToken'; // Headers.Authorization로 넣을 값
  const REDIS_KEY__NAVER_API_STATUS = 'NaverApiStatus'; // "OK" 또는 최종오류코드
  const REDIS_VAL__NAVER_API_STATUS__OK = 'OK';

  const axiosNaverInstance = fastify.axios.create({
    baseURL: process.env.NAVER_COMMERCE_API_HOST,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptors
  /**
   * ## ReqIntc :: 요청 인터셉터
   * @desc 요청 전 토큰 처리
   */
  axiosNaverInstance.interceptors.request.use(
    async (config) => {
      // ### ReqIntc :: 일반 공통 ###
      if (config.url === 'v1/oauth2/token') {
        // 토큰발행 요청 시 본 axiosNaverInstance를 쓸 리는 없으나, 혹시 모를 무한루프를 방지하기 위해 분기
      } else {
        // 헤더 세팅
        config.headers['Authorization'] = `${await getAuthorization()}`;
        // TODO : hide
        // 호출할 상태가 아니면 중단
        // const naverAPIStatus = await fastify.redis.exists(REDIS_KEY__NAVER_API_STATUS).then(isExists => {
        // 	return isExists ?
        // 		fastify.redis.get(REDIS_KEY__NAVER_API_STATUS) :
        // 		REDIS_VAL__NAVER_API_STATUS__OK
        // })
        // if (naverAPIStatus !== REDIS_VAL__NAVER_API_STATUS__OK) {
        // 	throw new STATUS_ERROR(naverAPIStatus)
        // }
      }
      // ### ReqIntc :: 이미지 처리 ###
      if (!config.url.includes('v1/product-images/upload')) {
        // 네이버 상품등록 시, 등록할 이미지는 반드시 네이버CDN에 올라간 URL만 허용 => 그외의 URL은 네이버CDN에 업로드하여 변환해줘야 함
        const NAVER_IMAGEURL_REGEXP = /^https?:\/\/([^\/]+\.)?naver\.\w+\//;
        const originProduct = config.data?.originProduct;
        // 상품 대표이미지
        const imageUrl = originProduct?.images?.representativeImage?.url;
        if (imageUrl && false === NAVER_IMAGEURL_REGEXP.test(imageUrl)) {
          originProduct.images.representativeImage.url =
            await uploadImage(imageUrl);
        }
        // 상품 옵션이미지
        let images = originProduct?.images?.optionalImages || [];
        const promiseToReplace = images.map(async (imageUrl, i) => {
          if (imageUrl && false === NAVER_IMAGEURL_REGEXP.test(imageUrl)) {
            originProduct.images.optionalImages[i].url =
              await uploadImage(imageUrl);
          }
        });
        await Promise.all(promiseToReplace);
      }
      // ### ReqIntc :: 폼 헤더 ###
      if (config.data instanceof FormData) {
        config.headers = {
          ...config.headers,
          ...config.data.getHeaders(),
        };
      }
      // ### ReqIntc :: 끝 ###
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  /*
   * ## RspIntc 응답 인터셉터
   * @desc 응답 오류 대응
   * @see https://apicenter.commerce.naver.com/ko/basic/commerce-api#section/%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0/%EC%98%A4%EB%A5%98-%EB%A9%94%EC%8B%9C%EC%A7%80
   */
  axiosNaverInstance.interceptors.response.use(
    async (response) => {
      // 주문 관련 요청은, 실패해도 항상 STATUS 200으로 들어오기 때문에, body내용을 보고 별도로 throw 해줘야 함
      if (
        response.data?.data?.successProductOrderIds ||
        response.data?.data?.failProductOrderInfos
      ) {
        const apiName = response.request.path
          .replace(/.*\/product-orders\//, '')
          .replace(/\?.*/, '');
        const responseBody = response.data;
        let successCount = (responseBody.data.successProductOrderIds || [])
          .length;
        for (let failInfo of responseBody.data.failProductOrderInfos || []) {
          fastify.log.info(
            `NaverCommerceApi/${apiName}(${failInfo.productOrderId}) : ${failInfo.message}`,
          );
        }
        if (0 < successCount) {
          // 정상/성공
          return response;
        }
        // 실패했는데도 200 주는 경우 (Even if there are no successful result, it comes here...)
        const err = new Error(
          `NaverCommerceApi/${apiName} cause no successProductOrderIds`,
        );
        err.request = response.request;
        err.config = response.config;
        err.response = response;
        err.statusCode = 400;
        if (responseBody.data.failProductOrderInfos?.length === 1) {
          err.code = responseBody.data.failProductOrderInfos[0].code;
          err.message = responseBody.data.failProductOrderInfos[0].message;
          // 104135 : 주문 상태를 확인해주세요.
          // 104203 : 주문상태 확인 필요(취소 불가능 주문상태)
          // 104443 : 이미 발주확인 된 주문입니다.
          // 105304 : 해당 상품주문번호(주문번호)와 쿠폰번호에 일치하는 E쿠폰 발급정보를 찾을수 없습니다.
        }
        throw err;
      }
      return response;
    },
    async (error) => {
      const { code, config, request, response } = error;

      if (error.name === STATUS_ERROR.name) {
        // ### RspIntc 1 :: ReqIntc에서 임의 발생시킨 에러 ###
        fastify.log.info(`NaverReqIntc blocked by STATUS '${error.code}'`);
      } else if (String(code).startsWith('GW.')) {
        // ### RspIntc 2 :: ERROR/GW ###
        switch (code) {
          case 'GW.AUTHN': { // OAuth 인증 실패
            // (첫시도포함=)x번째까지는 재시도
            config._axiosInterceptorTryCount ||= 1;
            if (config._axiosInterceptorTryCount < RETRY_COUNT) {
              config._axiosInterceptorTryCount++;
              await getAuthorization();
              return await axiosNaverInstance(config);
            } else {
              // 인증실패가 연속 => 단순한 문제는 아닌 것 같으니 리포트.
              const message = `NaverRspIntc: ${code} x ${config._axiosInterceptorTryCount} time(s)`;
              error.telegramMessage = message;
              break;
            }
          }
          case 'GW.NOT_FOUND': { // API 게이트웨이에 등록되지 않은 API
            // 소스 점검이 필요한 상황, 텔레그램 발송
            const message = `NaverRspIntc: ${code} ${request.method} /${request.path}`;
            error.telegramMessage = message;
            break;
          }
          case 'GW.RATE_LIMIT': { // 요청량 제한 초과
            // 2rps(api마다 다름) = 1초당 요청제한 => 어차피 1초만 기다리면 풀림.
            break;
          }
          case 'GW.PROXY.01': // 호스트 정보 오류
          case 'GW.PROXY.02': // 포트 정보 오류
          case 'GW.PROXY.03': // 서비스로부터 응답을 기다리는 도중 연결이 끊어짐
          case 'GW.PROXY.04': // 네트워크 연결 대기 시간 초과
          case 'GW.PROXY.05': // 기타 서비스 서버 오류
          case 'GW.INTERNAL_SERVER_ERROR': // 예상치 못한 API 게이트웨이 내부 예외 상황
          case 'GW.BLOCK.01': // circuit open으로 인한 요청 차단
          case 'GW.BLOCK.02': // 일부 API 또는 커머스플랫폼 전체 시스템 점검으로 인해 일시적인 API 사용 불가
          case 'GW.TIMEOUT.01': // API 처리 대기 시간 초과
          case 'GW.TIMEOUT.02': { // API 서버의 응답이 없어서 API 게이트웨이가 대기할 수 있는 응답 시간 초과
            // 네이버 내부적인 문제
            // TODO : redis 추가 후 추가
            // await fastify.redis.set(REDIS_KEY__NAVER_API_STATUS, code)
            break;
          }
        }
      } else if (code && request) {
        // ### RspIntc 3 :: GW 제외한 AXIOS에러 ###
        if (/^4../.test(response?.status)) {
          // 요청 데이터가 잘못된 케이스
          error.statusCode = response.status;
          if (response.data?.message) {
            error.message = response.data.message;
            // 101009 : 처리권한이 없는 상품주문번호를 요청했습니다
            // NOT_FOUND : 존재하지 않는 상품입니다.
          }
        } else {
          // GW. 에러가 아닌 경우 => 네이버 내부적인 문제?
          // TODO : redis 추가 후 추가
          // await fastify.redis.set(REDIS_KEY__NAVER_API_STATUS, code)
        }
      } else {
        // ### RspIntc 4 :: Axios 아닌 다른 부분에서의 오류
        switch (error.name) {
          // 오류 종류가 더 추가되면 케이스 분기
          default:
            // 그외 예상치 못한 케이스 = 확인이 필요한 상황 => 텔레그램 발송
            const message = request
              ? `NaverRspIntc: ${code} ${request.method} /${request.path}`
              : `NaverRspIntc: ${error.message}`;
            error.telegramMessage = message;
        }
      }

      return Promise.reject(error);
    },
  );

  // # Methods
  // ███    ███ ███████ ████████ ██   ██  ██████  ██████  ███████
  // ████  ████ ██         ██    ██   ██ ██    ██ ██   ██ ██
  // ██ ████ ██ █████      ██    ███████ ██    ██ ██   ██ ███████
  // ██  ██  ██ ██         ██    ██   ██ ██    ██ ██   ██      ██
  // ██      ██ ███████    ██    ██   ██  ██████  ██████  ███████

  /**
   * ## 인증헤더 값 얻기
   * @description Redis에 저장된 인증정보를 주되, 없으면 토큰을 새로 발급받음.
   * @async
   * @param {number?} seller_id - 고객사 인증키 테이블의 PK
   * @returns {string} HTTP HEADER의 AUTH로 들어가는 형태 (토큰타입+사이띄기+토큰문자열)
   */
  const getAuthorization = (axiosNaverInstance.getAuthorization = async (
    forceRefresh,
  ) => {
    // 이미 있으면 배출
    // if (!forceRefresh && await fastify.redis.exists(REDIS_KEY__NAVER_API_TOKEN)) {
    // 	return await fastify.redis.get(REDIS_KEY__NAVER_API_TOKEN)
    // }
    // 없으면 발급요청 돌입
    const timestamp = Date.now();
    const password = `${process.env.NAVER_COMMERCE_API_CLIENT_ID}_${timestamp}`;
    const hashed = bcrypt.hashSync(
      password,
      process.env.NAVER_COMMERCE_API_CLIENT_SECRET,
    );
    const client_secret_sign = Buffer.from(hashed, 'utf-8').toString('base64');
    const payload = {
      client_id: process.env.NAVER_COMMERCE_API_CLIENT_ID,
      timestamp,
      client_secret_sign,
      grant_type: 'client_credentials',
      type: 'SELF',
    };
    const { token_type, access_token, expires_in } = (
      await fastify.axios.post(
        axiosNaverInstance.defaults.baseURL + '/v1/oauth2/token',
        payload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
    ).data;
    const authorization = `${token_type} ${access_token}`;
    // await fastify.redis.set(REDIS_KEY__NAVER_API_STATUS, REDIS_VAL__NAVER_API_STATUS__OK)
    // await fastify.redis.set(REDIS_KEY__NAVER_API_TOKEN, authorization, "EX", expires_in)
    return authorization;
  });

  /**
   * 네이버 CDN에 이미지 업로드
   * @async
   * @param {string} url
   * @returns {string} 네이버에 등록된 이미지를 가리키는 웹 주소
   */
  const uploadImage = (axiosNaverInstance.uploadImage = async (url) => {
    try {
      const downloaded = await fastify.axios.get(url, {
        responseType: 'stream',
      });
      const mimeType = downloaded.headers['content-type'];
      // FormData.append 메서드를 사용하여 이미지 파일 추가
      const formData = new FormData();
      formData.append('imageFiles', downloaded.data);
      // NAVER에서 파일형식 제한 = 정확한 문제점을 자세히 응답주진 않음 => 요청 전 자체 진단 디버깅
      const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
      const allowedMimeTypes = allowedExts.map((ext) => `image/${ext}`);
      if (false === allowedMimeTypes.includes(mimeType)) {
        throw new Error(`MimeType must be 'image/{${allowedExts.join('|')}}'`);
      }
      if (
        false ===
        allowedExts
          .map((ext) => {
            return url.toLowerCase().endsWith(`\.${ext}`);
          })
          .includes(true)
      ) {
        throw new Error(`URL must have extension '${allowedExts.join('|')}'`);
      }
      const response = await axiosNaverInstance.post(
        `v1/product-images/upload`,
        formData,
        {},
      );
      return response.data.images[0].url;
    } catch (err) {
      if (err.name !== 'NaverCommerceApiFailed') {
        err.message = 'NaverImageError: ' + err.message;
      }
      throw err;
    }
  });

  const uploadImages = (axiosNaverInstance.uploadImages = async (urls) => {
    try {
      // FormData.append 메서드를 사용하여 이미지 파일 추가
      const formData = new FormData();
      let files = [];
      for (url of urls) {
        const downloaded = await fastify.axios.get(url, {
          responseType: 'stream',
        });
        const mimeType = downloaded.headers['content-type'];
        files.push(downloaded.data);
        // NAVER에서 파일형식 제한 = 정확한 문제점을 자세히 응답주진 않음 => 요청 전 자체 진단 디버깅
        const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        const allowedMimeTypes = allowedExts.map((ext) => `image/${ext}`);
        if (false === allowedMimeTypes.includes(mimeType)) {
          throw new Error(
            `MimeType must be 'image/{${allowedExts.join('|')}}'`,
          );
        }
        if (
          false ===
          allowedExts
            .map((ext) => {
              return url.toLowerCase().endsWith(`\.${ext}`);
            })
            .includes(true)
        ) {
          throw new Error(`URL must have extension '${allowedExts.join('|')}'`);
        }
      }
      formData.append('imageFiles', files);
      const response = await axiosNaverInstance.post(
        `v1/product-images/upload`,
        formData,
        {},
      );
      return response.data.images[0].url;
    } catch (err) {
      if (err.name !== 'NaverCommerceApiFailed') {
        err.message = 'NaverImageError: ' + err.message;
      }
      throw err;
    }
  });

  return axiosNaverInstance;
};
