import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    OrderStatus,
    PaymentStatus,
    Prisma,
} from '@prisma/client';

import { PrismaService } from '../database/prisma.service';
import { PaymentCompletedDto } from './dto/payment-completed.dto';
import { CreatePendingOrderDto } from './dto/create-pending-order.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    async createPendingOrder(input: CreatePendingOrderDto) {
        if (!input.items.length) {
            throw new BadRequestException('Order must contain at least one item');
        }

        if (input.totalAmount <= 0) {
            throw new BadRequestException('Order total must be greater than zero');
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

        const result = await this.prisma.$transaction(async (tx) => {
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

                subtotal: new Prisma.Decimal(input.subtotal),
                shippingFee: new Prisma.Decimal(input.shippingFee),
                totalAmount: new Prisma.Decimal(input.totalAmount),

                shippingMethod: input.shippingMethod,
                deliveryAddress: input.deliveryAddress,

                items: {
                    create: input.items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    sku: item.sku,
                    quantity: item.quantity,
                    unitPrice: new Prisma.Decimal(item.unitPrice),
                    totalPrice: new Prisma.Decimal(item.totalPrice),
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

                amount: new Prisma.Decimal(input.totalAmount),
                currency: 'ZAR',

                transactionReference: input.transactionReference,
                customerName: input.customerName,
            },
        });

        return {
                order,
                payment,
            };
        });

        return {
            status: 'pending',
            orderId: result.order.id,
            orderReference: result.order.reference,
            paymentId: result.payment.id,
            transactionReference: result.payment.transactionReference,
            amount: result.payment.amount.toString(),
            currency: result.payment.currency,
        };
    }

    async handlePaymentCompleted(event: PaymentCompletedDto) {
        const payment = await this.prisma.payment.findFirst({
            where: {
                tenantId: event.tenantId,
                transactionReference: event.transactionReference,
            },
        });

        if (!payment) {
            throw new NotFoundException(
                `Payment not found for transaction ${event.transactionReference}`,
            );
        }

        // Idempotency:
        // If Ozow sends the same completion notification again,
        // there is nothing left to do.
        if (payment.status === PaymentStatus.COMPLETED) {
            return {
                status: 'already_processed',
                paymentId: payment.id,
                orderId: payment.orderId,
            };
        }

        if (!payment.orderId) {
            throw new BadRequestException(
                `Payment ${payment.id} is not linked to an order`,
            );
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const updatedPayment = await tx.payment.update({
                where: {
                id: payment.id,
                },
                data: {
                status: PaymentStatus.COMPLETED,
                providerReference:
                    event.providerReference ?? payment.providerReference,
                completedAt: new Date(),
                },
            });

            const updatedOrder = await tx.order.update({
                where: {
                id: payment.orderId!,
                },
                data: {
                paymentStatus: PaymentStatus.COMPLETED,
                status: OrderStatus.PAID,
                },
            });

            return {
                payment: updatedPayment,
                order: updatedOrder,
            };
        });

        return {
            status: 'processed',
            paymentId: result.payment.id,
            orderId: result.order.id,
        };
    }
}
