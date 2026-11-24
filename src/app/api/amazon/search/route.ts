import { NextRequest, NextResponse } from 'next/server';
import { searchAmazonItems, isAmazonApiConfigured } from '@/lib/amazonCreatorsApi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || 'home decor';

  try {
    const result = await searchAmazonItems(q);
    return NextResponse.json({
      success: true,
      query: q,
      isConfigured: isAmazonApiConfigured(),
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        isConfigured: isAmazonApiConfigured(),
      },
      { status: 500 }
    );
  }
}

