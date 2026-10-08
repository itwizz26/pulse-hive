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
    const siteCode =
        getValue(params, 'SiteCode');

    const transactionId =
        getValue(params, 'TransactionId');

    const transactionReference =
        getValue(
            params,
            'TransactionReference',
        );

    const amount =
        getValue(params, 'Amount');

    const status =
        getValue(params, 'Status');

    const optional1 =
        getValue(params, 'Optional1');

    const optional2 =
        getValue(params, 'Optional2');

    const optional3 =
        getValue(params, 'Optional3');

    const optional4 =
        getValue(params, 'Optional4');

    const optional5 =
        getValue(params, 'Optional5');

    const currencyCode =
        getValue(
            params,
            'CurrencyCode',
        );

    const isTest =
        getValue(params, 'IsTest');

    const statusMessage =
        getValue(
            params,
            'StatusMessage',
        );

    /*
     * Ozow requires Amount to be represented
     * with exactly two decimal places.
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
    const input =
        buildOzowHashInput(
            params,
            privateKey,
        );

    return createHash('sha512')
        .update(input)
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

export async function POST(
    request: NextRequest,
) {
    try {
        /*
         * -------------------------------------------------------
         * Validate configuration
         * -------------------------------------------------------
         */

        if (!OZOW_SITE_CODE) {
            return NextResponse.json(
                {
                    error:
                        'OZOW_SITE_CODE is not configured',
                },
                { status: 500 },
            );
        }

        if (!OZOW_PRIVATE_KEY) {
            return NextResponse.json(
                {
                    error:
                        'OZOW_PRIVATE_KEY is not configured',
                },
                { status: 500 },
            );
        }

        /*
         * -------------------------------------------------------
         * Read form body
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

        /*
         * -------------------------------------------------------
         * Temporary hash diagnostic endpoint
         *
         * This uses the actual Railway OZOW_PRIVATE_KEY.
         * The private key itself is NEVER returned.
         * -------------------------------------------------------
         */

        const debugHash =
            request.nextUrl.searchParams.get(
                'debugHash',
            );

        if (
            debugHash === 'true'
        ) {
            const generatedHash =
                calculateOzowHash(
                    params,
                    OZOW_PRIVATE_KEY,
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
                        amount,

                    Status:
                        status,

                    Optional1:
                        optional1,

                    Optional2:
                        optional2,

                    Optional3:
                        optional3,

                    Optional4:
                        optional4,

                    Optional5:
                        optional5,

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
         * -------------------------------------------------------
         * Validate notification
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
            !/^\d+\.\d{2}$/.test(
                amount,
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
         * -------------------------------------------------------
         * Verify Ozow hash
         * -------------------------------------------------------
         */

        const hashValid =
            verifyOzowHash(
                params,
                OZOW_PRIVATE_KEY,
            );

        if (!hashValid) {
            console.error(
                'Invalid Ozow notification hash',
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
         * Validate test mode
         * -------------------------------------------------------
         */

        if (
            OZOW_IS_TEST &&
            isTest.toLowerCase() !==
                OZOW_IS_TEST.toLowerCase()
        ) {
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
         * Extract tenant code
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
                        'Invalid transaction reference',
                },
                { status: 400 },
            );
        }

        const tenantCode =
            tenantCodeMatch[1];

        /*
         * -------------------------------------------------------
         * Temporary processing response
         *
         * We are NOT calling DB or Events yet because
         * those services are not deployed on Railway.
         * -------------------------------------------------------
         */

        console.log(
            'Ozow notification verified successfully:',
            {
                tenantCode,
                siteCode,
                transactionId,
                transactionReference,
                amount,
                status,
                currencyCode,
                isTest,
                optional1,
                optional2,
                optional3,
                optional4,
                optional5,
                statusMessage,
            },
        );

        /*
         * Ozow only needs a 200 acknowledgement after
         * the notification has been successfully handled.
         *
         * We return diagnostic information temporarily
         * when debugNotify=true.
         */

        const debugNotify =
            request.nextUrl.searchParams.get(
                'debugNotify',
            );

        if (
            debugNotify === 'true'
        ) {
            return NextResponse.json(
                {
                    success: true,

                    message:
                        'Ozow notification verified successfully',

                    tenantCode,

                    notification: {
                        SiteCode:
                            siteCode,

                        TransactionId:
                            transactionId,

                        TransactionReference:
                            transactionReference,

                        Amount:
                            amount,

                        Status:
                            status,

                        Optional1:
                            optional1,

                        Optional2:
                            optional2,

                        Optional3:
                            optional3,

                        Optional4:
                            optional4,

                        Optional5:
                            optional5,

                        CurrencyCode:
                            currencyCode,

                        IsTest:
                            isTest,

                        StatusMessage:
                            statusMessage,
                    },
                },
                { status: 200 },
            );
        }

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

        const debugNotify =
            request.nextUrl.searchParams.get(
                'debugNotify',
            );

        if (
            debugNotify === 'true'
        ) {
            return NextResponse.json(
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : String(
                                  error,
                              ),
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
