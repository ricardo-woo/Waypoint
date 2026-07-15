import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    PrismaModule,
    AuthModule,
    TripsModule,
    ItineraryModule,
    ImagesModule,
    ExpensesModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
