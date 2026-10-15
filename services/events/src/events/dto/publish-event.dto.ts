import {
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';

export class PublishEventDto {
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['payment.completed', 'payment.status_updated'])
  eventType!: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  version?: number;

  @IsISO8601()
  @IsOptional()
  occurredAt?: string;

  @IsObject()
  data!: Record<string, unknown>;
}
