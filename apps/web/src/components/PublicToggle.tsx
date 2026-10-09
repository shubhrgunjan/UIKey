'use client';

import { useState } from 'react';

export default function PublicToggle({ id, initialIsPublic }: { id: string, initialIsPublic: boolean }) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic })
      });
      if (res.ok) {
        setIsPublic(!isPublic);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={toggle} 
        disabled={isLoading}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
          isPublic ? 'bg-indigo-600' : 'bg-white/20'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={isPublic ? "Make Private" : "Make Public"}
      >
        <span 
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            isPublic ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm text-gray-400 w-16">
        {isPublic ? 'Public' : 'Private'}
      </span>
    </div>
  );
}
