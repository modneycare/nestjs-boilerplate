import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ReqListDto } from './dto/req-list-dto';
import { catchError, map } from 'rxjs';

@Injectable()
export class SourcingService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}
  private BASE_URL = 'http://43.200.211.198:3031/';
  private REQ_ITEM_LIST = this.BASE_URL + 'api/crawl/product_list';
  private REQ_ITEM_DETAIL = this.BASE_URL + 'api/crawl/product_detail';

  async requestList(req: ReqListDto): Promise<any> {
    console.log('reqdto : ', req);

    const result = await this.httpService
      .post(this.REQ_ITEM_LIST, req)
      .pipe(map((res) => res.data.error ?? res.data))
      .pipe(
        catchError((error) => {
          console.log('err:', error);
          throw new Error(error);
        }),
      );
    console.log('result : ', result);
    return {
      data: result,
    };

    // SQS => LIST 요청
    // userID : 누가 요청했는지
    // url : 어떤 수집URL 요청인지
    // sourcingName : 상품 소싱명
    // pageMin , pageMax
    // isAdult
    // 중복상품수집
    // 번역

    // 리스트인경우에 페이지가 많으면, for문으로 1페이지씩
    // 1페이지 요청 끝나면 insert into SQS
    // return success
  }
  async requestDetail(): Promise<any> {
    // SQS에서 여기로 람다로 요청
    // 수집 api call
    // 상품상세페이지 정보 db insert
  }
}
