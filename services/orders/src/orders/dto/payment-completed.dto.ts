import { PaymentProvider } from '@prisma/client';

export class PaymentCompletedDto {
    tenantId!: string;
    transactionReference!: string;
    providerReference?: string;
    provider!: PaymentProvider;
    amount!: number;
    currency!: string;

    // Ozow transaction status metadata
    ozowStatus?: string;
    subStatus?: string;
    statusMessage?: string;

    // Additional checkout/order information from Ozow
    optional1?: string;
    optional2?: string;
    optional3?: string;
    optional4?: string;
    optional5?: string;
}
