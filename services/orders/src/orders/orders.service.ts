import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaymentStatus } from '@prisma/client';

import { PrismaService } from '../database/prisma.service';
import { PaymentCompletedDto } from './dto/payment-completed.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

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
                    status: 'PAID',
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