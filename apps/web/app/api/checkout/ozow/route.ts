import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

const OZOW_API_URL =
    'https://api.ozow.com/PostPaymentRequest';

interface CartItem {
    id?: string;
    name?: string;
    price?: number;
    quantity?: number;
    [key: string]: unknown;
}

interface OzowApiResponse {
    paymentRequestId?: string;
    url?: string;
    errorMessage?: string | null;
    message?: string | null;
}

interface CheckoutRequest {
    amount: number;
    transactionReference: string;
    customerName: string;
    phoneNumber: string;
    deliveryAddress: string;
    shippingMethod: string;
    shippingFee: number;
    items: CartItem[];
}

export async function POST(request: NextRequest) {
    try {
        /*
         * ---------------------------------------------------------
         * READ CHECKOUT REQUEST
         * ---------------------------------------------------------
         */

        const body =
            (await request.json()) as Partial<CheckoutRequest>;

        const {
            amount,
            transactionReference,
            customerName,
            phoneNumber,
            deliveryAddress,
            shippingMethod,
            shippingFee,
            items,
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
            console.error('Missing OZOW_SITE_CODE');

            return NextResponse.json(
                {
                    error:
                        'Ozow Site Code is not configured.',
                },
                { status: 500 }
            );
        }

        if (!privateKey) {
            console.error('Missing OZOW_PRIVATE_KEY');

            return NextResponse.json(
                {
                    error:
                        'Ozow Private Key is not configured.',
                },
                { status: 500 }
            );
        }

        if (!apiKey) {
            console.error('Missing OZOW_API_KEY');

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
         * VALIDATE CUSTOMER
         * ---------------------------------------------------------
         */

        if (
            !customerName ||
            typeof customerName !== 'string' ||
            !customerName.trim()
        ) {
            return NextResponse.json(
                {
                    error:
                        'Customer name is required.',
                },
                { status: 400 }
            );
        }

        if (
            !phoneNumber ||
            typeof phoneNumber !== 'string' ||
            !phoneNumber.trim()
        ) {
            return NextResponse.json(
                {
                    error:
                        'Phone number is required.',
                },
                { status: 400 }
            );
        }

        /*
         * ---------------------------------------------------------
         * VALIDATE DELIVERY
         * ---------------------------------------------------------
         */

        if (
            !deliveryAddress ||
            typeof deliveryAddress !== 'string' ||
            !deliveryAddress.trim()
        ) {
            return NextResponse.json(
                {
                    error:
                        'Delivery address is required.',
                },
                { status: 400 }
            );
        }

        if (
            !shippingMethod ||
            typeof shippingMethod !== 'string' ||
            !shippingMethod.trim()
        ) {
            return NextResponse.json(
                {
                    error:
                        'Shipping method is required.',
                },
                { status: 400 }
            );
        }

        if (
            typeof shippingFee !== 'number' ||
            !Number.isFinite(shippingFee) ||
            shippingFee < 0
        ) {
            return NextResponse.json(
                {
                    error:
                        'Invalid shipping fee.',
                },
                { status: 400 }
            );
        }

        /*
         * ---------------------------------------------------------
         * VALIDATE CART
         * ---------------------------------------------------------
         */

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return NextResponse.json(
                {
                    error:
                        'Order must contain at least one item.',
                },
                { status: 400 }
            );
        }

        /*
         * ---------------------------------------------------------
         * NORMALISE PAYMENT VALUES
         * ---------------------------------------------------------
         */

        const formattedAmount =
            amount.toFixed(2);

        const formattedShippingFee =
            shippingFee.toFixed(2);

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

        const bankReference =
            cleanTransactionReference.substring(
                0,
                20
            );

        const customer =
            customerName
                .trim()
                .substring(0, 100);

        /*
         * ---------------------------------------------------------
         * OPTIONAL FIELDS
         * ---------------------------------------------------------
         *
         * We deliberately do not try to put the complete order
         * into Ozow Optional fields.
         *
         * The order/payment correlation will be handled by our
         * own application architecture.
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
         */

        const ozowPayload = {
            apiKey,

            SiteCode:
                siteCode,

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
         * Never log:
         *
         * - privateKey
         * - apiKey
         * - hashInput
         * - hashCheck
         * - complete customer/order payload
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

                customerPresent:
                    Boolean(customer),

                phoneNumberPresent:
                    Boolean(phoneNumber),

                deliveryPresent:
                    Boolean(deliveryAddress),

                shippingMethod,

                shippingFee:
                    formattedShippingFee,

                itemCount:
                    items.length,

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
         * IMPORTANT:
         *
         * We still do NOT create an order here.
         *
         * We also do NOT mark payment as successful.
         *
         * The payment is only considered successful after Ozow
         * sends a valid Complete notification.
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

            /*
             * These fields are returned for our application
             * correlation flow. They are NOT sent to Ozow.
             */

            checkout: {
                phoneNumber:
                    phoneNumber.trim(),

                deliveryAddress:
                    deliveryAddress.trim(),

                shippingMethod:
                    shippingMethod.trim(),

                shippingFee:
                    formattedShippingFee,

                itemCount:
                    items.length,
            },
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
