'use strict';

module.exports = {
  /**
   * @constructor
   * @param {string} naverResponseCode - 네이버에서 준 응답데이터의 code
   */
  STATUS_ERROR: class NaverReqIntcStatusException extends Error {
    // instance scope
    constructor(naverResponseCode) {
      super(`Naver RequestInterceptor STATUS is '${naverResponseCode}'`);
      this.code = naverResponseCode;
      this.name = this.constructor.name; // = 클래스명 = 'NaverReqIntcStatusException'
    }
  },
};
