import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ReqDetailDto, ReqListDto, RequestDetailDto } from './dto/req-list-dto';
import { catchError, map } from 'rxjs';
import {
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsService,
} from '@ssut/nestjs-sqs';
import { waitForObjectExists } from '@aws-sdk/client-s3';
import { CollectionStatus } from '@prisma/client';
import { Message } from 'aws-sdk/clients/sqs';
import axios from 'axios';

@Injectable()
export class SourcingService {
  private readonly logger = new Logger(SourcingService.name);
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
  ) {}
  // private BASE_URL = 'https://api.sellian.kr/';
  private BASE_URL = 'http://127.0.0.1:3031/';
  private REQ_ITEM_LIST = this.BASE_URL + 'api/crawl/product_list';
  private REQ_ITEM_DETAIL = this.BASE_URL + 'api/crawl/product_detail';
  private REQ_ITEM_LIST_SQS = this.configService.get('aws.sqs.urls.listQueue');
  private REQ_ITEM_DETAIL_SQS = this.configService.get(
    'aws.sqs.urls.detailQueue',
  );
  private REQ_ITEM_UPLOAD_SQS = process.env.SQS_QUEUE_UPLOAD_URL;
  private REQ_ITEM_UPDATE_SQS = process.env.SQS_QUEUE_UPDATE_URL;
  private REQ_ITEM_DELETE_SQS = process.env.SQS_QUEUE_DELETE_URL;

  async getRequestList(userId: string): Promise<any> {
    return await this.prisma.collection.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        products: {
          select: {
            product: {
              select: {
                id: true,
                url: true,
                thumbnailUrl: true,
                name: true,
                displayPrice: true,
                originalPrice: true,
                discountedPrice: true,
              },
            },
          },
        },
        sourcingSite: true,
      },
    });
  }

  async requestList(req: ReqListDto): Promise<any> {
    const limitCount = req.option.limitCount;
    const minPage = req.page_scope.start_page;
    const maxPage = req.page_scope.end_page;
    let cnt = 0;
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.userId!,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!minPage && !maxPage && !limitCount) {
      throw new Error('Invalid request');
    }

    const crawl = await this.prisma.collection.create({
      data: {
        userId: req.userId!,
        status: CollectionStatus.PENDING,
        progress: 0,
        name: req.crawler_name,
        site: req.target,
        siteName: req.target,
        collectOption: req.option
          ? JSON.parse(JSON.stringify(req.option))
          : null,
        sourcingSiteId: req.sourcingSiteId!,
      },
    });
    if (!crawl) {
      throw new Error('Failed to create collection');
    }
    const now = Date.now();
    return await this.sqsService
      .send('requestQueue.fifo', {
        id: crawl.id.toString() + '-list',
        body: { ...req, user: user, crawlType: 'list', crawlId: crawl.id },
        groupId: user.id + '-list',
        deduplicationId: crawl.id.toString() + '-list',
        delaySeconds: 0,
        messageAttributes: {
          crawlType: {
            DataType: 'String',
            StringValue: 'list',
          },
        },
      })
      .catch((err) => {
        console.log('err : ', err);
        throw new Error('Failed to send message');
      });
  }
  async requestDetail(req: RequestDetailDto): Promise<any> {
    // Params
    // target 사이트 , type
    // 상세페이지 url
    // userId
    // sourcing 명
    // 번역옵션(어디로할지)
    // 마진템플릿,카테고리템플릿,태그템플릿,금지어템플릿 아이디값을 가져오기
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.userId!,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const collection = await this.prisma.collection.findUnique({
      where: {
        id: +req.collectionId,
      },
      include: {
        sourcingSite: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (req.productId && req.productId.length > 0) {
      // 상품 개별 수집 요청
      let response_results = [];
      for (const productId of req.productId) {
        const product = await this.prisma.product.findUnique({
          where: {
            id: +productId,
            details: {
              isNot: null,
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
        if (product.details?.id) {
          // 상품 detail 정보를 userProductDetail 테이블에 삽입
          await this.prisma
            .$transaction(async (tx) => {
              await tx.userProductDetail.create({
                data: {
                  userId: user.id,
                  productId: product.details.id,
                  collectionId: collection.id,
                  status: CollectionStatus.IN_PROGRESS,
                  customImages: {
                    create: product.details.detailImages.map(
                      (image, index) => ({
                        imageUrl: image.imageUrl,
                        order: index,
                      }),
                    ),
                  },
                  customProductName: product.translatedName
                    ? product.translatedName
                    : product.name,

                  // TODO : 카테고리 정보 있으면 자동계산해서 넣기
                  calculatedPrice: null,
                  manualPrice: null,
                  // 옵션정보 최대 10개까지 기본으로 넣기
                  // TODO : 옵션정보 직접 변경하고자 할때있어서 데이터/모델 추가 필요
                  selectedOptionIds: product.details.options
                    ? product.details.options
                        .slice(0, Math.min(10, product.details.options.length))
                        .map((option) => option.id)
                    : [],
                  // TODO : 수집상품 태그정보값
                  tags: product.details.tags,
                  categoryTemplateId: null,
                  shippingTemplateId: null,
                  imageTemplateId: null,
                },
              }),
                {};
            })
            .then(() => {})
            .catch((err) => {
              console.log('err : ', err);
              throw new Error('1. Failed to create userProductDetail');
            });
        } else {
          // 상품정보 없는경우 SQS로 보내서 데이터 수집 요청
          const body: ReqDetailDto = {
            crawler_name: collection.name,
            target: collection.sourcingSite!.target,
            type: collection.sourcingSite!.type,
            request_url: product.url,
            proxy_mode: true,
            option: collection.collectOption,
          };
          const result = await this.sqsService.send(
            this.configService.get('aws.sqs.queueNames.detailQueue'),
            {
              body: {
                ...body,
                user: user,
                crawlType: 'detail',
                productId: product.id,
                collectionId: collection.id,
              },
              id: req.userId + product.id.toString() + '-detail',
              groupId: user.id + '-detail',
              deduplicationId: req.userId + product.id.toString() + '-detail',
              delaySeconds: 0,
            },
          );

          response_results.push({
            productId: product.id,
            status: CollectionStatus.IN_PROGRESS,
          });
        }
      }
      return await this.prisma.collection.update({
        where: {
          id: collection.id,
        },
        data: {
          status:
            response_results.length > 0
              ? CollectionStatus.IN_PROGRESS
              : CollectionStatus.COMPLETED,
        },
      });
    } else {
      // 전체 수집 요청
      const products = collection?.products.map((product) => product.product);

      products.forEach(async (product) => {
        // sqs 요청
        console.log('[requestDetail] product : ', product);
        const reqData: ReqDetailDto = {
          userId: user.id,
          crawler_name: collection.name,
          target: collection.sourcingSite!.target,
          request_url: product.url,
          proxy_mode: true,
          type: collection.sourcingSite!.type,
          option: collection.collectOption,
        };
        await this.sqsService.send(
          this.configService.get('aws.sqs.queueNames.detailQueue'),
          {
            body: {
              ...reqData,
              user: user,
              crawlType: 'detail',
              productId: product.id,
              collectionId: collection.id,
            },
            id: req.userId + product.id.toString() + '-detail',
            groupId: user.id + '-detail',
            deduplicationId: req.userId + product.id.toString() + '-detail',
            delaySeconds: 0,
          },
        );
      });

      return await this.prisma.collection.update({
        where: {
          id: collection.id,
        },
        data: {
          status: CollectionStatus.IN_PROGRESS,
        },
      });
    }
  }
}
