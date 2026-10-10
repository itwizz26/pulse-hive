
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

const OZOW_API_URL = 'https://api.ozow.com/PostPaymentRequest';

interface CartItem {
    id?: string;
    name?: string;
    price?: number;
    quantity?: number;
    sku?: string;
    [key: string]: unknown;
}

interface OzowApiResponse {
    paymentRequestId?: string;
    url?: string;
    errorMessage?: string | null;
    message?: string | null;
}

interface CheckoutRequest {
    amount?: number;
    transactionReference?: string;
    customerName?: string;
    phoneNumber?: string;
    deliveryAddress?: string;
    shippingMethod?: string;
    shippingFee?: number;
    items?: CartItem[];
}

interface Tenant {
    id: string;
    tenantCode: string;
    name: string;
    slug: string;
}

interface CatalogueProduct {
    id: string;
    tenantId: string;
    name: string;
    sku?: string | null;
    price: number;
    active: boolean;
}

interface OrderItem {
    productId: string;
    productName: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export async function POST(request: NextRequest) {
    try {
        /*
         * READ CHECKOUT REQUEST
         */

        let body: Partial<CheckoutRequest>;

        try {
            body = (await request.json()) as Partial<CheckoutRequest>;
        } catch {
            return NextResponse.json(
                { error: 'Invalid checkout request.' },
                { status: 400 },
            );
        }

        const {
            customerName,
            phoneNumber,
            deliveryAddress,
            shippingMethod,
            shippingFee,
            items,
        } = body;

        /*
         * ENVIRONMENT
         */

        const siteCode = process.env.OZOW_SITE_CODE?.trim();
        const privateKey = process.env.OZOW_PRIVATE_KEY?.trim();
        const apiKey = process.env.OZOW_API_KEY?.trim();
        const isTest =
            process.env.OZOW_IS_TEST?.trim().toLowerCase() === 'true';

        const tenantCode =
            process.env.PULSEHIVE_TENANT_CODE?.trim().toUpperCase();
        const dbServiceUrl =
            process.env.PULSEHIVE_DB_SERVICE_URL?.trim()?.replace(/\/+$/, '');
        const ordersServiceUrl =
            process.env.PULSEHIVE_ORDERS_SERVICE_URL?.trim()?.replace(/\/+$/, '');

        if (!siteCode || !privateKey || !apiKey) {
            console.error('Ozow environment configuration is incomplete.');

            return NextResponse.json(
                { error: 'Ozow payment configuration is incomplete.' },
                { status: 500 },
            );
        }

        if (!tenantCode || !/^[A-Z]{3}-[0-9]{3}$/.test(tenantCode)) {
            console.error('Invalid or missing PULSEHIVE_TENANT_CODE.');

            return NextResponse.json(
                { error: 'PulseHive Tenant Code is not configured correctly.' },
                { status: 500 },
            );
        }

        if (!dbServiceUrl || !ordersServiceUrl) {
            console.error('PulseHive service URL configuration is incomplete.');

            return NextResponse.json(
                { error: 'PulseHive service URLs are not configured.' },
                { status: 500 },
            );
        }

        /*
         * VALIDATE CUSTOMER DETAILS
         */

        if (
            typeof customerName !== 'string' ||
            !customerName.trim() ||
            customerName.trim().length > 100
        ) {
            return NextResponse.json(
                { error: 'A valid customer name is required.' },
                { status: 400 },
            );
        }

        if (
            typeof phoneNumber !== 'string' ||
            !phoneNumber.trim() ||
            phoneNumber.trim().length > 30
        ) {
            return NextResponse.json(
                { error: 'A valid phone number is required.' },
                { status: 400 },
            );
        }

        /*
         * VALIDATE DELIVERY DETAILS
         */

        if (
            typeof deliveryAddress !== 'string' ||
            !deliveryAddress.trim() ||
            deliveryAddress.trim().length > 500
        ) {
            return NextResponse.json(
                { error: 'A valid delivery address is required.' },
                { status: 400 },
            );
        }

        if (
            typeof shippingMethod !== 'string' ||
            !shippingMethod.trim() ||
            shippingMethod.trim().length > 100
        ) {
            return NextResponse.json(
                { error: 'A valid shipping method is required.' },
                { status: 400 },
            );
        }

        /*
         * TEMPORARY SHIPPING FEE VALIDATION
         *
         * The fee is still supplied by the client in this version.
         * It must be moved to server-side shipping rules before
         * treating the checkout total as fully trusted.
         */

        if (
            typeof shippingFee !== 'number' ||
            !Number.isFinite(shippingFee) ||
            shippingFee < 0 ||
            !Number.isSafeInteger(Math.round(shippingFee * 100))
        ) {
            return NextResponse.json(
                { error: 'Invalid shipping fee.' },
                { status: 400 },
            );
        }

        const shippingFeeCents = Math.round(shippingFee * 100);
        const formattedShippingFee = (shippingFeeCents / 100).toFixed(2);

        /*
         * VALIDATE CART STRUCTURE
         */

        if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
            return NextResponse.json(
                { error: 'Order must contain between 1 and 100 items.' },
                { status: 400 },
            );
        }

        /*
         * GENERATE TRANSACTION REFERENCE ON THE SERVER
         */

        const cleanTransactionReference =
            `${tenantCode}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

        /*
         * APPLICATION URLS
         */

        const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
        const appUrl = configuredAppUrl || request.nextUrl.origin;
        const baseUrl = appUrl.replace(/\/+$/, '');

        let parsedBaseUrl: URL;

        try {
            parsedBaseUrl = new URL(baseUrl);
        } catch {
            return NextResponse.json(
                { error: 'The storefront application URL is invalid.' },
                { status: 500 },
            );
        }

        if (
            process.env.NODE_ENV === 'production' &&
            parsedBaseUrl.protocol !== 'https:'
        ) {
            return NextResponse.json(
                { error: 'The production application URL must use HTTPS.' },
                { status: 500 },
            );
        }

        const successUrl = `${baseUrl}/checkout/success`;
        const cancelUrl = `${baseUrl}/checkout/cancel`;
        const errorUrl = `${baseUrl}/checkout/error`;
        const notifyUrl = `${baseUrl}/api/checkout/ozow/notify`;

        const bankReference = cleanTransactionReference.substring(0, 20);
        const customer = customerName.trim().substring(0, 100);

        const optional1 = '';
        const optional2 = '';
        const optional3 = '';
        const optional4 = '';
        const optional5 = '';

        const countryCode = 'ZA';
        const currencyCode = 'ZAR';

        /*
         * RESOLVE TENANT
         */

        let tenant: Tenant;

        try {
            const tenantResponse = await fetch(
                `${dbServiceUrl}/tenants/code/${encodeURIComponent(tenantCode)}`,
                {
                    method: 'GET',
                    headers: { Accept: 'application/json' },
                    cache: 'no-store',
                },
            );

            const tenantData: unknown = await tenantResponse
                .json()
                .catch(() => null);

            if (
                !tenantResponse.ok ||
                !tenantData ||
                typeof tenantData !== 'object' ||
                !('id' in tenantData) ||
                !('tenantCode' in tenantData) ||
                !('name' in tenantData) ||
                !('slug' in tenantData)
            ) {
                console.error('PulseHive tenant lookup failed.', {
                    status: tenantResponse.status,
                    tenantCode,
                });

                return NextResponse.json(
                    { error: 'Unable to resolve checkout tenant.' },
                    { status: 502 },
                );
            }

            tenant = tenantData as Tenant;

            if (tenant.tenantCode !== tenantCode) {
                console.error('Resolved tenant code did not match configuration.');

                return NextResponse.json(
                    { error: 'Unable to validate checkout tenant.' },
                    { status: 502 },
                );
            }
        } catch (error) {
            console.error('PulseHive tenant service unavailable.', error);

            return NextResponse.json(
                { error: 'Unable to connect to the PulseHive DB service.' },
                { status: 503 },
            );
        }

        /*
         * FETCH THE AUTHORITATIVE PRODUCT CATALOGUE
         */

        let catalogue: CatalogueProduct[];

        try {
            const productsResponse = await fetch(
                `${dbServiceUrl}/products/tenant/${encodeURIComponent(tenantCode)}`,
                {
                    method: 'GET',
                    headers: { Accept: 'application/json' },
                    cache: 'no-store',
                },
            );

            const productsData: unknown = await productsResponse
                .json()
                .catch(() => null);

            if (!productsResponse.ok || !Array.isArray(productsData)) {
                console.error('PulseHive product catalogue lookup failed.', {
                    status: productsResponse.status,
                    tenantCode,
                });

                return NextResponse.json(
                    { error: 'Unable to validate the product catalogue.' },
                    { status: 502 },
                );
            }

            catalogue = productsData as CatalogueProduct[];
        } catch (error) {
            console.error('PulseHive product catalogue service unavailable.', error);

            return NextResponse.json(
                { error: 'Unable to connect to the product catalogue.' },
                { status: 503 },
            );
        }

        /*
         * BUILD ORDER ITEMS USING DATABASE PRICES
         *
         * Browser-supplied product names, SKUs and prices are ignored.
         */

        const orderItems: OrderItem[] = [];

        for (const item of items) {
            if (
                !item ||
                typeof item.id !== 'string' ||
                !item.id.trim() ||
                typeof item.quantity !== 'number' ||
                !Number.isSafeInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return NextResponse.json(
                    { error: 'Each cart item must have a valid product ID and quantity.' },
                    { status: 400 },
                );
            }

            const product = catalogue.find(
                (candidate) =>
                    candidate.id === item.id &&
                    candidate.tenantId === tenant.id &&
                    candidate.active === true,
            );

            if (!product) {
                return NextResponse.json(
                    {
                        error:
                            'A product in your cart is unavailable. Please refresh your cart.',
                    },
                    { status: 400 },
                );
            }

            if (
                typeof product.name !== 'string' ||
                !product.name.trim() ||
                typeof product.price !== 'number' ||
                !Number.isFinite(product.price) ||
                product.price < 0
            ) {
                console.error('Invalid product data in catalogue.', {
                    productId: product.id,
                    tenantCode,
                });

                return NextResponse.json(
                    { error: 'Unable to validate a product in your cart.' },
                    { status: 500 },
                );
            }

            const unitPriceCents = Math.round(product.price * 100);
            const lineTotalCents = unitPriceCents * item.quantity;

            if (
                !Number.isSafeInteger(unitPriceCents) ||
                !Number.isSafeInteger(lineTotalCents)
            ) {
                return NextResponse.json(
                    { error: 'A product quantity or price is too large.' },
                    { status: 400 },
                );
            }

            orderItems.push({
                productId: product.id,
                productName: product.name.trim(),
                sku: product.sku ?? undefined,
                quantity: item.quantity,
                unitPrice: unitPriceCents / 100,
                totalPrice: lineTotalCents / 100,
            });
        }

        /*
         * CALCULATE THE PAYMENT TOTAL ON THE SERVER
         */

        const subtotalCents = orderItems.reduce(
            (sum, item) => sum + Math.round(item.totalPrice * 100),
            0,
        );

        const totalAmountCents = subtotalCents + shippingFeeCents;

        if (
            !Number.isSafeInteger(subtotalCents) ||
            !Number.isSafeInteger(totalAmountCents) ||
            totalAmountCents <= 0
        ) {
            return NextResponse.json(
                { error: 'The calculated order total is invalid.' },
                { status: 400 },
            );
        }

        const subtotal = subtotalCents / 100;
        const formattedAmount = (totalAmountCents / 100).toFixed(2);

        /*
         * CREATE PENDING ORDER BEFORE REDIRECTING TO OZOW
         */

        let pendingOrder: unknown;

        try {
            const orderResponse = await fetch(
                `${ordersServiceUrl}/orders`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tenantId: tenant.id,
                        customerName: customerName.trim(),
                        phoneNumber: phoneNumber.trim(),
                        deliveryAddress: deliveryAddress.trim(),
                        shippingMethod: shippingMethod.trim(),
                        shippingFee: Number(formattedShippingFee),
                        subtotal,
                        totalAmount: Number(formattedAmount),
                        transactionReference: cleanTransactionReference,
                        provider: 'OZOW',
                        items: orderItems,
                    }),
                    cache: 'no-store',
                },
            );

            const orderData: unknown = await orderResponse
                .json()
                .catch(() => null);

            if (!orderResponse.ok || !orderData) {
                console.error('PulseHive pending order creation failed.', {
                    status: orderResponse.status,
                    tenantCode,
                    transactionReference: cleanTransactionReference,
                });

                return NextResponse.json(
                    { error: 'Unable to create pending order.' },
                    { status: 502 },
                );
            }

            pendingOrder = orderData;
        } catch (error) {
            console.error('PulseHive Orders service request failed.', error);

            return NextResponse.json(
                { error: 'Unable to connect to the PulseHive Orders service.' },
                { status: 503 },
            );
        }

        /*
         * GENERATE OZOW HASH
         *
         * Preserve the existing hash construction for the current
         * PostPaymentRequest integration.
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

        const hashInput = hashValues.join('') + privateKey;

        const hashCheck = crypto
            .createHash('sha512')
            .update(hashInput.toLowerCase(), 'utf8')
            .digest('hex');

        /*
         * OZOW API PAYLOAD
         */

        const ozowPayload = {
            apiKey,
            SiteCode: siteCode,
            CountryCode: countryCode,
            CurrencyCode: currencyCode,
            Amount: formattedAmount,
            TransactionReference: cleanTransactionReference,
            BankReference: bankReference,
            Optional1: optional1,
            Optional2: optional2,
            Optional3: optional3,
            Optional4: optional4,
            Optional5: optional5,
            Customer: customer,
            CancelUrl: cancelUrl,
            ErrorUrl: errorUrl,
            SuccessUrl: successUrl,
            NotifyUrl: notifyUrl,
            IsTest: isTest,
            HashCheck: hashCheck,
        };

        /*
         * SAFE DEBUG LOGGING
         */

        console.log('Ozow PostPaymentRequest.', {
            endpoint: OZOW_API_URL,
            tenantCode,
            tenantId: tenant.id,
            siteCode,
            countryCode,
            currencyCode,
            amount: formattedAmount,
            transactionReference: cleanTransactionReference,
            bankReference,
            shippingMethod: shippingMethod.trim(),
            shippingFee: formattedShippingFee,
            itemCount: orderItems.length,
            pendingOrderCreated: Boolean(pendingOrder),
            isTest,
        });

        /*
         * CALL OZOW
         */

        let ozowResponse: Response;

        try {
            ozowResponse = await fetch(OZOW_API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ApiKey: apiKey,
                },
                body: JSON.stringify(ozowPayload),
                cache: 'no-store',
            });
        } catch (error) {
            console.error('Ozow network request failed.', error);

            return NextResponse.json(
                { error: 'Unable to connect to the Ozow payment API.' },
                { status: 502 },
            );
        }

        /*
         * READ OZOW RESPONSE
         */

        const responseText = await ozowResponse.text();

        let ozowData: OzowApiResponse | null = null;

        try {
            ozowData = responseText
                ? (JSON.parse(responseText) as OzowApiResponse)
                : null;
        } catch {
            console.error('Ozow returned a non-JSON response.', {
                status: ozowResponse.status,
                statusText: ozowResponse.statusText,
            });
        }

        console.log('Ozow API response.', {
            status: ozowResponse.status,
            paymentRequestId: ozowData?.paymentRequestId,
            paymentUrlPresent: Boolean(ozowData?.url),
            errorMessage: ozowData?.errorMessage || null,
        });

        if (!ozowResponse.ok) {
            const errorMessage =
                ozowData?.errorMessage ||
                ozowData?.message ||
                `Ozow returned HTTP ${ozowResponse.status}.`;

            console.error('Ozow payment request rejected.', {
                status: ozowResponse.status,
                errorMessage,
            });

            return NextResponse.json(
                { error: errorMessage },
                { status: 502 },
            );
        }

        if (!ozowData || ozowData.errorMessage || !ozowData.url) {
            return NextResponse.json(
                {
                    error:
                        ozowData?.errorMessage ||
                        'Ozow did not return a valid payment URL.',
                },
                { status: 502 },
            );
        }

        /*
         * SUCCESS
         *
         * Creating a payment request does not mean the customer
         * has paid. Only a verified Ozow notification can do that.
         */

        console.log('Ozow payment request created.', {
            paymentRequestId: ozowData.paymentRequestId,
            transactionReference: cleanTransactionReference,
            tenantCode,
            tenantId: tenant.id,
        });

        return NextResponse.json({
            gatewayUrl: ozowData.url,
            paymentRequestId: ozowData.paymentRequestId,
            siteCode,
            countryCode,
            currencyCode,
            amount: formattedAmount,
            transactionReference: cleanTransactionReference,
            bankReference,
            customer,
            successUrl,
            cancelUrl,
            errorUrl,
            notifyUrl,
            isTest,
            tenantCode,
            tenantId: tenant.id,
            checkout: {
                phoneNumber: phoneNumber.trim(),
                deliveryAddress: deliveryAddress.trim(),
                shippingMethod: shippingMethod.trim(),
                shippingFee: formattedShippingFee,
                itemCount: orderItems.length,
            },
        });
    } catch (error) {
        console.error('Ozow payment request error.', error);

        return NextResponse.json(
            { error: 'Unable to initialise Ozow payment.' },
            { status: 500 },
        );
    }
}