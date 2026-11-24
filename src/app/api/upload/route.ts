import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Allowed MIME types for exact product images
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    let files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const single = formData.get('file') as File | null;
      if (single) {
        files = [single];
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No image files provided for upload.' }, { status: 400 });
    }

    // Validate all files first
    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type "${file.type || 'unknown'}". Only JPEG, PNG, WEBP, and AVIF images are permitted.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds the 5MB size limit. Please upload an optimized image.`,
          },
          { status: 400 }
        );
      }
    }

    const urls: string[] = [];
    let storageEngine: 'supabase' | 'local' = 'local';

    // Try Supabase Storage if configured
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const bucketName = 'product-images';
        
        // Ensure bucket exists or check access
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        const hasBucket = buckets?.some((b) => b.name === bucketName);
        if (!hasBucket) {
          await supabaseAdmin.storage.createBucket(bucketName, { public: true });
        }

        for (const file of files) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const ext = file.name.split('.').pop() || 'jpg';
          const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${sanitized}`;

          const { error: uploadErr } = await supabaseAdmin.storage
            .from(bucketName)
            .upload(fileName, buffer, {
              contentType: file.type,
              upsert: true,
            });

          if (!uploadErr) {
            const { data: publicUrlData } = supabaseAdmin.storage
              .from(bucketName)
              .getPublicUrl(fileName);

            if (publicUrlData?.publicUrl) {
              urls.push(publicUrlData.publicUrl);
              storageEngine = 'supabase';
            }
          }
        }
      } catch (sbErr) {
        console.warn('Supabase Storage upload warning, falling back to local storage:', sbErr);
      }
    }

    // If Supabase wasn't used or some files were not handled, save to local /public/uploads/
    if (urls.length < files.length) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const remainingFiles = files.slice(urls.length);

      for (const file of remainingFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const originalName = file.name || 'product-image.jpg';
        const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${sanitizedName}`;
        const filePath = path.join(uploadDir, uniqueName);

        await writeFile(filePath, buffer);
        urls.push(`/uploads/${uniqueName}`);
      }
    }

    return NextResponse.json({
      success: true,
      urls,
      storage: storageEngine,
      count: urls.length,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process image upload.' },
      { status: 500 }
    );
  }
}
