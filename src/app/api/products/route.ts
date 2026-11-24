import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct, getAllAdminProducts } from '@/lib/dataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const priceRange = (searchParams.get('priceRange') as any) || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;
    const onlyFeatured = searchParams.get('featured') === 'true';
    const admin = searchParams.get('admin') === 'true';

    if (admin) {
      const all = await getAllAdminProducts();
      return NextResponse.json({ products: all, total: all.length });
    }

    const result = await getProducts({
      category,
      priceRange,
      sortBy,
      searchQuery,
      onlyFeatured,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.amazon_affiliate_url) {
      return NextResponse.json(
        { error: 'Product name and Amazon affiliate URL are required.' },
        { status: 400 }
      );
    }

    const saved = await saveProduct(body);
    return NextResponse.json({ success: true, product: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

