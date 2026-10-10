
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    OrderStatus,
    PaymentProvider,
    PaymentStatus,
    Prisma,
} from '@prisma/client';

import { PrismaService } from '../database/prisma.service';
import { PaymentCompletedDto } from './dto/payment-completed.dto';
import { CreatePendingOrderDto } from './dto/create-pending-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createPendingOrder(
        input: CreatePendingOrderDto,
    ) {
        if (!input.items.length) {
            throw new BadRequestException(
                'Order must contain at least one item',
            );
        }

        if (
            !Number.isFinite(input.totalAmount) ||
            input.totalAmount <= 0
        ) {
            throw new BadRequestException(
                'Order total must be greater than zero',
            );
        }

        const tenant = await this.prisma.tenant.findUnique({
            where: {
                id: input.tenantId,
            },
        });

        if (!tenant) {
            throw new NotFoundException(
                `Tenant ${input.tenantId} not found`,
            );
        }

        const orderReference = `ORD-${Date.now()}`;

        const result = await this.prisma.$transaction(
            async (tx) => {
                let customer = await tx.customer.findFirst({
                    where: {
                        tenantId: input.tenantId,
                        phone: input.phoneNumber,
                    },
                });

                if (!customer) {
                    customer = await tx.customer.create({
                        data: {
                            tenantId: input.tenantId,
                            name: input.customerName,
                            phone: input.phoneNumber,
                            address: input.deliveryAddress,
                        },
                    });
                } else {
                    customer = await tx.customer.update({
                        where: {
                            id: customer.id,
                        },
                        data: {
                            name: input.customerName,
                            address: input.deliveryAddress,
                        },
                    });
                }

                const order = await tx.order.create({
                    data: {
                        tenantId: input.tenantId,
                        reference: orderReference,
                        customerId: customer.id,

                        status: OrderStatus.PENDING_PAYMENT,
                        paymentStatus: PaymentStatus.PENDING,

                        subtotal: new Prisma.Decimal(
                            input.subtotal,
                        ),
                        shippingFee: new Prisma.Decimal(
                            input.shippingFee,
                        ),
                        totalAmount: new Prisma.Decimal(
                            input.totalAmount,
                        ),

                        shippingMethod: input.shippingMethod,
                        deliveryAddress: input.deliveryAddress,

                        items: {
                            create: input.items.map((item) => ({
                                productId: item.productId,
                                productName: item.productName,
                                sku: item.sku,
                                quantity: item.quantity,
                                unitPrice: new Prisma.Decimal(
                                    item.unitPrice,
                                ),
                                totalPrice: new Prisma.Decimal(
                                    item.totalPrice,
                                ),
                            })),
                        },
                    },
                });

                const payment = await tx.payment.create({
                    data: {
                        tenantId: input.tenantId,
                        orderId: order.id,

                        provider: input.provider,
                        status: PaymentStatus.PENDING,

                        amount: new Prisma.Decimal(
                            input.totalAmount,
                        ),
                        currency: 'ZAR',

                        transactionReference:
                            input.transactionReference,
                        customerName: input.customerName,
                    },
                });

                return {
                    order,
                    payment,
                };
            },
        );

        return {
            status: 'pending',
            orderId: result.order.id,
            orderReference: result.order.reference,
            paymentId: result.payment.id,
            transactionReference:
                result.payment.transactionReference,
            amount: result.payment.amount.toString(),
            currency: result.payment.currency,
        };
    }

    async handlePaymentCompleted(
        event: PaymentCompletedDto,
    ) {
        if (
            !event.tenantId ||
            !event.transactionReference
        ) {
            throw new BadRequestException(
                'Tenant ID and transaction reference are required',
            );
        }

        if (
            event.provider !== PaymentProvider.OZOW
        ) {
            throw new BadRequestException(
                'Only Ozow completion events are accepted by this handler',
            );
        }

        if (
            !Number.isFinite(event.amount) ||
            event.amount <= 0
        ) {
            throw new BadRequestException(
                'Payment amount must be a positive number',
            );
        }

        if (
            !event.currency ||
            !/^[A-Z]{3}$/.test(event.currency)
        ) {
            throw new BadRequestException(
                'Payment currency is invalid',
            );
        }

        const payment = await this.prisma.payment.findFirst({
            where: {
                tenantId: event.tenantId,
                transactionReference:
                    event.transactionReference,
            },
        });

        if (!payment) {
            throw new NotFoundException(
                `Payment not found for transaction ${event.transactionReference}`,
            );
        }

        /*
         * Validate the event against the payment created
         * during checkout before changing any database state.
         */

        if (
            payment.provider !== PaymentProvider.OZOW
        ) {
            throw new BadRequestException(
                'Payment provider does not match the Ozow completion event',
            );
        }

        if (
            event.currency !== payment.currency
        ) {
            throw new BadRequestException(
                'Payment currency does not match the stored payment',
            );
        }

        /*
         * Compare money in integer cents to avoid relying on
         * floating-point equality.
         */

        const eventAmountCents =
            Math.round(event.amount * 100);

        const storedAmountCents =
            Math.round(Number(payment.amount) * 100);

        if (
            !Number.isSafeInteger(eventAmountCents) ||
            !Number.isSafeInteger(storedAmountCents) ||
            eventAmountCents <= 0 ||
            eventAmountCents !== storedAmountCents
        ) {
            throw new BadRequestException(
                'Payment amount does not match the stored payment',
            );
        }

        /*
         * Idempotency:
         * Repeated completion events must not process an
         * already completed payment again.
         */

        if (
            payment.status === PaymentStatus.COMPLETED
        ) {
            return {
                status: 'already_processed',
                paymentId: payment.id,
                orderId: payment.orderId,
            };
        }

        if (
            payment.status !== PaymentStatus.PENDING
        ) {
            throw new BadRequestException(
                `Cannot complete a payment with status ${payment.status}`,
            );
        }

        if (!payment.orderId) {
            throw new BadRequestException(
                `Payment ${payment.id} is not linked to an order`,
            );
        }

        const result = await this.prisma.$transaction(
            async (tx) => {
                /*
                 * Use a conditional update so a payment that
                 * is no longer pending cannot be completed by
                 * this transaction.
                 */

                const paymentUpdate =
                    await tx.payment.updateMany({
                        where: {
                            id: payment.id,
                            status: PaymentStatus.PENDING,
                        },
                        data: {
                            status: PaymentStatus.COMPLETED,
                            providerReference:
                                event.providerReference ??
                                payment.providerReference,
                            completedAt: new Date(),
                        },
                    });

                if (paymentUpdate.count !== 1) {
                    throw new BadRequestException(
                        'Payment is no longer pending',
                    );
                }

                const updatedOrder =
                    await tx.order.update({
                        where: {
                            id: payment.orderId!,
                        },
                        data: {
                            paymentStatus:
                                PaymentStatus.COMPLETED,
                            status: OrderStatus.PAID,
                        },
                    });

                return {
                    order: updatedOrder,
                };
            },
        );

        return {
            status: 'processed',
            paymentId: payment.id,
            orderId: result.order.id,
        };
    }
}