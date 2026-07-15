import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { PrismaModule } from '../database/prisma.module';
import { ImagesModule } from '../images/images/images.module';

@Module({
  imports: [PrismaModule, ImagesModule],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
