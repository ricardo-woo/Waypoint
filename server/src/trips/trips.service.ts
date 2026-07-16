import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { ImagesService } from '../images/images/images.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private images: ImagesService,
  ) {}

  async create(userId: string, dto: CreateTripDto) {
    const imageUrl = await this.images.searchImage(dto.location);

    return this.prisma.trip.create({
      data: {
        title: dto.title,
        location: dto.location,
        description: dto.description,
        countryCode: dto.countryCode,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        userId,
        imageUrl,
      },
    });
  }

  async update(userId: string, tripId: string, dto: UpdateTripDto) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const countryChanged =
      dto.countryCode !== undefined && dto.countryCode !== trip.countryCode;

    let imageUrl = trip.imageUrl;
    if (dto.location && dto.location !== trip.location) {
      imageUrl = await this.images.searchImage(dto.location);
    }

    const updatedTrip = await this.prisma.trip.update({
      where: { id: tripId },
      data: {
        title: dto.title ?? trip.title,
        location: dto.location ?? trip.location,
        description: dto.description ?? trip.description,
        countryCode: dto.countryCode ?? trip.countryCode,
        startDate: dto.startDate ? new Date(dto.startDate) : trip.startDate,
        endDate: dto.endDate ? new Date(dto.endDate) : trip.endDate,
        imageUrl,
      },
    });

    if (countryChanged) {
      await this.prisma.itineraryItem.deleteMany({
        where: { tripId },
      });
    }

    return { ...updatedTrip, itineraryCleared: countryChanged };
  }

  async remove(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, userId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    await this.prisma.trip.delete({ where: { id: tripId } });
    return { success: true };
  }

  async findOne(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        userId,
      },
      include: {
        _count: {
          select: { itinerary: true },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async findAll(userId: string) {
    return this.prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' },
      include: {
        _count: {
          select: { itinerary: true },
        },
      },
    });
  }
}
