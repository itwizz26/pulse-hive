import { createHash, timingSafeEqual } from 'crypto';

import { NextRequest, NextResponse } from 'next/server';

const OZOW_SITE_CODE = process.env.OZOW_SITE_CODE;
const OZOW_PRIVATE_KEY = process.env.OZOW_PRIVATE_KEY;
const OZOW_IS_TEST = process.env.OZOW_IS_TEST;

const PULSEHIVE_DB_SERVICE_URL =
    process.env.PULSEHIVE_DB_SERVICE_URL;

const PULSEHIVE_EVENTS_SERVICE_URL =
    process.env.PULSEHIVE_EVENTS_SERVICE_URL;

const EVENT_TYPE = 'payment.completed';
const EVENT_VERSION = 1;

function getValue(
    params: URLSearchParams,
    key: string,
): string {
    return params.get(key) ?? '';
}

/**
 * Builds the exact Ozow notification hash input.
 *
 * Ozow notification hash order:
 *
 * SiteCode
 * TransactionId
 * TransactionReference
 * Amount
 * Status
 * Optional1
 * Optional2
 * Optional3
 * Optional4
 * Optional5
 * CurrencyCode
 * IsTest
 * StatusMessage
 * PrivateKey
 */
function buildOzowHashInput(
    params: URLSearchParams,
    privateKey: string,
): string {
    const siteCode = getValue(params, 'SiteCode');

    const transactionId = getValue(
        params,
        'TransactionId',
    );

    const transactionReference = getValue(
        params,
        'TransactionReference',
    );

    const amount = getValue(
        params,
        'Amount',
    );

    const status = getValue(
        params,
        'Status',
    );

    const optional1 = getValue(
        params,
        'Optional1',
    );

    const optional2 = getValue(
        params,
        'Optional2',
    );

    const optional3 = getValue(
        params,
        'Optional3',
    );

    const optional4 = getValue(
        params,
        'Optional4',
    );

    const optional5 = getValue(
        params,
        'Optional5',
    );

    const currencyCode = getValue(
        params,
        'CurrencyCode',
    );

    const isTest = getValue(
        params,
        'IsTest',
    );

    const statusMessage = getValue(
        params,
        'StatusMessage',
    );

    return [
        siteCode,
        transactionId,
        transactionReference,
        amount,
        status,
        optional1,
        optional2,
        optional3,
        optional4,
        optional5,
        currencyCode,
        isTest,
        statusMessage,
        privateKey,
    ]
        .join('')
        .toLowerCase();
}

function calculateOzowHash(
    params: URLSearchParams,
    privateKey: string,
): string {
    const hashInput = buildOzowHashInput(
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
    const suppliedHash = getValue(
        params,
        'Hash',
    )
        .trim()
        .toLowerCase();

    const expectedHash =
        calculateOzowHash(
            params,
            privateKey,
        );

    if (!suppliedHash) {
        return false;
    }

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

async function getTenantByCode(
    tenantCode: string,
) {
    const response = await fetch(
        `${PULSEHIVE_DB_SERVICE_URL}/tenants/code/${encodeURIComponent(
            tenantCode,
        )}`,
        {
            cache: 'no-store',
        },
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        console.error(
            'Failed to resolve tenant from DB service:',
            response.status,
            errorText,
        );

        throw new Error(
            `Tenant lookup failed with status ${response.status}`,
        );
    }

    return response.json();
}

async function publishPaymentCompletedEvent(
    event: {
        tenantId: string;
        transactionReference: string;
        providerReference: string;
        provider: string;
        amount: number;
        currency: string;
    },
) {
    const response = await fetch(
        `${PULSEHIVE_EVENTS_SERVICE_URL}/events/publish`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify({
                eventType:
                    EVENT_TYPE,
                version:
                    EVENT_VERSION,
                data: event,
            }),
        },
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        console.error(
            'Failed to publish payment.completed event:',
            response.status,
            errorText,
        );

        throw new Error(
            `Events service returned status ${response.status}`,
        );
    }

    return response.json();
}

export async function POST(
    request: NextRequest,
) {
    try {
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

        if (!PULSEHIVE_DB_SERVICE_URL) {
            console.error(
                'PULSEHIVE_DB_SERVICE_URL is not configured',
            );

            return NextResponse.json(
                {
                    error:
                        'PulseHive DB service URL is not configured',
                },
                { status: 500 },
            );
        }

        if (!PULSEHIVE_EVENTS_SERVICE_URL) {
            console.error(
                'PULSEHIVE_EVENTS_SERVICE_URL is not configured',
            );

            return NextResponse.json(
                {
                    error:
                        'PulseHive Events service URL is not configured',
                },
                { status: 500 },
            );
        }

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

        const amountValue =
            getValue(
                params,
                'Amount',
            );

        const status =
            getValue(
                params,
                'Status',
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

        console.log(
            'Ozow notification received:',
            {
                siteCode,
                transactionId,
                transactionReference,
                amount: amountValue,
                status,
                currencyCode,
                isTest,
                statusMessage,
                optional1:
                    getValue(
                        params,
                        'Optional1',
                    ),
                optional2:
                    getValue(
                        params,
                        'Optional2',
                    ),
                optional3:
                    getValue(
                        params,
                        'Optional3',
                    ),
                optional4:
                    getValue(
                        params,
                        'Optional4',
                    ),
                optional5:
                    getValue(
                        params,
                        'Optional5',
                    ),
            },
        );

        /*
         * ============================================================
         * DEVELOPMENT HASH GENERATOR
         * ============================================================
         *
         * TEMPORARY.
         *
         * This allows us to generate a valid notification hash
         * using the SAME OZOW_PRIVATE_KEY that is configured on
         * Railway.
         *
         * Remove this endpoint after testing.
         * ============================================================
         */

        if (
            request.nextUrl.searchParams.get(
                'debugHash',
            ) === 'true'
        ) {
            const generatedHash =
                calculateOzowHash(
                    params,
                    OZOW_PRIVATE_KEY,
                );

            console.log(
                'Generated Ozow debug hash:',
                generatedHash,
            );

            return NextResponse.json({
                hash: generatedHash,
                fields: {
                    SiteCode:
                        siteCode,
                    TransactionId:
                        transactionId,
                    TransactionReference:
                        transactionReference,
                    Amount:
                        amountValue,
                    Status:
                        status,
                    Optional1:
                        getValue(
                            params,
                            'Optional1',
                        ),
                    Optional2:
                        getValue(
                            params,
                            'Optional2',
                        ),
                    Optional3:
                        getValue(
                            params,
                            'Optional3',
                        ),
                    Optional4:
                        getValue(
                            params,
                            'Optional4',
                        ),
                    Optional5:
                        getValue(
                            params,
                            'Optional5',
                        ),
                    CurrencyCode:
                        currencyCode,
                    IsTest:
                        isTest,
                    StatusMessage:
                        statusMessage,
                },
            });
        }

        /*
         * ============================================================
         * BASIC VALIDATION
         * ============================================================
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
            console.error(
                'Ozow notification SiteCode mismatch:',
                siteCode,
            );

            return NextResponse.json(
                {
                    error:
                        'Invalid SiteCode',
                },
                { status: 400 },
            );
        }

        if (!transactionId) {
            return NextResponse.json(
                {
                    error:
                        'Missing TransactionId',
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

        if (!amountValue) {
            return NextResponse.json(
                {
                    error:
                        'Missing Amount',
                },
                { status: 400 },
            );
        }

        if (
            !/^\d+\.\d{2}$/.test(
                amountValue,
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid Amount format',
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

        /*
         * ============================================================
         * VERIFY OZOW HASH
         * ============================================================
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
                    transactionReference,
                    transactionId,
                    suppliedHash,
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
         * ============================================================
         * VALIDATE TEST MODE
         * ============================================================
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
         * ============================================================
         * ONLY COMPLETED PAYMENTS ENTER THE CURRENT EVENT PIPELINE
         * ============================================================
         */

        if (
            status !==
            'Complete'
        ) {
            console.log(
                'Ozow notification acknowledged without payment.completed:',
                {
                    transactionReference,
                    status,
                },
            );

            return new NextResponse(
                null,
                {
                    status: 200,
                },
            );
        }

        /*
         * ============================================================
         * RESOLVE TENANT
         * ============================================================
         */

        const tenantCodeMatch =
            transactionReference.match(
                /^([A-Z]{3}-\d{3})-/,
            );

        if (!tenantCodeMatch) {
            console.error(
                'Unable to determine tenant code from transaction reference:',
                transactionReference,
            );

            return NextResponse.json(
                {
                    error:
                        'Invalid transaction reference',
                },
                { status: 400 },
            );
        }

        const tenantCode =
            tenantCodeMatch[1];

        const tenant =
            await getTenantByCode(
                tenantCode,
            );

        if (
            !tenant ||
            typeof tenant.id !==
                'string'
        ) {
            console.error(
                'Tenant was not found:',
                tenantCode,
            );

            return NextResponse.json(
                {
                    error:
                        'Tenant not found',
                },
                { status: 404 },
            );
        }

        /*
         * ============================================================
         * PUBLISH PAYMENT COMPLETED
         * ============================================================
         */

        const amount =
            Number(amountValue);

        const event =
            await publishPaymentCompletedEvent(
                {
                    tenantId:
                        tenant.id,
                    transactionReference,
                    providerReference:
                        transactionId,
                    provider:
                        'OZOW',
                    amount,
                    currency:
                        currencyCode,
                },
            );

        console.log(
            'Ozow payment.completed event published:',
            {
                tenantCode,
                tenantId:
                    tenant.id,
                transactionReference,
                providerReference:
                    transactionId,
                amount,
                currency:
                    currencyCode,
                eventId:
                    event?.eventId,
            },
        );

        return new NextResponse(
            null,
            {
                status: 200,
            },
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
