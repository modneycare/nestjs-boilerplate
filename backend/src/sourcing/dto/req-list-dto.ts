import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  translate?: string | null;
  
}
export class PageScopeDto {
  @ApiProperty()
  start_page: number;
  @ApiProperty()
  end_page: number;
}
export class ReqListDto {
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
  proxy_mode?: string | null;

  @ApiProperty()
  page_scope?: PageScopeDto | null;

  @ApiProperty()
  option?: ReqOptionDto | null;
}

export class RequestDetailDto {
  @ApiProperty()
  crawlId: string;
  @ApiProperty()
  userId?: string | null;

}
export class ReqDetailDto {
  @ApiProperty()
  userId?: string | null;

  @ApiProperty()
  cralwer_name: string;

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
