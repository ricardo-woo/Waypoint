import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';

@Module({
  imports: [PrismaModule],

  controllers: [ItineraryController],

  providers: [ItineraryService],
})
export class ItineraryModule {}
