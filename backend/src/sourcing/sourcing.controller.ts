import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SourcingService } from './sourcing.service';
import { ReqListDto } from './dto/req-list-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('sourcing')
@ApiTags('sourcing')
@ApiBearerAuth()
export class SourcingController {
  constructor(private readonly sourcingService: SourcingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async RequestList(@Request() req, @Body() reqListDto: ReqListDto) {
    // make message
    reqListDto.userId = req.user?.id;

    this.sourcingService.requestList(reqListDto);
  }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MWRlNmVhOC1jNzNjLTQyZjEtOTg2My1hY2ZiMTgzMjJjZTQiLCJpYXQiOjE3Mjg4ODc3NDIsImV4cCI6MTczMTQ3OTc0Mn0.nfa-J01gX70m6RtR3UhRY-bhvuUv_zi16jjKYgqzdF0
