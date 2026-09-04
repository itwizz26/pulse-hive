import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class PublishEventDto {
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @IsNumber()
  version!: number;

  @IsString()
  @IsOptional()
  occurredAt?: string;

  @IsObject()
  data!: Record<string, unknown>;
}