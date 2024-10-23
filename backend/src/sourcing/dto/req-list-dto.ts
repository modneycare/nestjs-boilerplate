import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ReqOptionDto {
  @ApiProperty()
  allowAdult?: boolean | null;
  @ApiProperty()
  allowAd?: boolean | null;
  @ApiProperty()
  allowOriginalPrice?: boolean | null;
  @ApiProperty()
  allowBanword?: boolean | null;
  @ApiProperty()
  allowBancode?: boolean | null;
  @ApiProperty()
  limitCount?: number | null;

  @ApiProperty()
  marginTemplateId?: string | null;

  @ApiProperty()
  categoryTemplateId?: string | null;
  @ApiProperty()
  tagTemplateId?: string | null;
  @ApiProperty()
  forbiddenWordTemplateId?: string | null;
  @ApiProperty()
  replaceWordTemplateId?: string | null;
  @ApiProperty({ default: 'google' })
  translate?: string | null;
}
export class PageScopeDto {
  @ApiProperty({ default: 1 })
  start_page: number;
  @ApiProperty({ default: 1 })
  end_page: number;
}
export class ReqListDto {
  @ApiProperty()
  userId?: string | null;

  @ApiProperty({ default: 'crawler_1' })
  crawler_name: string;

  @ApiProperty({
    default: 'amazon',
  })
  target: string;

  @ApiProperty()
  type?: string | null;

  @ApiProperty()
  search_keyword?: string | null;

  @ApiProperty({
    default:
      'https://www.amazon.com/s?k=nike+dunks+women&crid=2H9OU7VJ21SF4&sprefix=nike+d%2Caps%2C314&ref=nb_sb_ss_pltr-mrr_3_6',
  })
  request_url: string;

  @ApiProperty({
    default: 'true',
  })
  proxy_mode?: string | null;

  @ApiProperty()
  page_scope?: PageScopeDto | null;

  @ApiProperty()
  option?: ReqOptionDto | null;

  @ApiProperty()
  sourcingSiteId?: number | null;
}

/**
 * 사용자 -> 모듈  요청
 * @param collectionId : 수집그룹아이디
 * @param productId : 한건씩 개별 수집 요청하는 경우
 */
export class RequestDetailDto {
  @ApiProperty({ description: 'collection ID(수집그룹아이디)', required: true })
  collectionId: string;

  @ApiProperty({ description: '무시' })
  @ApiHideProperty()
  userId?: string | null;

  @ApiProperty({ description: '상품 id( In table id)' })
  productId: string[];
}

/**
 * 모듈 -> 크롤러 요청 데이터
 */
export class ReqDetailDto {
  @ApiProperty()
  userId?: string | null;

  @ApiProperty()
  crawler_name: string;

  @ApiProperty()
  target: string;

  @ApiProperty()
  type?: string | null;

  @ApiProperty()
  search_keyword?: string | null;

  @ApiProperty()
  request_url: string;

  @ApiProperty()
  proxy_mode?: boolean | null;

  @ApiProperty()
  page_scope?: {
    start_page: number;
    end_page: number;
  };

  @ApiProperty()
  search_info?: any;

  @ApiProperty()
  option?: ReqOptionDto | null | any;
}
