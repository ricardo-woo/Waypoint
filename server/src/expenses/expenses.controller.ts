import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../auth/jwt.guard';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string };
}

@Controller('expenses')
@UseGuards(JwtGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(req.user.id, dto);
  }

  @Get('trip/:tripId')
  findAllForTrip(
    @Req() req: AuthenticatedRequest,
    @Param('tripId') tripId: string,
  ) {
    return this.expensesService.findAllForTrip(req.user.id, tripId);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.expensesService.remove(req.user.id, id);
  }
}
