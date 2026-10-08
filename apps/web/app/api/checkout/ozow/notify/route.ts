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

function buildOzowHashInput(
    params: URLSearchParams,
    privateKey: string,
): string {
    const siteCode = getValue(
        params,
        'SiteCode',
    );

    const transactionId = getValue(
        params,
        'TransactionId',
    );

    const transactionReference =
        getValue(
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

    /*
     * Ozow requires Amount to be represented
     * with exactly two decimal places when
     * calculating the notification hash.
     */
    const normalizedAmount =
        Number(amount || 0).toFixed(2);

    return [
        siteCode,
        transactionId,
        transactionReference,
        normalizedAmount,
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
    const suppliedHash = getValue(
        params,
        'Hash',
    )
        .trim()
        .toLowerCase();

    if (!suppliedHash) {
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

async function getTenantByCode(
    tenantCode: string,
): Promise<{
    id: string;
    tenantCode?: string;
    name?: string;
}> {
    if (!PULSEHIVE_DB_SERVICE_URL) {
        throw new Error(
            'PULSEHIVE_DB_SERVICE_URL is not configured',
        );
    }

    const url =
        `${PULSEHIVE_DB_SERVICE_URL}/tenants/code/${encodeURIComponent(
            tenantCode,
        )}`;

    console.log(
        'Calling PulseHive DB service:',
        {
            url,
            tenantCode,
        },
    );

    let response: Response;

    try {
        response = await fetch(
            url,
            {
                cache: 'no-store',
            },
        );
    } catch (error) {
        console.error(
            'Failed to connect to PulseHive DB service:',
            {
                url,
                error,
            },
        );

        throw new Error(
            `DB service fetch failed: ${
                error instanceof Error
                    ? error.message
                    : String(error)
            }`,
        );
    }

    if (!response.ok) {
        const errorText =
            await response.text();

        console.error(
            'PulseHive DB service returned an error:',
            {
                status:
                    response.status,
                body: errorText,
                url,
            },
        );

        throw new Error(
            `Tenant lookup failed with status ${response.status}: ${errorText}`,
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
        orderNumber?: string;
        optional1?: string;
        optional2?: string;
        optional3?: string;
        optional4?: string;
        optional5?: string;
    },
) {
    if (!PULSEHIVE_EVENTS_SERVICE_URL) {
        throw new Error(
            'PULSEHIVE_EVENTS_SERVICE_URL is not configured',
        );
    }

    const url =
        `${PULSEHIVE_EVENTS_SERVICE_URL}/events/publish`;

    console.log(
        'Calling PulseHive Events service:',
        {
            url,
            eventType:
                EVENT_TYPE,
            tenantId:
                event.tenantId,
            transactionReference:
                event.transactionReference,
        },
    );

    let response: Response;

    try {
        response = await fetch(
            url,
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
    } catch (error) {
        console.error(
            'Failed to connect to PulseHive Events service:',
            {
                url,
                error,
            },
        );

        throw new Error(
            `Events service fetch failed: ${
                error instanceof Error
                    ? error.message
                    : String(error)
            }`,
        );
    }

    if (!response.ok) {
        const errorText =
            await response.text();

        console.error(
            'PulseHive Events service returned an error:',
            {
                status:
                    response.status,
                body: errorText,
                url,
            },
        );

        throw new Error(
            `Events service returned status ${response.status}: ${errorText}`,
        );
    }

    return response.json();
}

export async function POST(
    request: NextRequest,
) {
    let processingStage =
        'starting';

    try {
        /*
         * ---------------------------------------------------------
         * 1. Validate environment configuration
         * ---------------------------------------------------------
         */

        processingStage =
            'environment-validation';

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

        /*
         * ---------------------------------------------------------
         * 2. Read notification body
         * ---------------------------------------------------------
         */

        processingStage =
            'reading-notification';

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
                amount:
                    amountValue,
                status,
                currencyCode,
                isTest,
                statusMessage,
                optional1,
                optional2,
                optional3,
                optional4,
                optional5,
                hasHash:
                    Boolean(
                        suppliedHash,
                    ),
            },
        );

        /*
         * ---------------------------------------------------------
         * 3. Validate required fields
         * ---------------------------------------------------------
         */

        processingStage =
            'field-validation';

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
         * ---------------------------------------------------------
         * 4. Verify Ozow notification hash
         * ---------------------------------------------------------
         */

        processingStage =
            'hash-verification';

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

        console.log(
            'Ozow notification hash verified successfully.',
        );

        /*
         * ---------------------------------------------------------
         * 5. Validate test/live mode
         * ---------------------------------------------------------
         */

        processingStage =
            'test-mode-validation';

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
         * ---------------------------------------------------------
         * 6. Only process completed payments
         * ---------------------------------------------------------
         */

        processingStage =
            'status-validation';

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
         * ---------------------------------------------------------
         * 7. Extract tenant code
         * ---------------------------------------------------------
         */

        processingStage =
            'tenant-code-extraction';

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

        console.log(
            'Tenant code extracted from transaction reference:',
            {
                transactionReference,
                tenantCode,
            },
        );

        /*
         * ---------------------------------------------------------
         * 8. Resolve tenant
         * ---------------------------------------------------------
         */

        processingStage =
            'tenant-lookup';

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

        console.log(
            'Tenant resolved successfully:',
            {
                tenantCode,
                tenantId:
                    tenant.id,
                tenantName:
                    tenant.name,
            },
        );

        /*
         * ---------------------------------------------------------
         * 9. Convert amount
         * ---------------------------------------------------------
         */

        processingStage =
            'amount-processing';

        const amount =
            Number(
                amountValue,
            );

        if (
            !Number.isFinite(
                amount,
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid transaction amount',
                },
                { status: 400 },
            );
        }

        /*
         * ---------------------------------------------------------
         * 10. Publish payment.completed event
         * ---------------------------------------------------------
         */

        processingStage =
            'events-publish';

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

                    /*
                     * These fields allow the downstream
                     * orders service to eventually
                     * reconstruct useful order metadata
                     * from the payment event.
                     */

                    orderNumber:
                        optional1,

                    optional1,
                    optional2,
                    optional3,
                    optional4,
                    optional5,
                },
            );

        /*
         * ---------------------------------------------------------
         * 11. Success
         * ---------------------------------------------------------
         */

        processingStage =
            'completed';

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
            {
                processingStage,
                error,
            },
        );

        /*
         * Temporary diagnostic mode.
         *
         * IMPORTANT:
         * This never exposes the Ozow private key.
         * It only exposes the failing stage and
         * the resulting error message.
         */
        const isDebug =
            request.nextUrl.searchParams.get(
                'debugNotify',
            ) === 'true';

        if (isDebug) {
            return NextResponse.json(
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : String(
                                  error,
                              ),

                    processingStage,

                    stack:
                        error instanceof Error
                            ? error.stack
                            : undefined,
                },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                error:
                    'Failed to process notification',
            },
            { status: 500 },
        );
    }
}
