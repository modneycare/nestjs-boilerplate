import { ApiProperty } from '@nestjs/swagger';

export class ReqOptionDto {
  @ApiProperty()
  isAdult?: boolean | null;
  @ApiProperty()
  isAd?: boolean | null;
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
  proxy_mode?: string | null;

  @ApiProperty()
  page_scope?: PageScopeDto | null;

  @ApiProperty()
  option?: ReqOptionDto | null;
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
  proxy_mode?: string | null;

  @ApiProperty()
  page_scope?: {
    start_page: number;
    end_page: number;
  };

  @ApiProperty()
  search_info?: any;

  @ApiProperty()
  option?: ReqOptionDto | null;
}
