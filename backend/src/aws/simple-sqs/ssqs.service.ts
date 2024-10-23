// src/sqs/sqs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import { Cron } from '@nestjs/schedule';
import { SendMessageInput } from '../sqs/dtos/send-message.input';
import { ConfigService } from '@nestjs/config';
import {
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsService,
} from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';
import { ReqListDto } from '@/sourcing/dto/req-list-dto';
import { map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { catchError } from 'rxjs';
import { PrismaService } from '@/prisma/prisma.service';
import { TranslationService } from '@/translation/translation.service';
import { CollectionStatus, Prisma } from '@prisma/client';
import { DetailResponseDto } from '@/sourcing/dto/detail-response.dto';
@Injectable()
export class SsqsService {
  private readonly logger = new Logger(SsqsService.name);
  private REQ_ITEM_LIST = this.configService.get('crawler.requestListUrl');
  private REQ_ITEM_DETAIL = this.configService.get('crawler.requestDetailUrl');

  constructor(
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly translationService: TranslationService,
  ) {}

  // @Cron 데코레이터로 주기적으로 실행
  // @Cron('*/1 * * * * *') // 1초마다 실행
  async pollMessages() {
    // console.log('pollMessages : ',Date.now().toString());
    // SQS에 메시지를 보내는 코드
    // await this.sqsService.send('sourcingList.fifo', {
    //   // id: Date.now().toString(), // 메시지 ID
    //   body: {'dma.id' : Date.now().toString()}, // 메시지 내용
    //   groupId: '2', // 메시지 그룹 ID
    //   deduplicationId: Date.now().toString(), // 메시지 중복 제거 ID
    //   delaySeconds: 0, // 지연 시간 (초)
    //   // messageAttributes: {
    //   // },
    //   id: Date.now().toString(),
    // });
  }

  @SqsMessageHandler(/** name: */ 'requestQueue.fifo', /** batch: */ false)
  public async handleMessage(message: Message) {
    console.log('sqs msg : ', message);
    // crawling 요청 api split
    // limitCount와 minPage, maxPage 값을 이용해서 진행하기
    const req = JSON.parse(message.Body);
    const crawlId = req.crawlId;
    const user = req.user;

    if (req.option.limitCount && req.option.limitCount > 0) {
      // limitCount로 수집요청한 경우
      let i = 0;
      let limit = Math.floor(req.option.limitCount / 50); // 한페이지에 약 50개를 수집하는 것으로 가정
      for (let i = 1; i <= limit + 1; i++) {
        const req_body = {
          ...req,
          page_scope: {
            start_page: i,
            end_page: i,
          },
        };

        console.log('req_body : ', req_body);
        // forward to sqs
        const sresult = await this.sqsService.send(
          this.configService.get('aws.sqs.queueNames.listQueue'),
          {
            id: crawlId.toString() + '-' + i,
            body: req_body,
            groupId: user.id + '-' + crawlId,
            deduplicationId: crawlId.toString() + '-' + i,
            delaySeconds: 0,
            messageAttributes: {},
          },
        );
      }
      return true;
    }

    // start_page, end_page로 수집요청한 경우
    if (req.page_scope.start_page && req.page_scope.end_page) {
      for (
        let i = req.page_scope.start_page;
        i <= req.page_scope.end_page;
        i++
      ) {
        const req_body = {
          ...req,
          page_scope: {
            start_page: i,
            end_page: i,
          },
        };
        // forward to sqs
        const sresult = await this.sqsService.send(
          this.configService.get('aws.sqs.queueNames.listQueue'),
          {
            id: crawlId.toString() + '-' + i,
            body: req_body,
            groupId: user.id + '-' + crawlId,
            deduplicationId: crawlId.toString() + '-' + i,
            delaySeconds: 0,
            messageAttributes: {},
          },
        );
      }

      return true;
    }
  }

  // crawling list 요청처리
  @SqsMessageHandler(/** name: */ 'sourcingList.fifo', /** batch: */ false)
  async requestCrawling(message: Message) {
    const req = JSON.parse(message.Body);
    console.log('list req : ', req);
    if (req.crawlType === 'list') {
      const response = await axios
        .post(this.REQ_ITEM_LIST, req, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
          },
        })
        .then((response) => {
          console.log('Response received:', response.data?.message);
          if (response.data?.message) {
            console.log('list req : ', req);
            return false;
          }
          return response.data;
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            console.error(
              'Error occurred while processing the request:',
              error,
            );
          } else {
            console.error('Unexpected error:', error?.response?.data);
          }
          // throw error;
        });
      console.log('list results : ', response);
      if (response?.length && response.length > 0) {
        // prisma data insert
        // TODO : 성인상품여부, 광고상품여부, 표시가격에서 가격 추출
        const results = [];
        response.forEach(async (element) => {
          const displayPrice = element.product_price ?? '';
          const translatedName =
            await this.translationService.translateProductNameGpt(
              element.product_name,
            );
          // 표시가격은 '' 또는 '$200' 형태로 존재함 , 통화표시 제외하고 숫자만 추출
          const price = displayPrice.replace('$', '');
          console.log('element : ', element);

          const result = await this.prismaService.product.upsert({
            where: {
              productId: element.product_id,
            },
            create: {
              productId: element.product_id,
              url: element.product_url,
              thumbnailUrl: element.product_image ?? '',
              name: element.product_name,
              translatedName: translatedName ?? element.product_name,
              displayPrice: displayPrice,
              originalPrice: parseFloat(price) ?? 0,
              discountedPrice: parseFloat(price) ?? 0,
              // details : {
              //   create : {
              //     currency : displayPrice.replace(/[0-9.,]/g, ''),
              //     thumbnailUrl : element.product_image ?? '',
              //     // 그외 정보는 상품디테일 수집시 생성

              //   }
              // }
            },
            update: {
              url: element.product_url,
              thumbnailUrl: element.product_image ?? '',
              name: translatedName ?? element.product_name,
              displayPrice: displayPrice,
              originalPrice: parseFloat(price) ?? 0,
              discountedPrice: parseFloat(price) ?? 0,
            },
          });
          results.push(result);
          // product Collection 연결
          console.log('product upsert result : ', result);
          await this.prismaService.productCollection.create({
            data: {
              productId: result.id,
              collectionId: req.crawlId,
            },
          });
        });
      }
      return true;
    } else {
      console.log('unknown crawlType : ', req.crawlType);
      return false;
    }
  }

  // crawling detail 요청처리
  @SqsMessageHandler(/** name: */ 'sourcingDetail.fifo', /** batch: */ false)
  async requestCrawlingDetail(message: Message) {
    const req = JSON.parse(message.Body);
    console.log('[SQS-detail] req : ', req);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        collections: {
          where: {
            id: req.collectionId,
          },
        },
      },
    });
    const productDetail = await this.prismaService.productDetail.findUnique({
      where: {
        productId: req.productId,
      },
      include: {
        detailImages: true,
        options: true,
        product: true,
      },
    });

    if (productDetail) {
      // 이미 수집되었으므로 userProductDetail 에 넣거나 업데이트,
      console.log('[SQS-detail] exists productDetail : ', productDetail);

      const userProducts = await this.prismaService.userProductDetail.findMany({
        where: {
          collectionId: req.collectionId,
          productId: req.productId,
          userId: user.id,
        },
      });
      // update 처리
      if (userProducts.length > 0) {
        await this.prismaService.$transaction(async (tx) => {
          for (const userProduct of userProducts) {
            await tx.userProductDetail.update({
              where: {
                id: userProduct.id,
              },
              data: {
                status: CollectionStatus.COMPLETED,
                customImages: {
                  create: productDetail.detailImages.map((image, index) => ({
                    imageUrl: image.imageUrl,
                    order: index,
                  })),
                },
                customProductName: productDetail.product.translatedName
                  ? productDetail.product.translatedName
                  : productDetail.product.name,
                calculatedPrice: null,
                manualPrice: null,
                selectedOptionIds: productDetail.options
                  ? productDetail.options
                      .slice(0, Math.min(10, productDetail.options.length))
                      .map((option) => option.id)
                  : [],
                tags: productDetail.tags,
                categoryTemplateId: null,
                shippingTemplateId: null,
                imageTemplateId: null,
              },
            });
          }
        });
      }
      // create 처리
      else {
        await this.prismaService.userProductDetail.create({
          data: {
            userId: user.id,
            productId: productDetail.product.id,
            collectionId: req.collectionId,
            status: CollectionStatus.IN_PROGRESS,
            customImages: {
              create: productDetail.detailImages.map((image, index) => ({
                imageUrl: image.imageUrl,
                order: index,
              })),
            },
            customProductName: productDetail.product.translatedName
              ? productDetail.product.translatedName
              : productDetail.product.name,

            // TODO : 카테고리 정보 있으면 자동계산해서 넣기
            calculatedPrice: null,
            manualPrice: null,
            // 옵션정보 최대 10개까지 기본으로 넣기
            // TODO : 옵션정보 직접 변경하고자 할때있어서 데이터/모델 추가 필요
            selectedOptionIds: productDetail.options
              ? productDetail.options
                  .slice(0, Math.min(10, productDetail.options.length))
                  .map((option) => option.id)
              : [],
            // TODO : 수집상품 태그정보값
            tags: productDetail.tags,
            categoryTemplateId: null,
            shippingTemplateId: null,
            imageTemplateId: null,
          },
        });
      }
      return true;
    }

    console.log('[SQS-detail] crawling ...');

    // 수집 요청
    const response = await axios.post(this.REQ_ITEM_DETAIL, req, {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });
    // response 처리
    if (response.status === 200) {
      // TODO : 실패로그 처리
      if (response.data?.message) {
        console.log('[SQS-Detail] message  : ', response.data.message);
        return false;
      } else {
        console.log(
          '[SQS-Detail] inProgress... response.data : ',
          response.data,
        );
        const data = response.data as DetailResponseDto;
        // TODO : DB내 이미 수집된 상품인지 체크 ( 앞에서 하지만, 한번 더 처리)
        // 상품번역, 상품명 번역
        // TODO : 상품 DB에서 찾아서 중복되었는지 확인처리. 현재는 바로 update
        // TODO : 상품명 번역 처리
        // TODO : 상품 설명 번역 처리
        // TODO : 금지어나 금지수집, 중복수집 등등 중복 체크

        // 수집된 상품 ProuctDetail 생성 및 UserProductDetail 생성
        // detail은 product통해서 만들기
        // 이미 생성된경우는 업데이트처리.
        // prisma transaction 처리
        const transactionResult = await this.prismaService.$transaction(
          async (tx) => {
            const detail = await tx.product.update({
              where: {
                id: req.productId,
              },
              data: {
                details: {
                  upsert: {
                    where: {
                      productId: req.productId,
                    },
                    create: {
                      currency: response.data.display_price ?? '',
                      detailImages: {
                        createMany: {
                          data: response.data.product_images?.map((image) => ({
                            imageUrl: image,
                          })),
                        },
                      },
                      shippingFrom: data.shipping_info?.shipping_from ?? '',
                      shippingTo: data.shipping_info?.shipping_to ?? '',
                      shippingTitle: data.shipping_info?.shipping_title ?? '',
                      shippingMinDate:
                        data.shipping_info?.shipping_min_date ?? '',
                      shippingMaxDate:
                        data.shipping_info?.shipping_max_date ?? '',
                      reviewAverage: data.review_average ?? '',
                      reviewCounts: data.review_counts ?? '',

                      additionalInfo: JSON.parse(JSON.stringify(response.data)),
                      specificationInfo: data.specification_info
                        ? JSON.parse(JSON.stringify(data.specification_info))
                        : null,
                      optionPriceInfo: data.option_price_info
                        ? JSON.parse(JSON.stringify(data.option_price_info))
                        : null,
                      optionInfo: data.option_info
                        ? JSON.parse(JSON.stringify(data.option_info))
                        : null,
                      thumbnailUrl:
                        response.data.product_image?.join(',') ?? '',

                      description: data.product_detail?.join(',') ?? '',
                      ...(data.option_price_info?.length > 0
                        ? {
                            options: {
                              createMany: {
                                data: data.option_price_info!.map(
                                  (option, index) => {
                                    return {
                                      name: option.combined_option_name,
                                      price:
                                        parseFloat(option.origin_price.price) ??
                                        0,
                                      stockQuantity:
                                        typeof option.origin_price
                                          .stock_counts === 'number'
                                          ? option.origin_price.stock_counts
                                          : typeof option.origin_price
                                                .stock_counts === 'boolean'
                                            ? option.origin_price.stock_counts
                                              ? 999
                                              : 0
                                            : !isNaN(
                                                  Number(
                                                    option.origin_price
                                                      .stock_counts,
                                                  ),
                                                )
                                              ? Number(
                                                  option.origin_price
                                                    .stock_counts,
                                                )
                                              : parseInt(
                                                  option.origin_price.stock_counts.replace(
                                                    /\D/g,
                                                    '',
                                                  ),
                                                ) || 999,
                                      json: JSON.parse(JSON.stringify(option)),
                                      // Start of Selection
                                      optionImageUrl:
                                        option.option_name_list?.flatMap(
                                          (name, index) => {
                                            const key = Object.keys(
                                              data.option_info,
                                            )[index];
                                            const temp = data.option_info[
                                              key
                                            ]?.find(
                                              (info) => info.name === name,
                                            );
                                            return temp?.images || [];
                                          },
                                        ) || [],
                                    };
                                  },
                                ),
                              },
                            },
                          }
                        : {}),
                    },

                    // TODO : 혹시 모를 업데이트 처리.
                    update: {
                      currency: response.data.display_price ?? '',
                      detailImages: {
                        deleteMany: {
                          productDetailId: req.productId!,
                        },
                        createMany: {
                          data: response.data.product_images?.map((image) => ({
                            imageUrl: image,
                          })),
                        },
                      },
                      // options :
                      additionalInfo: JSON.parse(JSON.stringify(response.data)),
                      thumbnailUrl:
                        response.data.product_image?.join(',') ?? '',
                      //
                    },
                  },
                },
              },
              include: {
                details: {
                  include: {
                    detailImages: true,
                    options: true,
                  },
                },
              },
            });
            const collectOption = user.collections[0]?.collectOption;

            const userProductDetail = await tx.userProductDetail.create({
              data: {
                userId: user.id,
                productId: req.product!.id!,
                collectionId: req.collectionId,
                status: CollectionStatus.COMPLETED,
                customImages: {
                  createMany: {
                    data: detail.details.detailImages.map((image, index) => ({
                      imageUrl: image.imageUrl,
                      order: index,
                    })),
                  },
                },
                categoryTemplateId: collectOption['categoryTemplateId'] ?? null,
                imageTemplateId: collectOption['imageTemplateId'] ?? null,
                shippingTemplateId: collectOption['shippingTemplateId'] ?? null,
                customProductName: detail.translatedName ?? detail.name,
                calculatedPrice: null,
                manualPrice: null,
                selectedOptionIds: detail.details.options
                  ? detail.details.options
                      .slice(0, Math.min(10, detail.details.options.length))
                      .map((option) => option.id)
                  : [],
                tags: [],
              },
            });
            console.log('[SQS-Detail] userProductDetail : ', userProductDetail);
            return userProductDetail;
          },
          {
            // transaction option
            // @ isolationLevel : Prisma.TransactionIsolationLevel.,
            // @ timeout: 10000,
            // @ maxWait: 10000,
          },
        );
        console.log('[SQS-Detail] transactionResult : ', transactionResult);
        return transactionResult;
      }
    } else {
      console.log('[SQS-Detail] status not 200 ', req);
      // 상품자체 수집 실패 로그 처리
      await this.prismaService.productFailureLog.create({
        data: {
          productId: parseInt(req.productId),
          reason: response.data.message ?? '실패',
        },
      });
      await this.prismaService.userProductFailureLog.create({
        data: {
          userId: user.id,
          reason: response.data.message ?? '실패',
          productId: parseInt(req.productId),
        },
      });
    }
    return true;
  }

  @SqsConsumerEventHandler(
    /** name: */ 'sourcingList.fifo',
    /** eventName: */ 'processing_error',
  )
  public onProcessingError(error: Error, message: Message) {
    // report errors here
    console.log('onProcessingError : ', error, message);
  }

  @SqsConsumerEventHandler(
    /** name: */ 'sourcingDetail.fifo',
    /** eventName: */ 'processing_error',
  )
  public onProcessingErrorDetail(error: Error, message: Message) {
    // report errors here
    console.log('onProcessingErrorDetail : ', error, message);
  }
}
