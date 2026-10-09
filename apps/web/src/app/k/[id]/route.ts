import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Next.js app router dynamic params need to be awaited in the latest canary, 
    // but destructuring is fine for Next.js 14-. We assume Next.js 14+ standard behavior here.
    const { id } = await params;

    const component = await prisma.uIComponent.findUnique({
      where: { shortId: id },
    });

    if (!component) {
      return new NextResponse('Not found', { status: 404 });
    }

    const data = JSON.parse(component.payload);

    // If we have an extractor package with generateAIPrompt, we would use it here.
    // For now, we return a formatted raw markdown representation.
    let markdown = `# UI Component: ${id}\n\n`;
    
    if (typeof data === 'object' && data !== null) {
      markdown += '```json\n';
      markdown += JSON.stringify(data, null, 2);
      markdown += '\n```\n';
    } else {
      markdown += data;
    }

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error fetching component:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
