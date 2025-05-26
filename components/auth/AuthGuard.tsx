'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthScreen from './AuthScreen';
import { LogOut } from 'lucide-react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, signOut, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#e8d5b9' }}>
        <div className="p-8 rounded-3xl shadow-lg animate-pulse" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
          <p className="text-[#5c4a32]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {user?.github && (
          <div className="flex items-center bg-[#b39f84]/70 text-[#5c4a32] px-3 py-1 rounded-full text-sm">
            <span className="mr-1">GitHub:</span>
            <span className="font-medium">{user.github.username}</span>
          </div>
        )}
        {user?.leetcode && (
          <div className="flex items-center bg-[#b39f84]/70 text-[#5c4a32] px-3 py-1 rounded-full text-sm">
            <span className="mr-1">LeetCode:</span>
            <span className="font-medium">{user.leetcode.username}</span>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="p-2 rounded-full bg-[#b39f84] text-[#5c4a32] hover:bg-[#a39074] transition-colors"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
      {children}
    </div>
  );
} 