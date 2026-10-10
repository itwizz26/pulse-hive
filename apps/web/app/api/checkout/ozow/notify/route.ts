
import { createHash, timingSafeEqual } from 'crypto';

import {
    NextRequest,
    NextResponse,
} from 'next/server';

const OZOW_SITE_CODE =
    process.env.OZOW_SITE_CODE;

const OZOW_PRIVATE_KEY =
    process.env.OZOW_PRIVATE_KEY;

const OZOW_IS_TEST =
    process.env.OZOW_IS_TEST;

const DB_SERVICE_URL =
    process.env.PULSEHIVE_DB_SERVICE_URL?.replace(/\/+$/, '');

const EVENTS_SERVICE_URL =
    process.env.PULSEHIVE_EVENTS_SERVICE_URL?.replace(/\/+$/, '');

const MAX_TRANSACTION_REFERENCE_LENGTH = 50;
const MAX_OPTIONAL_FIELD_LENGTH = 50;
const MAX_STATUS_MESSAGE_LENGTH = 500;

const VALID_STATUSES = new Set([
    'Complete',
    'Cancelled',
    'Error',
    'Abandoned',
    'PendingInvestigation',
    'Pending',
]);

function getValue(
    params: URLSearchParams,
    key: string,
): string {
    return params.get(key) ?? '';
}

function isValidUuid(
    value: string,
): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value,
    );
}

function buildOzowHashInput(
    params: URLSearchParams,
    privateKey: string,
): string {
    const amount =
        getValue(params, 'Amount');

    /*
     * Ozow hashes Amount with exactly two
     * decimal places.
     */
    const normalizedAmount =
        Number(amount || 0).toFixed(2);

    return [
        getValue(params, 'SiteCode'),
        getValue(params, 'TransactionId'),
        getValue(
            params,
            'TransactionReference',
        ),
        normalizedAmount,
        getValue(params, 'Status'),
        getValue(params, 'Optional1'),
        getValue(params, 'Optional2'),
        getValue(params, 'Optional3'),
        getValue(params, 'Optional4'),
        getValue(params, 'Optional5'),
        getValue(params, 'CurrencyCode'),
        getValue(params, 'IsTest'),
        getValue(params, 'StatusMessage'),
        privateKey,
    ]
        .join('')
        .toLowerCase();
}

function calculateOzowHash(
    params: URLSearchParams,
    privateKey: string,
): string {
    const hashInput =
        buildOzowHashInput(
            params,
            privateKey,
        );

    return createHash('sha512')
        .update(hashInput)
        .digest('hex')
        .toLowerCase();
}

function verifyOzowHash(
    params: URLSearchParams,
    privateKey: string,
): boolean {
    const suppliedHash =
        getValue(params, 'Hash')
            .trim()
            .toLowerCase();

    if (!/^[0-9a-f]{128}$/.test(suppliedHash)) {
        return false;
    }

    const expectedHash =
        calculateOzowHash(
            params,
            privateKey,
        );

    const expectedBuffer =
        Buffer.from(
            expectedHash,
            'utf8',
        );

    const suppliedBuffer =
        Buffer.from(
            suppliedHash,
            'utf8',
        );

    if (
        expectedBuffer.length !==
        suppliedBuffer.length
    ) {
        return false;
    }

    return timingSafeEqual(
        expectedBuffer,
        suppliedBuffer,
    );
}

export async function POST(
    request: NextRequest,
) {
    try {
        /*
         * -------------------------------------------------------
         * Configuration
         * -------------------------------------------------------
         */

        if (!OZOW_SITE_CODE) {
            console.error(
                'OZOW_SITE_CODE is not configured',
            );

            return NextResponse.json(
                {
                    error:
                        'Ozow site code is not configured',
                },
                { status: 500 },
            );
        }

        if (!OZOW_PRIVATE_KEY) {
            console.error(
                'OZOW_PRIVATE_KEY is not configured',
            );

            return NextResponse.json(
                {
                    error:
                        'Ozow private key is not configured',
                },
                { status: 500 },
            );
        }

        /*
         * -------------------------------------------------------
         * Read form-urlencoded body
         * -------------------------------------------------------
         */

        const body =
            await request.text();

        const params =
            new URLSearchParams(body);

        const siteCode =
            getValue(
                params,
                'SiteCode',
            );

        const transactionId =
            getValue(
                params,
                'TransactionId',
            );

        const transactionReference =
            getValue(
                params,
                'TransactionReference',
            );

        const amount =
            getValue(
                params,
                'Amount',
            );

        const status =
            getValue(
                params,
                'Status',
            );

        const optional1 =
            getValue(
                params,
                'Optional1',
            );

        const optional2 =
            getValue(
                params,
                'Optional2',
            );

        const optional3 =
            getValue(
                params,
                'Optional3',
            );

        const optional4 =
            getValue(
                params,
                'Optional4',
            );

        const optional5 =
            getValue(
                params,
                'Optional5',
            );

        const currencyCode =
            getValue(
                params,
                'CurrencyCode',
            );

        const isTest =
            getValue(
                params,
                'IsTest',
            );

        const statusMessage =
            getValue(
                params,
                'StatusMessage',
            );

        const suppliedHash =
            getValue(
                params,
                'Hash',
            );

        /*
         * -------------------------------------------------------
         * Required field validation
         * -------------------------------------------------------
         */

        if (!siteCode) {
            return NextResponse.json(
                {
                    error:
                        'Missing SiteCode',
                },
                { status: 400 },
            );
        }

        if (
            siteCode !==
            OZOW_SITE_CODE
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid SiteCode',
                },
                { status: 400 },
            );
        }

        /*
         * Ozow TransactionId is a UUID.
         */
        if (!transactionId) {
            return NextResponse.json(
                {
                    error:
                        'Missing TransactionId',
                },
                { status: 400 },
            );
        }

        if (
            !isValidUuid(
                transactionId,
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid TransactionId format',
                },
                { status: 400 },
            );
        }

        if (!transactionReference) {
            return NextResponse.json(
                {
                    error:
                        'Missing TransactionReference',
                },
                { status: 400 },
            );
        }

        if (
            transactionReference.length >
            MAX_TRANSACTION_REFERENCE_LENGTH
        ) {
            return NextResponse.json(
                {
                    error:
                        'TransactionReference exceeds maximum length of 50 characters',
                },
                { status: 400 },
            );
        }

        /*
         * Amount must be positive and have exactly
         * two decimal places.
         */
        if (!amount) {
            return NextResponse.json(
                {
                    error:
                        'Missing Amount',
                },
                { status: 400 },
            );
        }

        if (
            !/^\d+\.\d{2}$/.test(amount) ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) <= 0
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid Amount format or value',
                },
                { status: 400 },
            );
        }

        if (!currencyCode) {
            return NextResponse.json(
                {
                    error:
                        'Missing CurrencyCode',
                },
                { status: 400 },
            );
        }

        if (
            !/^[A-Z]{3}$/.test(
                currencyCode,
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid CurrencyCode',
                },
                { status: 400 },
            );
        }

        if (
            !/^(True|False)$/.test(
                isTest,
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid IsTest value',
                },
                { status: 400 },
            );
        }

        if (
            !VALID_STATUSES.has(status)
        ) {
            return NextResponse.json(
                {
                    error:
                        'Missing or invalid Status',
                },
                { status: 400 },
            );
        }

        /*
         * -------------------------------------------------------
         * Optional field limits
         * -------------------------------------------------------
         */

        const optionalFields = [
            {
                name: 'Optional1',
                value: optional1,
            },
            {
                name: 'Optional2',
                value: optional2,
            },
            {
                name: 'Optional3',
                value: optional3,
            },
            {
                name: 'Optional4',
                value: optional4,
            },
            {
                name: 'Optional5',
                value: optional5,
            },
        ];

        for (
            const field of optionalFields
        ) {
            if (
                field.value.length >
                MAX_OPTIONAL_FIELD_LENGTH
            ) {
                return NextResponse.json(
                    {
                        error:
                            `${field.name} exceeds maximum length of 50 characters`,
                    },
                    {
                        status: 400,
                    },
                );
            }
        }

        if (
            statusMessage.length >
            MAX_STATUS_MESSAGE_LENGTH
        ) {
            return NextResponse.json(
                {
                    error:
                        'StatusMessage exceeds maximum length of 500 characters',
                },
                { status: 400 },
            );
        }

        /*
         * -------------------------------------------------------
         * Hash is required.
         * -------------------------------------------------------
         */

        if (!suppliedHash) {
            return NextResponse.json(
                {
                    error:
                        'Missing Hash',
                },
                { status: 400 },
            );
        }

        /*
         * -------------------------------------------------------
         * Verify Ozow hash BEFORE processing notification.
         * -------------------------------------------------------
         */

        const hashValid =
            verifyOzowHash(
                params,
                OZOW_PRIVATE_KEY,
            );

        if (!hashValid) {
            console.error(
                'Invalid Ozow notification hash:',
                {
                    transactionId,
                    transactionReference,
                },
            );

            return NextResponse.json(
                {
                    error:
                        'Invalid notification hash',
                },
                { status: 400 },
            );
        }

        /*
         * -------------------------------------------------------
         * Test/live mode validation
         * -------------------------------------------------------
         */

        if (
            OZOW_IS_TEST &&
            isTest.toLowerCase() !==
                OZOW_IS_TEST.toLowerCase()
        ) {
            console.error(
                'Ozow IsTest mismatch:',
                {
                    expected:
                        OZOW_IS_TEST,
                    received:
                        isTest,
                },
            );

            return NextResponse.json(
                {
                    error:
                        'Invalid test mode',
                },
                { status: 400 },
            );
        }

        /*
         * -------------------------------------------------------
         * Extract tenant code from the transaction reference.
         *
         * Example:
         * GLV-001-1723456789-abcdef12
         *
         * Tenant code:
         * GLV-001
         * -------------------------------------------------------
         */

        const tenantCodeMatch =
            transactionReference.match(
                /^([A-Z]{3}-\d{3})-/,
            );

        if (!tenantCodeMatch) {
            return NextResponse.json(
                {
                    error:
                        'Invalid transaction reference: tenant code could not be determined',
                },
                { status: 400 },
            );
        }

        const tenantCode =
            tenantCodeMatch[1];

        /*
         * -------------------------------------------------------
         * Resolve the tenant's internal database ID.
         * -------------------------------------------------------
         */

        if (!DB_SERVICE_URL) {
            console.error(
                'PULSEHIVE_DB_SERVICE_URL is not configured',
            );

            return NextResponse.json(
                {
                    error:
                        'Tenant service is not configured',
                },
                { status: 503 },
            );
        }

        let tenantId: string;

        try {
            const tenantResponse = await fetch(
                `${DB_SERVICE_URL}/tenants/code/${encodeURIComponent(tenantCode)}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                    cache: 'no-store',
                },
            );

            const tenantData: unknown =
                await tenantResponse
                    .json()
                    .catch(() => null);

            if (
                !tenantResponse.ok ||
                !tenantData ||
                typeof tenantData !== 'object' ||
                !('id' in tenantData) ||
                !('tenantCode' in tenantData) ||
                typeof tenantData.id !== 'string' ||
                tenantData.tenantCode !== tenantCode
            ) {
                console.error(
                    'Ozow callback tenant lookup failed',
                    {
                        tenantCode,
                        status: tenantResponse.status,
                    },
                );

                return NextResponse.json(
                    {
                        error:
                            'Unable to resolve notification tenant',
                    },
                    { status: 502 },
                );
            }

            tenantId = tenantData.id;
        } catch (error) {
            console.error(
                'Tenant service unavailable during Ozow callback',
                error,
            );

            return NextResponse.json(
                {
                    error:
                        'Tenant service unavailable',
                },
                { status: 503 },
            );
        }

        /*
         * -------------------------------------------------------
         * Only a verified Complete notification may trigger
         * payment completion.
         *
         * Other valid statuses must not mark the order as paid.
         * -------------------------------------------------------
         */

        if (status !== 'Complete') {
            console.log(
                'Ozow notification validated; no completion event required',
                {
                    tenantCode,
                    transactionReference,
                    status,
                },
            );

            return new NextResponse(
                null,
                { status: 200 },
            );
        }

        /*
         * -------------------------------------------------------
         * Publish the payment.completed domain event.
         * -------------------------------------------------------
         */

        if (!EVENTS_SERVICE_URL) {
            console.error(
                'PULSEHIVE_EVENTS_SERVICE_URL is not configured',
            );

            return NextResponse.json(
                {
                    error:
                        'Events service is not configured',
                },
                { status: 503 },
            );
        }

        const numericAmount =
            Number(amount);

        const amountCents =
            Math.round(numericAmount * 100);

        if (
            !Number.isFinite(numericAmount) ||
            !Number.isSafeInteger(amountCents) ||
            amountCents <= 0
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid payment amount',
                },
                { status: 400 },
            );
        }

        try {
            const eventResponse = await fetch(
                `${EVENTS_SERVICE_URL}/events/publish`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        eventType: 'payment.completed',
                        version: 1,
                        data: {
                            tenantId,
                            transactionReference,
                            providerReference: transactionId,
                            provider: 'OZOW',
                            amount: numericAmount,
                            currency: currencyCode,
                        },
                    }),
                    cache: 'no-store',
                },
            );

            if (!eventResponse.ok) {
                const responseText =
                    await eventResponse
                        .text()
                        .catch(() => '');

                console.error(
                    'Failed to publish Ozow payment completion event',
                    {
                        tenantCode,
                        transactionReference,
                        httpStatus: eventResponse.status,
                        response: responseText.slice(0, 500),
                    },
                );

                return NextResponse.json(
                    {
                        error:
                            'Unable to publish payment completion event',
                    },
                    { status: 503 },
                );
            }
        } catch (error) {
            console.error(
                'Events service unavailable during Ozow callback',
                error,
            );

            return NextResponse.json(
                {
                    error:
                        'Events service unavailable',
                },
                { status: 503 },
            );
        }

        console.log(
            'Ozow payment completion event accepted',
            {
                tenantCode,
                transactionReference,
                transactionId,
                amount,
                currencyCode,
            },
        );

        return new NextResponse(
            null,
            { status: 200 },
        );
    } catch (error) {
        console.error(
            'Ozow notification error:',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to process notification',
            },
            { status: 500 },
        );
    }
}