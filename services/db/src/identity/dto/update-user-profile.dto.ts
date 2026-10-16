import {
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UpdateUserProfileDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    displayName!: string;
}
