import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    await this.assertTripOwnership(userId, dto.tripId);

    return this.prisma.expense.create({
      data: {
        label: dto.label,
        amount: dto.amount,
        tripId: dto.tripId,
      },
    });
  }

  async findAllForTrip(userId: string, tripId: string) {
    await this.assertTripOwnership(userId, tripId);

    return this.prisma.expense.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async remove(userId: string, expenseId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
      include: { trip: true },
    });

    if (!expense || expense.trip.userId !== userId) {
      throw new NotFoundException('Expense not found');
    }

    await this.prisma.expense.delete({ where: { id: expenseId } });
    return { success: true };
  }

  private async assertTripOwnership(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
  }
}
