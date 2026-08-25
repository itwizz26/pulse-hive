import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();

        console.log('Ozow notification received:', body);

        return NextResponse.json(
            { received: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Ozow notification error:', error);

        return NextResponse.json(
            { error: 'Failed to process notification' },
            { status: 500 }
        );
    }
}
