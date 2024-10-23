'use strict';

module.exports = (fastify, { axiosNaverInstance }) => ({
  // # 1 상품 외
  //  ██████  █████  ████████ ███████  ██████   ██████  ██████  ██    ██
  // ██      ██   ██    ██    ██      ██       ██    ██ ██   ██  ██  ██
  // ██      ███████    ██    █████   ██   ███ ██    ██ ██████    ████
  // ██      ██   ██    ██    ██      ██    ██ ██    ██ ██   ██    ██
  //  ██████ ██   ██    ██    ███████  ██████   ██████  ██   ██    ██

  /**
   * 카테고리 목록 조회
   * @returns {object} 응답 바디
   */
  async getCategoryList() {
    return await axiosNaverInstance
      .get('v1/categories', {})
      .then((res) => res.data);
  },

  /**
   * 카테고리 상세 조회
   * @param {object} options
   * @param {string} options.categoryId - 카테고리 아이디
   * @returns {object} 응답 바디
   */
  async getCategoryDetail(options) {
    const categoryId = options?.categoryId || options;
    return await axiosNaverInstance
      .get(`v1/categories/${categoryId}`, {})
      .then((res) => res.data);
  },

  /**
   * 카테고리 하위 조회
   * @param {object} options
   * @param {string} options.categoryId - 상위 카테고리 아이디
   * @returns {object} 응답 바디
   */
  async getCategorySub(options) {
    const categoryId = options?.categoryId || options;
    return await axiosNaverInstance
      .get(`v1/categories/${categoryId}/sub-categories`, {})
      .then((res) => res.data);
  },

  /**
   * 카탈로그모델 조회
   * @param {object} options
   * @param {string} options.name - 카탈로그 모델명 검색어
   * @returns {object} 응답 바디
   */
  async getModelList(options) {
    const name = options?.name || options;
    return await axiosNaverInstance
      .get(`v1/product-models`, {
        params: { name },
      })
      .then((res) => res.data);
  },

  /**
   * 원산지 리스트 얻어오기
   * @returns {object} 응답 바디
   */
  async getOriginAreaList() {
    return await axiosNaverInstance
      .get(`v1/product-origin-areas`, {})
      .then((res) => res.data);
  },

  // # 2 상품관리
  //  ██████   ██████   ██████  ██████  ███████
  // ██       ██    ██ ██    ██ ██   ██ ██
  // ██   ███ ██    ██ ██    ██ ██   ██ ███████
  // ██    ██ ██    ██ ██    ██ ██   ██      ██
  //  ██████   ██████   ██████  ██████  ███████

  /**
   * 상품 목록 조회
   * @param {object?} options - 각종 검색조건 모음 (미구현)
   * @returns {object} 응답 바디
   */
  async getGoodsList(options = {}) {
    return await axiosNaverInstance
      .post(
        `v1/products/search`,
        {
          // 검색조건 넣는 곳
          // sellerManagementCode:
        },
        {},
      )
      .then((res) => res.data);
  },

  /**
   * 상품 상세 조회
   * @param {string} channelProductNo - 채널상품번호
   * @returns {object} 응답 바디
   */
  async getGoodsDetail(channelProductNo) {
    return await axiosNaverInstance
      .get(`v2/products/channel-products/${channelProductNo}`, {})
      .then((res) => res.data);
  },

  /**
   * 상품 생성 등록
   * @param {NaverCommerce.ChannelProductObject} channelProduct - 채널상품 구조체
   * @returns {object} 응답 바디
   */
  async createChannelProduct(channelProduct) {
    return await axiosNaverInstance
      .post(`v2/products`, channelProduct, {})
      .then((res) => res.data);
  },

  /**
   * 채널상품 수정 변경
   * @param {string} channelProductNo - 채널상품번호
   * @param {NaverCommerce.ChannelProductObject} channelProduct - 수정이 반영된 채널상품 구조체 전체
   * @returns {object} 응답 바디
   */
  async updateChannelProduct(channelProductNo, channelProduct) {
    return await axiosNaverInstance
      .put(
        `v2/products/channel-products/${channelProductNo}`,
        channelProduct,
        {},
      )
      .then((res) => res.data);
  },

  /**
   * 상품 삭제
   * @param {string} channelProductNo - 채널상품번호
   * @returns {object} 응답 바디
   */
  async deleteProduct(channelProductNo) {
    try {
      return await axiosNaverInstance
        .delete(`v2/products/channel-products/${channelProductNo}`, {})
        .then((res) => res.data);
    } catch (error) {
      throw error;
    }
  },

  // # 3 주문 관리
  //  ██████  ██████  ██████  ███████ ██████
  // ██    ██ ██   ██ ██   ██ ██      ██   ██
  // ██    ██ ██████  ██   ██ █████   ██████
  // ██    ██ ██   ██ ██   ██ ██      ██   ██
  //  ██████  ██   ██ ██████  ███████ ██   ██

  /**
   * 변경이 있는 상품주문 목록 얻어오기
   * @async
   * @generator
   * @param {object} options
   * @param {Date|string|number|null} options.from - 생략 시 to로부터 10분 전
   * @param {Date|string|number|null} options.to   - 생략 시 현재시각
   * @return {Generator<Promise<Array<{
   *      lastChangedDate: string,
   *      lastChangedType: string,
   *      orderId: string,
   *      productOrderId: string,
   *      productOrderStatus: string,
   *      paymentDate: string,
   *      receiverAddressChanged: boolean,
   *      claimType: string?,
   *      claimStatus: string?,
   *      giftReceivingStatus: string?,
   * }>>>}
   */
  async *gGetChangedOrderList({ from, to }) {
    // 날짜시간 받기
    if (to) {
      to = new Date(to);
    } else {
      to = new Date();
    }
    if (from) {
      from = new Date(from);
    } else {
      const TEN_MINUTES = 10 * 60 * 1000;
      from = new Date(to.getTime() - TEN_MINUTES);
    }
    // 조회
    const params = {
      lastChangedFrom: from.toISOString(),
      lastChangedTo: to.toISOString(),
    };
    let resData;
    let hasNext = true;
    while (hasNext) {
      hasNext = false;
      resData = await axiosNaverInstance
        .get(`v1/pay-order/seller/product-orders/last-changed-statuses`, {
          params,
        })
        .then((res) => res.data?.data || {});
      yield resData.lastChangeStatuses || [];
      if (resData.more) {
        params.lastChangedFrom = resData.more.moreFrom;
        params.moreSequence = resData.more.moreSequence;
        hasNext = true;
      }
    }
  },

  /**
	 * 주문 상세 조회
	 * @param {string|string[]} productOrderIds - 주문번호
	 * @return 응답 {Object|Array<{
			productOrder :object
			order :object
		}>}

		※ 애초에 상품주문번호를, 배열로 줬으면 반환도 배열. 낱개 문자열로 줬으면 반환도 낱개 오브젝트.
	*/
  async getOrderDetail(productOrderIds) {
    let isArray = true;
    if (true != Array.isArray(productOrderIds)) {
      isArray = false;
      productOrderIds = [productOrderIds];
    }
    const { timestamp, data, traceId } = await axiosNaverInstance
      .post(`v1/pay-order/seller/product-orders/query`, { productOrderIds }, {})
      .then((res) => res.data);
    return isArray ? data : data[0];
  },

  /**
   * 특정 상품주문을 발주(확인/읽음) 처리
   * @param {string|string[]} productOrderIds - 주문번호
   * @return {object} { successProductOrderIds: string[], failProductOrderInfos: object[] }
   */
  async confirmProductOrder(productOrderIds) {
    if (false === Array.isArray(productOrderIds)) {
      productOrderIds = [productOrderIds];
    }
    return await axiosNaverInstance
      .post(
        `v1/pay-order/seller/product-orders/confirm`,
        { productOrderIds },
        {},
      )
      .then((res) => res.data);
  },

  /**
   * 특정 상품주문을 발송한 것으로 처리
   * @param {string|string[]|object|object[]} dispatchProductOrderParams
   * @param {string}  productOrderDispatchParameters.productOrderId       - 발송의 대상이 되는 상품주문번호
   * @param {string}  productOrderDispatchParameters.dispatchDate         - 배송시작일
   * @param {string?} productOrderDispatchParameters.deliveryMethod       - 배송 수단
   * @param {string?} productOrderDispatchParameters.deliveryCompanyCode  - 택배사
   * @param {string?} productOrderDispatchParameters.trackingNumber       - 송장번호
   * @return {object} { successProductOrderIds: string[], failProductOrderInfos: object[] }
   */
  async dispatchProductOrder(dispatchProductOrderParams) {
    // 인자 받아들이기
    if (false === Array.isArray(dispatchProductOrderParams)) {
      dispatchProductOrderParams = [dispatchProductOrderParams];
    }
    const now = new Date();
    dispatchProductOrderParams.forEach((param, i) => {
      // 상품주문번호
      if (typeof param === 'string') {
        param = { productOrderId: param };
        dispatchProductOrderParams[i] = param;
      }
      if (typeof (param || 0) !== 'object') {
        throw new Error(
          `NaverCommerceApi.dispatchProductOrder : params[${i}] must be an object not ${param == null ? String(param) : typeof param}`,
        );
      }
      // 배송시작일
      param.dispatchDate =
        param.dispatchDate == null ? now : new Date(param.dispatchDate);
      try {
        // InvalidDate 오류 포획
        param.dispatchDate = param.dispatchDate.toISOString();
      } catch (err) {
        err.message = `NaverCommerceApi.dispatchProductOrder : params[${i}].dispatchDate : ${err.message}`;
        throw err;
      }
      // 그외 유형상품을 위한 항목은 생략
      param.deliveryMethod = 'NOTHING';
    });
    return await axiosNaverInstance
      .post(
        `v1/pay-order/seller/product-orders/dispatch`,
        { dispatchProductOrders: dispatchProductOrderParams },
        {},
      )
      .then((res) => res.data);
  },

  /**
   * 특정 상품주문을 판매자 직권으로 반품처리 시켜버리기
   * @param {string} productOrderId - 처리의 대상이 되는 상품주문번호
   * @return {object} { successProductOrderIds: string[], failProductOrderInfos: object[] }
   */
  async returnProductOrder(productOrderId) {
    // [반품요청] 상태로
    await this.requestReturnProductOrder(productOrderId);
    // [반품승인] 상태로
    return await this.approveReturnProductOrder(productOrderId);
  },

  /**
   * 특정 상품주문을, 구매자가 반품요청한 것처럼 상태를 조작
   * @param {string} productOrderId - 처리의 대상이 되는 상품주문번호
   * @return {object} { successProductOrderIds: string[], failProductOrderInfos: object[] }
   */
  async requestReturnProductOrder(productOrderId) {
    const payload = {
      returnReason: 'INTENT_CHANGED', // = 구매의사 변심 = 소비자 귀책
      collectDeliveryMethod: 'NOTHING',
    };
    return await axiosNaverInstance
      .post(
        `v1/pay-order/seller/product-orders/${productOrderId}/claim/return/request`,
        payload,
        {},
      )
      .then((res) => res.data);
  },

  /**
   * 특정 상품주문의 반품요청을 승인
   * @param {string} productOrderId - 처리의 대상이 되는 상품주문번호
   * @return {object} { successProductOrderIds: string[], failProductOrderInfos: object[] }
   */
  async approveReturnProductOrder(productOrderId) {
    return await axiosNaverInstance
      .post(
        `v1/pay-order/seller/product-orders/${productOrderId}/claim/return/approve`,
        {},
        {},
      )
      .then((res) => res.data);
  },

  /**
   * 특정 상품주문의 반품요청을 거부
   * @param {object} options
   * @param {string} productOrderId - 처리의 대상이 되는 상품주문번호
   * @param {string} reason - 거부 사유
   * @return {object} { successProductOrderIds: string[], failProductOrderInfos: object[] }
   */
  async rejectReturnProductOrder(productOrderId, reason) {
    return await axiosNaverInstance
      .post(
        `v1/pay-order/seller/product-orders/${productOrderId}/claim/return/reject`,
        { rejectReturnReason: reason },
        {},
      )
      .then((res) => res.data);
  },

  // # 4 Ecoupon
  // ███████        ██████  ██████  ██    ██ ██████   ██████  ███    ██
  // ██            ██      ██    ██ ██    ██ ██   ██ ██    ██ ████   ██
  // █████   █████ ██      ██    ██ ██    ██ ██████  ██    ██ ██ ██  ██
  // ██            ██      ██    ██ ██    ██ ██      ██    ██ ██  ██ ██
  // ███████        ██████  ██████   ██████  ██       ██████  ██   ████

  /**
   * e쿠폰 상품을 발송처리
   * @param {object|object[]} dispatchECouponParams
   * @param {string}          dispatchECouponParams.productOrderId - 발송의 대상이 되는 상품주문번호
   * @param {string}          dispatchECouponParams.eCouponNo      - eCoupon번호 = 상태 변경이나 유효기간 변경 등에 사용하는 유니크한 값 (ex 네이버페이 시스템 상에서 생성되는 상품주문번호)
   * @param {string[]}        dispatchECouponParams.barcodeNos     - 바코드번호 (최대2개) = 네이버가 핀/바코드를 직접 취급해야 할 필요가 있는 경우(선물하기 등) 전달.
   * @param {any}             dispatchECouponParams.validStartDate - 유효기간 시작일. 기본값=NOW
   * @param {any}             dispatchECouponParams.validEndDate   - 유효기간 종료일.
   * @param {number?}         dispatchECouponParams.validDays      - 유효기간 일수. 종료일을 지정하지 않았다면 이 값을 봅니다.
   * @return {object} { successProductOrderIds: string[], failProductOrderInfos: object[] }
   */
  async dispatchECoupons(dispatchECouponParams) {
    if (false === Array.isArray(dispatchECouponParams)) {
      dispatchECouponParams = [dispatchECouponParams];
    }
    const DAY = 86400000;
    dispatchECouponParams.forEach((param, i) => {
      if (typeof (param || 0) !== 'object') {
        throw new Error(
          `NaverCommerceApi.dispatchECoupon : params[${i}] must be an object not ${param == null ? String(param) : typeof param}`,
        );
      }
      // 바코드는 배열이거나 아예 없어야 함.
      if (Array.isArray(param.barcodeNos)) {
        if (0 === param.barcodeNos.length) {
          delete param.barcodeNos;
        }
      } else if (['string', 'number'].includes(typeof param.barcodeNos)) {
        param.barcodeNos = [param.barcodeNos];
      } else {
        delete param.barcodeNos;
      }
      // 유효기간 설정
      try {
        _calcValidDate(param);
      } catch (err) {
        err.message = err.message.replace(/params\[\]/, `params[${i}]`);
        throw err;
      }
    });
    // SEND
    return await axiosNaverInstance
      .post(
        `v1/pay-order/seller/product-orders/e-coupon/dispatch`,
        { dispatchECoupons: dispatchECouponParams },
        {},
      )
      .then((res) => res.data);
  },

  /**
   * e쿠폰 상태 변경
   * @param {object|object[]} setECouponsStatusParams
   * @param {string} setECouponsStatusParams.productOrderId            - 변경의 대상이 되는 상품주문번호
   * @param {string} setECouponsStatusParams.eCouponNo                 - 변경의 대상이 되는 쿠폰번호
   * @param {string} setECouponsStatusParams.eCouponStatusType         - 원하는 상태 (NOT_USED | CANCEL | USED | UNUSABLE)
   * @param {Date|string|number|null} setECouponsStatusParams.usedDate - (USED로 바꾸는 경우) 사용일시. 기본값 = NOW
   */
  async setECouponsStatus(setECouponsStatusParams) {
    if (false === Array.isArray(setECouponsStatusParams)) {
      setECouponsStatusParams = [setECouponsStatusParams];
    }
    setECouponsStatusParams.forEach((param) => {
      if (param.eCouponStatusType === 'USED') {
        param.usedDate =
          param.usedDate == null ? new Date() : new Date(param.usedDate);
      } else {
        delete param.usedDate;
      }
    });
    return await axiosNaverInstance
      .post(
        `v1/pay-order/seller/product-orders/e-coupon/status/change`,
        { changeECouponStatuses: setECouponsStatusParams },
        {},
      )
      .then((res) => res.data);
  },

  /**
   * e쿠폰 유효기간을 연장
   * @param {object|object[]}          expandECouponsValidDateParams
   * @param {string}                   expandECouponsValidDateParams.productOrderId - 변경의 대상이 되는 상품주문번호
   * @param {string}                   expandECouponsValidDateParams.eCouponNo      - 변경의 대상이 되는 쿠폰번호
   * @param {Date|string|number|null}  expandECouponsValidDateParams.validStartDate - 유효기간 시작일. 기본값=NOW
   * @param {Date|string|number|null}  expandECouponsValidDateParams.validEndDate   - 유효기간 종료일.
   * @param {number?}                  expandECouponsValidDateParams.validDays      - 유효기간 일수. 종료일을 지정하지 않았다면 이 값을 봅니다.
   */
  async changeECouponsValidDate(expandECouponsValidDateParams) {
    if (false === Array.isArray(expandECouponsValidDateParams)) {
      expandECouponsValidDateParams = [expandECouponsValidDateParams];
    }
    expandECouponsValidDateParams.forEach((param, i) => {
      try {
        _calcValidDate(param);
      } catch (err) {
        err.message = err.message.replace(/params\[\]/, `params[${i}]`);
        throw err;
      }
    });
    return await axiosNaverInstance
      .post(
        `v1/pay-order/seller/product-orders/e-coupon/valid-date/change`,
        { changeECouponValidDates: expandECouponsValidDateParams },
        {},
      )
      .then((res) => res.data);
  },

  // # 그외
  /**
   * 인증토큰 발행
   * @param {boolean} forceRefresh - Redis에 이미 값이 있어도 발행요청 보내기
   * @returns {string} HTTP HEADER의 AUTH로 들어가는 형태 (토큰타입+사이띄기+토큰문자열)
   */
  async getAuthorization(forceRefresh) {
    return await axiosNaverInstance.getAuthorization(forceRefresh);
  },

  /**
   * 네이버 CDN에 이미지 업로드
   * @param {string} url 이미지를 가리키는 웹 주소
   * @returns {string} 네이버에 등록된 이미지를 가리키는 웹 주소
   */
  async uploadImage(url) {
    axiosNaverInstance.uploadImage(url);
  },
  /*
		by yyspu 
		10개까지 등록가능하기 떄문에 멀티 이미지 업로드 추가

	*/
  async uploadImages(urls) {
    axiosNaverInstance.uploadImages(urls);
  },
});

/**
 * 유효기간 계산 : 발송요청할 때와 연장요청할 때 공통적으로 쓰임
 * @param {object} param - { validStartDate?, validEndDate?, validDays? }
 * @return {object} { validStartDate, validEndDate }
 */
function _calcValidDate(param) {
  // 본 _calcValidDate()를 호출한 곳의 함수명 추출
  const apiName = new Error().stack
    .split('\n')
    .filter((ln) => ln.match(/\.[A-Za-z]+ECoupons/))[0]
    .match(/(?<=\.)[^.]+(?=\s)/)[0];
  // 유효기간 시작일 계산
  param.validStartDate =
    param.validStartDate == null ? new Date() : new Date(param.validStartDate);
  // 유효기간 종료일 계산
  const DAY = 86400000;
  if (param.validEndDate == null) {
    let validDays = parseInt(param.validDays);
    if (0 < validDays) {
      param.validEndDate = new Date(
        param.validStartDate.getTime() + DAY * validDays,
      );
    } else {
      throw new Error(
        `NaverCommerceApi.${apiName} : params[].validEndDate is null, then params[].validDays must be a natural number not ${param.validDays == null ? String(param.validDays) : typeof param.validDays}`,
      );
    }
  }
  delete param.validDays;
  try {
    // InvalidDate 오류 포획
    param.validStartDate = param.validStartDate.toISOString();
    param.validEndDate = param.validEndDate.toISOString();
  } catch (err) {
    err.message = `NaverCommerceApi.${apiName} : params[].dispatchDate : ${err.message}`;
    throw err;
  }
}
