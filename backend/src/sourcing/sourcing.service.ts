import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ReqDetailDto, ReqListDto, RequestDetailDto } from './dto/req-list-dto';
import { catchError, map } from 'rxjs';
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from '@ssut/nestjs-sqs';
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
    private readonly sqsService: SqsService ,
    private readonly configService: ConfigService,
  ) {}
  // private BASE_URL = 'https://api.sellian.kr/';
  private BASE_URL = 'http://127.0.0.1:3031/';
  private REQ_ITEM_LIST = this.BASE_URL + 'api/crawl/product_list';
  private REQ_ITEM_DETAIL = this.BASE_URL + 'api/crawl/product_detail';
  private REQ_ITEM_LIST_SQS = this.configService.get('aws.sqs.urls.listQueue');
  private REQ_ITEM_DETAIL_SQS = this.configService.get('aws.sqs.urls.detailQueue');
  private REQ_ITEM_UPLOAD_SQS = process.env.SQS_QUEUE_UPLOAD_URL;
  private REQ_ITEM_UPDATE_SQS = process.env.SQS_QUEUE_UPDATE_URL;
  private REQ_ITEM_DELETE_SQS = process.env.SQS_QUEUE_DELETE_URL;

  async getRequestList(userId: string): Promise<any> {

    return await this.prisma.collection.findMany({
      where: {
        userId: userId,
      },
      orderBy : { 
        createdAt : 'desc'
      }, 
      include : { 
        products : { 
          select : { 
            product : { 
              select : { 
                id : true, 
                url : true, 
                thumbnailUrl : true, 
                name : true, 
                displayPrice : true, 
                originalPrice : true, 
                discountedPrice : true, 
              }
            }
          }
        }
      }
    });
  }

  async requestList(req: ReqListDto): Promise<any> {
    const limitCount = req.option.limitCount;
    const minPage = req.page_scope.start_page
    const maxPage = req.page_scope.end_page;
    let cnt = 0;
    console.log('requestList req : ', req.userId);
    
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.userId!,
      },
      select : { 
        id : true, 
        name : true,
      }
    });

    if ( !minPage && !maxPage && !limitCount) {
      throw new Error('Invalid request');
    }
    
    const crawl = await this.prisma.collection.create({
      data : { 
        userId : req.userId!,
        status : CollectionStatus.PENDING,
        progress : 0,
        name : req.crawler_name,
        site : req.target,
        siteName : req.target,
        collectOption : req.option ? JSON.parse(JSON.stringify(req.option)) : null,
        // TODO : 소싱사이트 아이디 연결 
        
      }
    })
    if (!crawl) {
      throw new Error('Failed to create collection');
    }
    const now = Date.now();
    return await this.sqsService.send('requestQueue.fifo', {
      id : crawl.id.toString()+'-list',
      body: {...req,  user : user, crawlType : 'list', crawlId : crawl.id},
      groupId: user.id + '-list',
      deduplicationId: crawl.id.toString()+'-list',
      delaySeconds: 0,
      messageAttributes: {
        crawlType : { 
          DataType : 'String',
          StringValue : 'list'
        }
      },
    }).catch((err) => {
      console.log('err : ', err);
      throw new Error('Failed to send message');
    })
    
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
      select : { 
        id : true, 
        name : true,
      }
    });
    const list = await this.prisma.collection.findUnique({
      where : { 
        id : parseInt(req.crawlId),
      }, 
      select : { 
        site : true, 
        siteName : true, 
        name : true, 
        collectOption : true,
        sourcingSiteId : true, 
        products : { 
          select : { 
            product : true
          }
        }
      }
    });
    const products = list?.products.map((product) => product.product);

    products.forEach(async (product) => { 
      // sqs 요청 
      console.log('product : ', product);
      const reqData : ReqDetailDto = {
        userId : user.id,
        cralwer_name : "",
        target : list.site,
        request_url : product.url,
        proxy_mode : true, 
        type : list.siteName, 
        option : list.collectOption,
        
      }
      await this.sqsService.send(this.configService.get('aws.sqs.queueNames.detailQueue'), {
        body: {...reqData,  user : user, crawlType : 'detail', product : product},
        id: req.userId + product.id.toString()+'-detail',
        groupId: user.id + '-detail',
        deduplicationId: req.userId + product.id.toString()+'-detail',
        delaySeconds: 0,
      })
    })
    return await this.prisma.collection.update({
      where : { 
        id : parseInt(req.crawlId),
      }, 
      data : { 
        status : CollectionStatus.IN_PROGRESS,
      }
    })
  
  }
}
