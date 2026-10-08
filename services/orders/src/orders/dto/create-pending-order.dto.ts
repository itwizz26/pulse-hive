import { PaymentProvider } from '@prisma/client';

export class CreatePendingOrderItemDto {
    productId?: string;
    productName!: string;
    sku?: string;
    quantity!: number;
    unitPrice!: number;
    totalPrice!: number;
}

export class CreatePendingOrderDto {
    tenantId!: string;

    customerName!: string;
    phoneNumber!: string;
    deliveryAddress!: string;

    shippingMethod!: string;
    shippingFee!: number;

    subtotal!: number;
    totalAmount!: number;

    transactionReference!: string;
    provider!: PaymentProvider;

    items!: CreatePendingOrderItemDto[];
}