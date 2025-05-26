'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthScreen from './AuthScreen';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

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
      {children}
    </div>
  );
} 