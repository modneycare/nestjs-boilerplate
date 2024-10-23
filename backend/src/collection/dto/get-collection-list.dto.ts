import { ApiProperty } from "@nestjs/swagger";

export class RequestCollectionListDto { 
  @ApiProperty()
  start_date: string;
  @ApiProperty()
  end_date: string;
}