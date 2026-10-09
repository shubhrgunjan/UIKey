import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import VisualEditorClient from './VisualEditorClient';

export default async function EditKeyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const component = await prisma.uIComponent.findFirst({
    where: {
      OR: [{ id }, { shortId: id }],
    },
  });

  if (!component) {
    notFound();
  }

  // Format the payload pretty for the editor
  let initialPayloadStr = component.payload;
  try {
    const obj = JSON.parse(component.payload);
    initialPayloadStr = JSON.stringify(obj, null, 2);
  } catch (e) {
    // leave as is
  }

  return (
    <VisualEditorClient 
      componentId={component.id} 
      initialPayloadStr={initialPayloadStr} 
    />
  );
}
