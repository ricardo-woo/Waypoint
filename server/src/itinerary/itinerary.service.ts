import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ItineraryItem } from '@prisma/client';

@Injectable()
export class ItineraryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateItemDto): Promise<ItineraryItem> {
    const item = await this.prisma.itineraryItem.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.date),
        time: dto.time,
        location: dto.location,
        tripId: dto.tripId,
      },
    });

    return item;
  }

  findByTrip(tripId: string): Promise<ItineraryItem[]> {
    return this.prisma.itineraryItem.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
