import { NextRequest, NextResponse } from 'next/server';

// This will store data persistently for everyone
let investmentsData: any = null;

export async function GET() {
  return NextResponse.json({ investments: investmentsData });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    investmentsData = body.investments;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
