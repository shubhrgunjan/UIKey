import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function KeyPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params in Next.js 15
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const component = await prisma.uIComponent.findUnique({
    where: { shortId: id },
  });

  if (!component) {
    notFound();
  }

  let data;
  try {
    data = JSON.parse(component.payload);
  } catch (e) {
    data = component.payload;
  }

  // Mocked extraction logic
  const colors = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
  const typography = [
    { label: 'Heading 1', size: '48px', weight: '700' },
    { label: 'Heading 2', size: '32px', weight: '600' },
    { label: 'Body Text', size: '16px', weight: '400' },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-8 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-6">
          Key: {id}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Extracted UI Component</h1>
        <p className="text-gray-400 text-lg">Visual Design System & Payload Data</p>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column: Design Tokens */}
        <div className="space-y-12">
          {/* Colors */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Colors</h2>
            <div className="flex flex-wrap gap-4">
              {colors.map((hex, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-16 h-16 rounded-full shadow-lg shadow-black/50 border border-white/10"
                    style={{ backgroundColor: hex }}
                  ></div>
                  <span className="text-xs font-mono text-gray-400">{hex}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Typography</h2>
            <div className="space-y-4">
              {typography.map((type, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-900 border border-white/5 rounded-xl">
                  <div>
                    <div className="text-white font-medium">{type.label}</div>
                    <div className="text-gray-500 text-sm">{type.weight} weight</div>
                  </div>
                  <div className="text-2xl text-indigo-400 font-mono">{type.size}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Payload Data */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Compressed Payload</h2>
          <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-white/10">
              <span className="text-xs font-medium text-gray-400">payload.json</span>
              <button className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors">
                Copy JSON
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 h-[500px] overflow-y-auto">
              {typeof data === 'object' ? JSON.stringify(data, null, 2) : data}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
