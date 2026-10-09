import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { isPublic } = body;

    if (typeof isPublic !== 'boolean') {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const component = await prisma.uIComponent.findUnique({
      where: { id },
    });

    if (!component) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Ensure the user owns the key
    if (component.userId !== session.user.email) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const updated = await prisma.uIComponent.update({
      where: { id },
      data: { isPublic },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating UIKey visibility:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
