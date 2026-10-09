import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const mockData = [
    { id: '8f92a2', source: 'stripe.com/pricing', date: '2026-10-09' },
    { id: 'b3a4f1', source: 'github.com/dashboard', date: '2026-10-08' },
    { id: 'c9d8e7', source: 'linear.app/features', date: '2026-10-07' },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your UI Keys</h1>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
          New Extraction
        </button>
      </div>

      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 border-b border-white/10 text-sm font-medium text-gray-400">
              <th className="px-6 py-4">Short ID</th>
              <th className="px-6 py-4">Source Website</th>
              <th className="px-6 py-4">Date Created</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 text-indigo-400 font-mono">
                  <Link href={`/k/${row.id}`} target="_blank" className="hover:underline">
                    {row.id}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-300">{row.source}</td>
                <td className="px-6 py-4 text-gray-400">{row.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-gray-300 rounded-lg transition-colors">
                    Copy AI Prompt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
