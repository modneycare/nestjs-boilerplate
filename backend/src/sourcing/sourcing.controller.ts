import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SourcingService } from './sourcing.service';
import { ReqListDto, RequestDetailDto } from './dto/req-list-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('sourcing')
@ApiTags('sourcing')
@ApiBearerAuth()
export class SourcingController {
  constructor(private readonly sourcingService: SourcingService) {}

  @Post('request-list')
  @UseGuards(JwtAuthGuard)
  async RequestList(@Request() req, @Body() reqListDto: ReqListDto) {
    // make message
    reqListDto.userId = req.user?.id;
    return await this.sourcingService.requestList(reqListDto);
  }

  @Post('request-detail')
  @UseGuards(JwtAuthGuard)
  async RequestDetail(@Request() req, @Body() reqDetailDto: RequestDetailDto) {
    // make message
    reqDetailDto.userId = req.user?.id;
    return await this.sourcingService.requestDetail(reqDetailDto);
  }

  @Get('request-list')
  @UseGuards(JwtAuthGuard)
  async GetRequestList(@Request() req) {
    console.log('[GET]request-list : ', req.user?.id);
    return await this.sourcingService.getRequestList(req.user?.id);
  }
}
