import { NextRequest, NextResponse } from 'next/server';
import { getArticles, saveArticle, getAllAdminArticles } from '@/lib/dataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';

    if (admin) {
      const articles = await getAllAdminArticles();
      return NextResponse.json({ articles });
    }

    const articles = await getArticles();
    return NextResponse.json({ articles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Article title and content are required.' },
        { status: 400 }
      );
    }

    const saved = await saveArticle(body);
    return NextResponse.json({ success: true, article: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

