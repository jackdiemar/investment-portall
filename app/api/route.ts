import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const investments = await kv.get('investments');
    return NextResponse.json({ investments: investments || null });
  } catch (error) {
    console.error('KV read error:', error);
    return NextResponse.json({ investments: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await kv.set('investments', body.investments);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('KV save error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}