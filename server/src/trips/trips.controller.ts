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
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('trips')
@UseGuards(JwtGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTripDto) {
    return this.tripsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.tripsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tripsService.findOne(req.user.id, id);
  }
  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tripsService.remove(req.user.id, id);
  }
}
