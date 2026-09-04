import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { EventsService, DomainEvent } from './events.service';
import { PublishEventDto } from './dto/publish-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('publish')
  @HttpCode(HttpStatus.ACCEPTED)
  async publish(@Body() dto: PublishEventDto) {
    const event: DomainEvent = {
      eventId: dto.eventId || randomUUID(),
      eventType: dto.eventType,
      version: dto.version ?? 1,
      occurredAt: dto.occurredAt ?? new Date().toISOString(),
      data: dto.data,
    };

    await this.eventsService.publish(event);

    return {
      accepted: true,
      eventId: event.eventId,
      eventType: event.eventType,
    };
  }
}