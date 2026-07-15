import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ItineraryService } from './itinerary.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('itinerary')
export class ItineraryController {
  constructor(private service: ItineraryService) {}

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.service.create(dto);
  }

  @Get()
  find(@Query('tripId') tripId: string) {
    return this.service.findByTrip(tripId);
  }
}
