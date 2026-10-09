import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const publicKeys = await prisma.uIComponent.findMany({
    where: {
      isPublic: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Community UIKeys</h1>
          <p className="text-gray-400">Discover and clone open-source UI components shared by the community.</p>
        </div>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {publicKeys.length === 0 ? (
          <div className="col-span-full w-full text-center py-20 text-gray-500">
            No public UIKeys found.
          </div>
        ) : (
          publicKeys.map((key) => {
            let sourceWebsite = "Unknown Source";
            try {
              const payloadObj = JSON.parse(key.payload);
              sourceWebsite = payloadObj.url || payloadObj.sourceWebsite || payloadObj.source || "Extracted Component";
            } catch (e) {
              // ignore
            }

            return (
              <div 
                key={key.id} 
                className="break-inside-avoid bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col gap-4 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-400 font-mono mb-1">
                      {key.shortId}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-1" title={sourceWebsite}>
                      {sourceWebsite}
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-500 font-mono">
                    {key.createdAt.toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                  <Link 
                    href={`/k/${key.shortId}`}
                    className="flex-1 text-center py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white rounded-xl transition-colors"
                  >
                    View
                  </Link>
                  <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                    Clone
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
