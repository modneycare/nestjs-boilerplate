'use strict';

/**
 * ## 상품정보객체 정의
 * 상품등록/수정 요청 시 방대한 데이터를 동일하게 쓰기 때문에 그 상품정보는 클래스로 관리.
 * @typedef NaverCommerce.ChannelProduct
 * @property {object} originProductNo          원상품 정보
 * @property {object} smartstoreChannelProduct 채널상품 정보
 * @property {object?} windowChannelProduct    쇼핑상품 정보
 */
module.exports = (fastify, {}) => {
  class ChannelProduct {
    /**
     * 생성자
     * @param {object} arg - (수정하려는 경우) 네이버채널상품 단일조회 API 로 받은 내용(object)
     * @param {null} arg - 생략 시: 본 클래스에 내장된 기본탬플릿 이용
     * @returns
     */
    constructor(arg) {
      if (typeof (arg || 0) === 'object') {
        this._setByObject(arg);
        return;
      }
      if (/^https?:\/\//.test(arg)) {
        this._setByUrl(arg);
        return;
      }
      this._setByDefault();
    }

    /**
     * @param categoryId {string} 카테고리
     * @return {ChannelProduct}
     */
    setCategoryId(categoryId) {
      assignDeep(this, {
        originProduct: {
          leafCategoryId: categoryId,
        },
      });
      return this;
    }
    /**
     * @param productName {string} 따로 생각해둔 상품명이 있다면
     * @return {ChannelProduct}
     */
    setName(productName) {
      assignDeep(this, {
        originProduct: {
          name: productName,
        },
        smartstoreChannelProduct: {
          channelProductName: productName,
        },
      });
      return this;
    }
    /**
     * @param html {string} 상품상세설명본문
     * @return {ChannelProduct}
     */
    setDetailContent(html) {
      assignDeep(this, {
        originProduct: {
          detailContent: html,
        },
      });
      return this;
    }
    /**
     * @param imageUrl {string<URL>} 대표이미지 URL
     * @return {ChannelProduct}
     */
    setRepresentativeImageUrl(imageUrl) {
      assignDeep(this, {
        originProduct: {
          images: {
            representativeImage: {
              url: imageUrl,
            },
          },
        },
      });
      return this;
    }
    /**
     * @param storeFarmProductOrderMax {number} 1회구매제한수량. null이면 무제한
     * @return {ChannelProduct}
     */
    setMaxPurchaseQuantityPerOrder(storeFarmProductOrderMax) {
      assignDeep(this, {
        originProduct: {
          detailAttribute: {
            purchaseQuantityInfo: {
              maxPurchaseQuantityPerOrder: storeFarmProductOrderMax,
            },
          },
        },
      });
      return this;
    }
    /**
     * @param {number} price
     * @return {ChannelProduct}
     */
    setPrice(price) {
      assignDeep(this, {
        originProduct: {
          salePrice: price,
        },
      });
      return this;
    }
    /**
     * @param percentage {number} 할인율(100보다 작은 수, 단위:%)
     * @return {ChannelProduct}
     */
    setDiscountPercentage(percentage) {
      if (percentage > 100) {
        percentage = 100;
      }
      assignDeep(this, {
        originProduct: {
          customerBenefit: {
            immediateDiscountPolicy: {
              discountMethod: {
                value: percentage,
                unitType: 'PERCENT',
              },
              mobileDiscountMethod: {
                value: percentage,
                unitType: 'PERCENT',
              },
            },
          },
        },
      });
      return this;
    }

    /**
     * @param price {number} 할인액(할인율이 없는 경우에만, 단위:원)
     * @return {ChannelProduct}
     */
    setDiscountPrice(price) {
      if (price > this.originProduct.salePrice) {
        price = this.originProduct.salePrice;
      }
      assignDeep(this, {
        originProduct: {
          customerBenefit: {
            immediateDiscountPolicy: {
              discountMethod: {
                value: price,
                unitType: 'WON',
              },
              mobileDiscountMethod: {
                value: price,
                unitType: 'WON',
              },
            },
          },
        },
      });
      return this;
    }

    clearDiscountPrice() {
      assignDeep(this, {
        originProduct: {
          customerBenefit: undefined,
        },
      });
      return this;
    }

    /**
     * @param {number} 쿠폰 발행 후 유효기간(일)
     * @return {ChannelProduct}
     */
    setPeriodDays(d) {
      assignDeep(this, {
        originProduct: {
          detailAttribute: {
            ecoupon: {
              periodType: 'FLEXIBLE',
              periodDays: d,
            },
            productInfoProvidedNotice: {
              mobileCoupon: {
                usableCondition: `${d}일`,
              },
            },
          },
        },
      });
      return this;
    }

    // TODO: 3.0 DB구조에 맞게 변형 필요!
    /**
     * @param product {sequelize.models.AppProduct<AppService,AppProductInfo>} 서비스와 상세정보를 포함한 폰기프트1.0상품 객체
     * @return {ChannelProduct}
     * @deprecated Pongift 1.0 전용
     */
    setByProduct(product) {
      assignDeep(this, {
        originProduct: {
          name:
            (product.service && product.service.name
              ? `[${_transferSpecialCharacter(product.service.name)}] `
              : '') + _transferSpecialCharacter(product.name),
          detailContent: [
            [
              product.info1,
              product.info2,
              product.info3,
              product.info4,
              product.info5,
            ]
              .filter((v) => v)
              .join('\n\n')
              .replace(/</g, '&lt;')
              .replace(/\n/g, '<br>'),
            product.infoUrl != null &&
              `<img src="${product.infoUrl}" height="100%" width="100%" />`,
            product.service &&
              product.service.name &&
              `<br/><br/>제조사/ 브랜드: ${product.service.name}<br/><br/>`,
            `<img src="http://pongift.com/pages/main/assets/images/storefarm.jpeg" height="100%" width="100%" />`,
          ]
            .filter((v) => v)
            .join(''),
          salePrice: product.productInfos[0].customerPrice,
          detailAttribute: {
            sellerCodeInfo: {
              sellerManagementCode: product.id,
              sellerCustomCode1: product.id,
            },
            ecoupon: {
              periodType: 'FLEXIBLE',
              periodDays: product.expiryDay,
            },
          },
        },
      });
      return this;
    }

    async _setByUrl(url) {
      // 로직 : URL 통신 후 this를 _setByObject 채워넣은 후 {Promise}종결
      // 활용Tip : 생성자에서 수행되면 직접 await 받을 수 없지만, `this.urlLoaded`를 await로 받아서 이어갈 수 있음.
      this.urlLoaded = fastify
        .axios(url, {
          responseType: 'text',
        })
        .then((res) => {
          const data = JSON.parse(res.data, (k, v) => {
            if (typeof v === 'string') {
              v = v
                .replace(/[\x00\x01]/g, '') // 아스키코드 0~1번은 이스케이프문자 보호 백업용으로 쓰기 위해, 그 용도 외에 존재하는 것들은 모두 폐기.
                .replace(/\\\\/g, '\x00') // "\@"를 찾기 전, "\\"는 \문자 그대로 출력을 의미하므로, "\@"에 검색되지 않도록 별도로 백업.
                .replace(/\\@/g, '\x01'); // "@{...}"를 찾기 전, "\@"는 @문자 그대로 출력을 의미하므로, "@{...}"에 검색되지 않도록 별도로 백업.
              v = v.replace(/@\{\w+}/, (chunk) => {
                const envName = chunk.substring(2, chunk.length - 1);
                return process.env[envName];
              });
              v = v
                .replace(/\x01/g, '\\@') // 백업해뒀던 "\@" 복구
                .replace(/\x00/g, '\\\\'); // 백업해뒀던 "\\" 복구
            }
            return v;
          });
          this._setByObject(data);
          // Promise resolve!
        });
      // 프로미스 객체 숨김
      Object.defineProperty(this, 'urlLoaded', {
        configurable: true,
        enumerable: false,
      });
      return await this.urlLoaded;
    }

    _setByObject(obj) {
      Object.assign(this, obj);
    }

    _setByDefault() {
      this._setByObject({
        originProduct: {
          statusType: ChannelProduct.statusType.SALE,
          saleType: ChannelProduct.saleType.NEW,
          leafCategoryId: null,
          name: '',
          detailContent: '',
          images: {
            representativeImage: {
              url: '',
            },
          },
          salePrice: 0,
          stockQuantity: 99999999,
          detailAttribute: {
            afterServiceInfo: {
              afterServiceTelephoneNumber: '',
              afterServiceGuideContent: '',
            },
            purchaseQuantityInfo: {
              maxPurchaseQuantityPerId: 99999,
            },
            originAreaInfo: {
              originAreaCode: '00',
            },
            taxType: 'DUTYFREE',
            sellerCommentUsable: false,
            minorPurchasable: true,
            ecoupon: {
              periodType: 'FLEXIBLE',
              periodDays: 0,
              publicInformationContents: '',
              contactInformationContents: '',
              usePlaceType: 'PLACE',
              usePlaceContents: '',
              restrictCart: false,
            },
            productInfoProvidedNotice: {
              productInfoProvidedNoticeType: '',
              mobileCoupon: {
                returnCostReason: '',
                noRefundReason: '',
                qualityAssuranceStandard: '',
                compensationProcedure: '',
                troubleShootingContents: '',
                issuer: '',
                usableCondition: '',
                usableStore: '',
                cancelationPolicy: '',
                customerServicePhoneNumber: '',
              },
            },
          },
        },
        smartstoreChannelProduct: {
          channelProductName: '',
          naverShoppingRegistration: false, // 네이버쇼핑 등록 여부
          channelProductDisplayStatusType: 'ON', // OFF="SUSPENSION"
        },
      });
    }
  }

  /**
   * 상품 판매 상태 코드
   * @typedef ChannelProduct.statusType
   */
  ChannelProduct.statusType = Object.freeze({
    WAIT: 'WAIT',
    SALE: 'SALE',
    OUTOFSTOCK: 'OUTOFSTOCK',
    UNADMISSION: 'UNADMISSION',
    REJECTION: 'REJECTION',
    SUSPENSION: 'SUSPENSION',
    CLOSE: 'CLOSE',
    PROHIBITION: 'PROHIBITION',
    DELETE: 'DELETE',
  });

  /**
   * 상품 판매 유형 코드
   * @typedef ChannelProduct.saleType
   * 새상품 vs 중고상품
   */
  ChannelProduct.saleType = Object.freeze({
    OLD: 'OLD',
    NEW: 'NEW',
  });

  return ChannelProduct;
};

function assignDeep(base, changes) {
  if ('object' !== typeof changes || !changes) {
    return changes;
  }
  for (let k of Object.keys(changes || {})) {
    const v = changes[k];
    if (v === undefined) {
      delete base[k];
      continue;
    }
    if (typeof (v || 0) === 'object' && !Array.isArray(v)) {
      if (
        base[k] == null ||
        'object' !== typeof base[k] ||
        Array.isArray(base[k])
      ) {
        base[k] = v;
      }
      assignDeep(base[k], changes[k]);
      continue;
    }
    base[k] = v;
  }
  return base;
}
