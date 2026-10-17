import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json(
      {
        id: 101,
        quantity: body.quantity || 1,
        variant_id: body.id || 101,
        title: 'REBELIVE Energy',
        price: 79900,
        line_price: 79900,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch {
    return NextResponse.json({ status: 'ok' });
  }
}
