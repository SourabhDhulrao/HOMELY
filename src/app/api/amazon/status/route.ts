import { NextResponse } from 'next/server';
import { getCreatorsApiConfig, isAmazonApiConfigured } from '@/lib/amazonCreatorsApi';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const config = getCreatorsApiConfig();
  const configured = isAmazonApiConfigured();

  return NextResponse.json({
    mode: configured ? 'Mode 2: Amazon Creators API Mode' : 'Mode 1: Manual Product Mode',
    isAmazonConfigured: configured,
    marketplace: config.marketplace,
    partnerTag: config.partnerTag,
    apiVersion: config.version,
    hasClientId: Boolean(config.clientId),
    hasClientSecret: Boolean(config.clientSecret),
    isSupabaseConfigured,
    message: configured
      ? 'Amazon Creators API credentials active. Live search & import enabled.'
      : 'Operating in Manual Product Mode. System is fully functional without credentials. Add AMAZON_CREATOR_CLIENT_ID and AMAZON_CREATOR_CLIENT_SECRET to enable live API.',
  });
}

