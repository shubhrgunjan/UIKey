import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function generateShortId(length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const shortId = generateShortId(6);

    // Save to database
    await prisma.uIComponent.create({
      data: {
        shortId,
        payload: JSON.stringify(payload),
      },
    });

    return NextResponse.json({ url: `uikey.dev/k/${shortId}` });
  } catch (error) {
    console.error('Error in ingest route:', error);
    return NextResponse.json({ error: 'Failed to ingest component' }, { status: 500 });
  }
}
