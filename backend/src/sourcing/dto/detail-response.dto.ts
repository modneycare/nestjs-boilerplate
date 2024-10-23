import { ApiProperty } from '@nestjs/swagger';

class SearchInfoDto {
  @ApiProperty()
  search_keyword: string;

  @ApiProperty()
  page_number: number;

  @ApiProperty()
  page_ranking: number;

  @ApiProperty()
  search_url: string;
}

class ShippingInfoDto {
  @ApiProperty()
  shipping_title: string;

  @ApiProperty()
  shipping_min_date: string;

  @ApiProperty()
  shipping_max_date: string;

  @ApiProperty()
  shipping_from: string;

  @ApiProperty()
  shipping_to: string;
}

class DisplayPriceDto {
  @ApiProperty()
  currency: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  format: string;

  @ApiProperty()
  converted_currency?: string;

  @ApiProperty()
  converted_price?: string;

  @ApiProperty()
  converted_format?: string;

  @ApiProperty()
  stock_counts?: any;
}

class OptionPriceInfoDto {
  @ApiProperty()
  combined_option_name: string;

  @ApiProperty()
  option_name_list: string[];

  @ApiProperty()
  combined_id_name: string;

  @ApiProperty()
  option_id_list: string[];

  @ApiProperty()
  origin_price: DisplayPriceDto;

  @ApiProperty()
  sales_price: string | null;
}

class OptionInfoDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  images: string[];
}

class OptionInfoGroupDto {
  @ApiProperty({ type: [OptionInfoDto] })
  size_name: OptionInfoDto[];

  @ApiProperty({ type: [OptionInfoDto] })
  color_name: OptionInfoDto[];
}

export class DetailResponseDto {
  @ApiProperty()
  crawling_date: string;

  @ApiProperty()
  crawling_time: string;

  @ApiProperty()
  market_name: string;

  @ApiProperty({ type: SearchInfoDto })
  search_info: SearchInfoDto;

  @ApiProperty()
  product_url: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  product_name: string;

  @ApiProperty()
  review_average: string;

  @ApiProperty()
  review_counts: string;

  @ApiProperty({ type: [String] })
  product_detail: string[];

  @ApiProperty({ type: ShippingInfoDto })
  shipping_info: ShippingInfoDto;

  @ApiProperty({ type: DisplayPriceDto })
  display_price: DisplayPriceDto;

  @ApiProperty({ type: [String] })
  product_images: string[];

  @ApiProperty({ type: [String] })
  specification_info: string[];

  @ApiProperty({ type: [OptionPriceInfoDto] })
  option_price_info: OptionPriceInfoDto[];

  @ApiProperty({ type: OptionInfoGroupDto })
  option_info: OptionInfoGroupDto;
}
