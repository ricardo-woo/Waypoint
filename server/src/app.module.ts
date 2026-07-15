import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TripsModule } from './trips/trips.module';
import { PrismaModule } from './database/prisma.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { ImagesModule } from './images/images/images.module';
import { ExpensesModule } from './expenses/expenses.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TripsModule,
    ItineraryModule,
    ImagesModule,
    ExpensesModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
