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
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';
import { ReqListDto } from '@/sourcing/dto/req-list-dto';
import { map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { catchError } from 'rxjs';
import { PrismaService } from '@/prisma/prisma.service';
import { TranslationService } from '@/translation/translation.service';
@Injectable()
export class SsqsService {
  private readonly logger = new Logger(SsqsService.name);
  private BASE_URL = 'http://127.0.0.1:3031/';
  private REQ_ITEM_LIST = this.BASE_URL + 'api/crawl/product_list';
  private REQ_ITEM_DETAIL = this.BASE_URL + 'api/crawl/product_detail';
  

  constructor(
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly translationService : TranslationService  ,
  ) {
  }

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
    console.log( 'sqs msg : ', message);
    // crawling 요청 api split
    // limitCount와 minPage, maxPage 값을 이용해서 진행하기 
    const req = JSON.parse(message.Body);
    const crawlId = req.crawlId;
    const user = req.user;

    if ( req.option.limitCount && req.option.limitCount > 0) {
      // limitCount로 수집요청한 경우 
      let i = 0; 
      let limit = Math.floor(req.option.limitCount/50); // 한페이지에 약 50개를 수집하는 것으로 가정 
      for (let i = 1; i <= limit+1; i++) {
        const req_body = {...req, page_scope : {
          start_page : i,
          end_page : i
        }}

        console.log('req_body : ', req_body);
        // forward to sqs 
        const sresult = await this.sqsService.send(this.configService.get('aws.sqs.queueNames.listQueue'), {
          id : crawlId.toString()+'-'+i,
          body: req_body,
          groupId: user.id + '-' + crawlId,
          deduplicationId: crawlId.toString()+'-'+i,
          delaySeconds: 0,
          messageAttributes: {
          },
        })
      }
      return true; 
    }

    // start_page, end_page로 수집요청한 경우 
    if ( req.page_scope.start_page && req.page_scope.end_page) {  
      for (let i = req.page_scope.start_page; i <= req.page_scope.end_page; i++) {
        const req_body = {...req, page_scope : {
          start_page : i,
          end_page : i
        }}
        // forward to sqs 
        const sresult = await this.sqsService.send(this.configService.get('aws.sqs.queueNames.listQueue'), {
          id : crawlId.toString()+'-'+i,
          body: req_body,
          groupId: user.id + '-' + crawlId,
          deduplicationId: crawlId.toString()+'-'+i,
          delaySeconds: 0,
          messageAttributes: {
          },
        })
      }
      
      return true; 
    }

  }

  // crawling list 요청처리 
  @SqsMessageHandler(/** name: */ 'sourcingList.fifo', /** batch: */ false)
  async requestCrawling(message : Message) {
    const req = JSON.parse(message.Body);
    console.log('list req : ', req);
    if ( req.crawlType === 'list') {
      const response = await axios.post(this.REQ_ITEM_LIST, req , {
        headers : {
          'Content-Type' : 'application/json',
          'Accept' : '*/*',
          'Accept-Encoding' : 'gzip, deflate, br',
        }
      })
      .then((response) => {
        console.log('Response received:', response.data?.message);
        if ( response.data?.message) {
          console.log('list req : ', req);
        }
        return response.data;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error('Error occurred while processing the request:', error);
        } else {
          console.error('Unexpected error:', error?.response?.data);
        }
        // throw error;
      });
      console.log('list results : ', response);
      if ( response?.length && response.length > 0) {
        // prisma data insert 
        // TODO : 성인상품여부, 광고상품여부, 표시가격에서 가격 추출 
        const results = []; 
        response.forEach(async (element) => {
          const displayPrice = element.product_price ?? ''; 
          const translatedName = await this.translationService.translateProductNameGpt(element.product_name);
          // 표시가격은 '' 또는 '$200' 형태로 존재함 , 통화표시 제외하고 숫자만 추출 
          const price = displayPrice.replace('$', ''); 
          console.log('element : ', element);

          const result = await this.prismaService.product.upsert({
            where : {
              productId : element.product_id,
            },
            create : {
              productId : element.product_id,
              url : element.product_url, 
              thumbnailUrl : element.product_image ?? '', 
              name : translatedName ?? element.product_name, 
              displayPrice : displayPrice, 
              originalPrice : parseFloat(price) ?? 0, 
              discountedPrice : parseFloat(price) ?? 0, 

            },
            update : { 
              url : element.product_url, 
              thumbnailUrl : element.product_image ?? '', 
              name : translatedName ?? element.product_name, 
              displayPrice : displayPrice,
              originalPrice : parseFloat(price) ?? 0, 
              discountedPrice : parseFloat(price) ?? 0, 
            }
          })
          results.push(result);
          // product Collection 연결 
          console.log('product upsert result : ', result);
          await this.prismaService.productCollection.create({
            data : {
              productId : result.id,
              collectionId : req.crawlId,
            }
          })
        });  
      }
      return true;
    }
    else {
      console.log("unknown crawlType : ", req.crawlType);
      return true; 
    }
    
  }

  // crawling detail 요청처리 
  @SqsMessageHandler(/** name: */ 'sourcingDetail.fifo', /** batch: */ false)
  async requestCrawlingDetail(message : Message) {
    const req = JSON.parse(message.Body);
    const response = await axios.post(this.REQ_ITEM_DETAIL, req , {
      headers : {
        'Content-Type' : 'application/json',
        'Accept' : '*/*',
        'Accept-Encoding' : 'gzip, deflate, br',
      }
    })
    // response 처리 
    if ( response.status === 200) {
      if ( response.data?.message) {
        console.log('detail req : ', req);
      }
      else { 
        
        // 상품번역, 상품명 번역
        // TODO : 상품 DB에서 찾아서 중복되었는지 확인처리. 현재는 바로 update 
        // TODO : 상품명 번역 처리 
        // TODO : 상품 설명 번역 처리 
        // TODO : 금지어나 금지수집, 중복수집 등등 중복 체크 

        // 상품명 업데이트 


        const detail = this.prismaService.product.update({
          where : { 
            id : req.product!.id!, 
          },
          data : { 
             details : { 
              upsert : { 
                where : { 
                  productId : req.product!.id!, 
                },
                create : { 
                  currency : response.data.display_price ?? "", 
                  detailImages : { 
                    createMany : { 
                      data : response.data.product_images?.map((image) => ({
                        imageUrl : image, 
                      }))
                    }
                  }, 
                  // options : 
                  additionalInfo : JSON.parse(JSON.stringify(response.data)), 
                  thumbnailUrl : response.data.product_image?.join(',') ?? '', 
                },
                update : { 
                  currency : response.data.display_price ?? "", 
                  detailImages : { 
                    deleteMany : {
                      productDetailId : req.product!.id!, 
                    }, 
                    createMany : { 
                      data : response.data.product_images?.map((image) => ({
                        imageUrl : image, 
                      }))
                    }
                  }, 
                  // options : 
                  additionalInfo : JSON.parse(JSON.stringify(response.data)), 
                  thumbnailUrl : response.data.product_image?.join(',') ?? ''
                  //
                }
              }
             }
          }
        })
        console.log('scraping productDetail : ', detail);
      }

    }
    console.log('detail req : ', req);
    return true; 
  }

  @SqsConsumerEventHandler(/** name: */ 'sourcingList.fifo', /** eventName: */ 'processing_error')
  public onProcessingError(error: Error, message: Message) {
    // report errors here
    console.log('onProcessingError : ', error, message);
  }


  
}
