'use client';
import { signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

export default function AuthButtonClient({ session }: { session: Session | null }) {
  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-300">{session.user?.name}</span>
        <button 
          onClick={() => signOut()}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <button 
      onClick={() => signIn('credentials')}
      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10 text-sm font-medium"
    >
      Sign In
    </button>
  );
}
