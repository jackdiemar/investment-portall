import { get, getAll } from '@vercel/edge-config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const investments = await get('investments');
    return NextResponse.json({ investments: investments || null });
  } catch (error) {
    console.error('Edge Config read error:', error);
    return NextResponse.json({ investments: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update Edge Config via API
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'upsert',
              key: 'investments',
              value: body.investments,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update Edge Config');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export const runtime = 'edge';