import { NextResponse } from 'next/server';

const TENANT_CODE = process.env.PULSEHIVE_TENANT_CODE;
const DB_SERVICE_URL = process.env.PULSEHIVE_DB_SERVICE_URL;

export async function GET() {
    if (!TENANT_CODE) {
        return NextResponse.json(
            {
                error: 'PULSEHIVE_TENANT_CODE is not configured',
            },
            { status: 500 },
        );
    }

    if (!DB_SERVICE_URL) {
        return NextResponse.json(
            {
                error: 'PULSEHIVE_DB_SERVICE_URL is not configured',
            },
            { status: 500 },
        );
    }

    try {
        const response = await fetch(
            `${DB_SERVICE_URL}/products/tenant/${encodeURIComponent(
                TENANT_CODE,
            )}`,
            {
                cache: 'no-store',
            },
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error(
                'Failed to fetch products from DB service:',
                response.status,
                errorText,
            );

            return NextResponse.json(
                {
                    error: 'Failed to fetch products',
                },
                { status: response.status },
            );
        }

        const products = await response.json();

        return NextResponse.json(products);
    } catch (error) {
        console.error(
            'Unable to reach PulseHive DB service:',
            error,
        );

        return NextResponse.json(
            {
                error: 'Unable to reach product service',
            },
            { status: 503 },
        );
    }
}
