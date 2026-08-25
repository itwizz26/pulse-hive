import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

const OZOW_API_URL =
    'https://api.ozow.com/PostPaymentRequest';

interface OzowApiResponse {
    paymentRequestId?: string;
    url?: string;
    errorMessage?: string | null;
    message?: string | null;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            amount,
            transactionReference,
            customerName,
        } = body;

        /*
         * ---------------------------------------------------------
         * ENVIRONMENT
         * ---------------------------------------------------------
         */

        const siteCode =
            process.env.OZOW_SITE_CODE?.trim();

        const privateKey =
            process.env.OZOW_PRIVATE_KEY?.trim();

        const apiKey =
            process.env.OZOW_API_KEY?.trim();

        const isTest =
            process.env.OZOW_IS_TEST?.trim().toLowerCase() ===
            'true';

        /*
         * ---------------------------------------------------------
         * ENVIRONMENT VALIDATION
         * ---------------------------------------------------------
         */

        if (!siteCode) {
            console.error(
                'Missing OZOW_SITE_CODE'
            );

            return NextResponse.json(
                {
                    error:
                        'Ozow Site Code is not configured.',
                },
                { status: 500 }
            );
        }

        if (!privateKey) {
            console.error(
                'Missing OZOW_PRIVATE_KEY'
            );

            return NextResponse.json(
                {
                    error:
                        'Ozow Private Key is not configured.',
                },
                { status: 500 }
            );
        }

        if (!apiKey) {
            console.error(
                'Missing OZOW_API_KEY'
            );

            return NextResponse.json(
                {
                    error:
                        'Ozow API Key is not configured.',
                },
                { status: 500 }
            );
        }

        /*
         * ---------------------------------------------------------
         * VALIDATE PAYMENT AMOUNT
         * ---------------------------------------------------------
         */

        if (
            typeof amount !== 'number' ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid payment amount.',
                },
                { status: 400 }
            );
        }

        /*
         * ---------------------------------------------------------
         * VALIDATE TRANSACTION REFERENCE
         * ---------------------------------------------------------
         */

        if (
            !transactionReference ||
            typeof transactionReference !== 'string'
        ) {
            return NextResponse.json(
                {
                    error:
                        'Transaction reference is required.',
                },
                { status: 400 }
            );
        }

        const cleanTransactionReference =
            transactionReference
                .trim()
                .substring(0, 50);

        if (!cleanTransactionReference) {
            return NextResponse.json(
                {
                    error:
                        'Transaction reference cannot be empty.',
                },
                { status: 400 }
            );
        }

        /*
         * ---------------------------------------------------------
         * AMOUNT
         * ---------------------------------------------------------
         */

        const formattedAmount =
            amount.toFixed(2);

        /*
         * ---------------------------------------------------------
         * APPLICATION URLS
         * ---------------------------------------------------------
         */

        const configuredAppUrl =
            process.env.NEXT_PUBLIC_APP_URL?.trim();

        const appUrl =
            configuredAppUrl ||
            request.nextUrl.origin;

        const baseUrl =
            appUrl.replace(/\/+$/, '');

        const successUrl =
            `${baseUrl}/checkout/success`;

        const cancelUrl =
            `${baseUrl}/checkout/cancel`;

        const errorUrl =
            `${baseUrl}/checkout/error`;

        const notifyUrl =
            `${baseUrl}/api/checkout/ozow/notify`;

        /*
         * ---------------------------------------------------------
         * PAYMENT REFERENCES
         * ---------------------------------------------------------
         */

        /*
         * Ozow BankReference maximum length:
         * 20 characters.
         */

        const bankReference =
            cleanTransactionReference.substring(
                0,
                20
            );

        /*
         * Customer is optional.
         */

        const customer =
            typeof customerName === 'string'
                ? customerName
                      .trim()
                      .substring(0, 100)
                : '';

        /*
         * ---------------------------------------------------------
         * OPTIONAL FIELDS
         * ---------------------------------------------------------
         */

        const optional1 = '';
        const optional2 = '';
        const optional3 = '';
        const optional4 = '';
        const optional5 = '';

        /*
         * ---------------------------------------------------------
         * OZOW BASIC PAYMENT VALUES
         * ---------------------------------------------------------
         */

        const countryCode = 'ZA';
        const currencyCode = 'ZAR';

        /*
         * ---------------------------------------------------------
         * HASH
         * ---------------------------------------------------------
         *
         * Hash values are concatenated in the documented order,
         * followed by the private key.
         *
         * The complete string is converted to lowercase before
         * SHA-512 hashing.
         */

        const hashValues = [
            siteCode,
            countryCode,
            currencyCode,
            formattedAmount,
            cleanTransactionReference,
            bankReference,
            optional1,
            optional2,
            optional3,
            optional4,
            optional5,
            customer,
            cancelUrl,
            errorUrl,
            successUrl,
            notifyUrl,
            isTest ? 'true' : 'false',
        ];

        const hashInput =
            hashValues.join('') +
            privateKey;

        const hashCheck =
            crypto
                .createHash('sha512')
                .update(
                    hashInput.toLowerCase(),
                    'utf8'
                )
                .digest('hex');

        /*
         * ---------------------------------------------------------
         * OZOW API PAYLOAD
         * ---------------------------------------------------------
         *
         * IMPORTANT:
         *
         * apiKey is included explicitly in the JSON body.
         *
         * Your previous test against:
         *
         * https://api.ozow.com/PostPaymentRequest
         *
         * returned:
         *
         * "The apiKey field is required."
         *
         * Therefore we send:
         *
         *     apiKey: apiKey
         *
         * in addition to the HTTP ApiKey header.
         */

        const ozowPayload = {
            apiKey,

            SiteCode: siteCode,

            CountryCode:
                countryCode,

            CurrencyCode:
                currencyCode,

            Amount:
                formattedAmount,

            TransactionReference:
                cleanTransactionReference,

            BankReference:
                bankReference,

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

            Customer:
                customer,

            CancelUrl:
                cancelUrl,

            ErrorUrl:
                errorUrl,

            SuccessUrl:
                successUrl,

            NotifyUrl:
                notifyUrl,

            IsTest:
                isTest,

            HashCheck:
                hashCheck,
        };

        /*
         * ---------------------------------------------------------
         * DEBUG LOGGING
         * ---------------------------------------------------------
         *
         * NEVER log:
         *
         * - privateKey
         * - apiKey
         * - hashInput
         * - hashCheck
         */

        console.log(
            'Ozow PostPaymentRequest:',
            {
                endpoint:
                    OZOW_API_URL,

                siteCode,

                countryCode,

                currencyCode,

                amount:
                    formattedAmount,

                transactionReference:
                    cleanTransactionReference,

                bankReference,

                customer,

                successUrl,

                cancelUrl,

                errorUrl,

                notifyUrl,

                isTest,

                apiKeyPresent:
                    Boolean(apiKey),

                privateKeyPresent:
                    Boolean(privateKey),

                hashGenerated:
                    Boolean(hashCheck),
            }
        );

        /*
         * ---------------------------------------------------------
         * CALL OZOW
         * ---------------------------------------------------------
         */

        let ozowResponse: Response;

        try {
            ozowResponse =
                await fetch(
                    OZOW_API_URL,
                    {
                        method: 'POST',

                        headers: {
                            Accept:
                                'application/json',

                            'Content-Type':
                                'application/json',

                            /*
                             * Keep this header as well.
                             * The API appears to validate the
                             * apiKey body property, but the header
                             * is harmless and may be expected by
                             * some Ozow infrastructure.
                             */

                            ApiKey:
                                apiKey,
                        },

                        body:
                            JSON.stringify(
                                ozowPayload
                            ),

                        cache:
                            'no-store',
                    }
                );
        } catch (fetchError) {
            console.error(
                'Ozow network request failed:',
                fetchError
            );

            return NextResponse.json(
                {
                    error:
                        'Unable to connect to the Ozow payment API.',
                },
                { status: 502 }
            );
        }

        /*
         * ---------------------------------------------------------
         * READ RESPONSE
         * ---------------------------------------------------------
         */

        const responseText =
            await ozowResponse.text();

        let ozowData:
            | OzowApiResponse
            | null = null;

        try {
            ozowData =
                responseText
                    ? JSON.parse(
                          responseText
                      )
                    : null;
        } catch {
            console.error(
                'Ozow returned non-JSON response:',
                {
                    status:
                        ozowResponse.status,

                    statusText:
                        ozowResponse.statusText,

                    response:
                        responseText.substring(
                            0,
                            2000
                        ),
                }
            );
        }

        /*
         * ---------------------------------------------------------
         * API RESPONSE LOGGING
         * ---------------------------------------------------------
         */

        console.log(
            'Ozow API response:',
            {
                status:
                    ozowResponse.status,

                statusText:
                    ozowResponse.statusText,

                paymentRequestId:
                    ozowData
                        ?.paymentRequestId,

                url:
                    ozowData?.url
                        ? '[PRESENT]'
                        : '[MISSING]',

                errorMessage:
                    ozowData
                        ?.errorMessage ||
                    null,

                responseBody:
                    ozowResponse.ok
                        ? undefined
                        : responseText.substring(
                              0,
                              2000
                          ),
            }
        );

        /*
         * ---------------------------------------------------------
         * HANDLE HTTP ERRORS
         * ---------------------------------------------------------
         */

        if (!ozowResponse.ok) {
            const errorMessage =
                ozowData?.errorMessage ||
                ozowData?.message ||
                `Ozow returned HTTP ${ozowResponse.status}.`;

            console.error(
                'Ozow payment request rejected:',
                {
                    status:
                        ozowResponse.status,

                    statusText:
                        ozowResponse.statusText,

                    errorMessage,

                    response:
                        responseText.substring(
                            0,
                            2000
                        ),
                }
            );

            return NextResponse.json(
                {
                    error:
                        errorMessage,
                },
                {
                    status: 502,
                }
            );
        }

        /*
         * ---------------------------------------------------------
         * VALIDATE RESPONSE
         * ---------------------------------------------------------
         */

        if (!ozowData) {
            return NextResponse.json(
                {
                    error:
                        'Ozow returned an invalid response.',
                },
                { status: 502 }
            );
        }

        /*
         * ---------------------------------------------------------
         * HANDLE OZOW ERROR MESSAGE
         * ---------------------------------------------------------
         */

        if (ozowData.errorMessage) {
            return NextResponse.json(
                {
                    error:
                        ozowData.errorMessage,
                },
                { status: 502 }
            );
        }

        /*
         * ---------------------------------------------------------
         * PAYMENT URL
         * ---------------------------------------------------------
         */

        if (!ozowData.url) {
            console.error(
                'Ozow did not return a payment URL:',
                {
                    paymentRequestId:
                        ozowData.paymentRequestId,

                    response:
                        ozowData,
                }
            );

            return NextResponse.json(
                {
                    error:
                        'Ozow did not return a payment URL.',
                },
                { status: 502 }
            );
        }

        /*
         * ---------------------------------------------------------
         * SUCCESS
         * ---------------------------------------------------------
         *
         * The PostPaymentRequest API creates the payment request
         * and returns a unique Ozow payment URL.
         *
         * The frontend must redirect the browser to gatewayUrl.
         *
         * DO NOT POST another form to pay.ozow.com.
         */

        console.log(
            'Ozow payment request created:',
            {
                paymentRequestId:
                    ozowData.paymentRequestId,

                gatewayUrl:
                    ozowData.url,

                transactionReference:
                    cleanTransactionReference,
            }
        );

        return NextResponse.json({
            gatewayUrl:
                ozowData.url,

            paymentRequestId:
                ozowData.paymentRequestId,

            siteCode,

            countryCode,

            currencyCode,

            amount:
                formattedAmount,

            transactionReference:
                cleanTransactionReference,

            bankReference,

            customer,

            successUrl,

            cancelUrl,

            errorUrl,

            notifyUrl,

            isTest,
        });
    } catch (error) {
        console.error(
            'Ozow payment request error:',
            error
        );

        return NextResponse.json(
            {
                error:
                    'Unable to initialise Ozow payment.',
            },
            { status: 500 }
        );
    }
}