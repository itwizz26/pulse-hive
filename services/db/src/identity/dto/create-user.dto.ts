import {
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
} from 'class-validator';

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export class CreateUserDto {
    @IsEmail()
    @MaxLength(254)
    email!: string;

    // The internal DB API accepts bcrypt hashes, never plaintext passwords.
    @IsString()
    @Matches(BCRYPT_HASH_PATTERN, {
        message: 'Password must be a valid bcrypt hash',
    })
    password!: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    displayName?: string;
}
