import { NextRequest, NextResponse } from 'next/server';
import { getAmazonItemDetails } from '@/lib/amazonCreatorsApi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const asin = searchParams.get('asin');

  if (!asin) {
    return NextResponse.json({ error: 'ASIN parameter is required' }, { status: 400 });
  }

  try {
    const item = await getAmazonItemDetails(asin);
    if (!item) {
      return NextResponse.json({ error: 'Item not found via Creators API' }, { status: 404 });
    }
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

