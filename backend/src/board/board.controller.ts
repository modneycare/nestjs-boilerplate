import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@Controller('board')
@ApiTags('게시판')
@UseGuards(JwtAuthGuard)
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Get('list')
    async findAll() {
        return this.boardService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.boardService.findOne(id);
    }
}
