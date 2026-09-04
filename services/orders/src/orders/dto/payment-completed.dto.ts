import { PaymentProvider } from '@prisma/client';

export class PaymentCompletedDto {
    tenantId?: string;
    transactionReference?: string;
    providerReference?: string;
    provider?: PaymentProvider;
    amount?: number;
    currency?: string;
}