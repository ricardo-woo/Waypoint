import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../auth/jwt.guard';
import { NotesService } from './notes.service';
import { UpsertNoteDto } from './dto/upsert-note.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string };
}

@Controller('notes')
@UseGuards(JwtGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('trip/:tripId')
  findForTrip(
    @Req() req: AuthenticatedRequest,
    @Param('tripId') tripId: string,
  ) {
    return this.notesService.findForTrip(req.user.id, tripId);
  }

  @Put('trip/:tripId')
  upsert(
    @Req() req: AuthenticatedRequest,
    @Param('tripId') tripId: string,
    @Body() dto: UpsertNoteDto,
  ) {
    return this.notesService.upsert(req.user.id, tripId, dto);
  }
}
