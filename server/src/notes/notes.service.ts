import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpsertNoteDto } from './dto/upsert-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async upsert(userId: string, tripId: string, dto: UpsertNoteDto) {
    await this.assertTripOwnership(userId, tripId);

    return this.prisma.note.upsert({
      where: { tripId },
      update: { content: dto.content },
      create: { tripId, content: dto.content },
    });
  }

  async findForTrip(userId: string, tripId: string) {
    await this.assertTripOwnership(userId, tripId);

    const note = await this.prisma.note.findUnique({ where: { tripId } });
    return note ?? { content: '' };
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
