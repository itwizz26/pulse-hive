import {
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function createTenantSlug(name: string): string {
    return name
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function createTenantPrefix(name: string): string {
    const words =
        name
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .match(/[A-Z0-9]+/g) ?? [];

    const firstWord = words[0];
    const secondWord = words[1];

    if (!firstWord) {
        throw new ConflictException(
            'The business name cannot produce a valid tenant code',
        );
    }

    // Glowa Vee Boutique -> GLV
    const prefix =
        words.length > 1 && secondWord
        ? `${firstWord.slice(0, 2)}${secondWord.charAt(0)}`
        : firstWord.slice(0, 3);

    if (!/^[A-Z]{3}$/.test(prefix)) {
        throw new ConflictException(
            'The business name must produce a three-letter tenant prefix',
        );
    }

    return prefix;
}

export async function allocateTenantCode(
    tx: Prisma.TransactionClient,
    name: string,
): Promise<string> {
    const prefix = createTenantPrefix(name);

    const rows = await tx.$queryRaw<Array<{ value: bigint }>>`
        SELECT nextval('"TenantCodeNumber_seq"') AS value
    `;

    const sequenceNumber = Number(rows[0]?.value);

    if (
        !Number.isSafeInteger(sequenceNumber) ||
        sequenceNumber < 0 ||
        sequenceNumber > 999999
    ) {
        throw new ConflictException(
            'The tenant-code sequence is exhausted',
        );
    }

    return `${prefix}-${String(sequenceNumber).padStart(6, '0')}`;
}