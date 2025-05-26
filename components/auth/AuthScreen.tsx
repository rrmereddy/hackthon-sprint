'use client';

import { useState } from 'react';
import { Github, Code, User, LockKeyhole, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthScreen() {
  const { signInWithGitHub, signInWithLeetCode } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [provider, setProvider] = useState<'github' | 'leetcode' | null>(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    setIsSigningIn(true);
    
    try {
      if (provider === 'github') {
        await signInWithGitHub(username);
      } else if (provider === 'leetcode') {
        await signInWithLeetCode(username);
      }
      
      // Reset form
      setUsername('');
      setProvider(null);
      setError('');
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const startSignIn = (providerType: 'github' | 'leetcode') => {
    setProvider(providerType);
    setError('');
  };

  const cancelSignIn = () => {
    setProvider(null);
    setUsername('');
    setError('');
  };

  if (provider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#e8d5b9' }}>
        <div className="w-full max-w-md p-8 rounded-3xl shadow-lg" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
          <div className="flex items-center mb-6">
            {provider === 'github' ? (
              <Github size={28} className="text-[#5c4a32] mr-3" />
            ) : (
              <Code size={28} className="text-[#5c4a32] mr-3" />
            )}
            <h2 className="text-2xl font-bold text-[#5c4a32]">
              Sign in with {provider === 'github' ? 'GitHub' : 'LeetCode'}
            </h2>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#5c4a32] mb-1">
                Enter your {provider === 'github' ? 'GitHub' : 'LeetCode'} username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-[#5c4a32]/60" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-[#b39f84] bg-white/90 text-[#5c4a32] placeholder-[#5c4a32]/40 focus:outline-none focus:ring-2 focus:ring-[#b39f84]"
                  placeholder={`Enter ${provider === 'github' ? 'GitHub' : 'LeetCode'} username`}
                  disabled={isSigningIn}
                  autoFocus
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              <p className="mt-2 text-xs text-[#5c4a32]/70">
                Note: For demo purposes, you can enter any username. No actual authentication is performed.
              </p>
            </div>
            
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={cancelSignIn}
                className="px-4 py-2 text-[#5c4a32] hover:underline focus:outline-none"
                disabled={isSigningIn}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#5c4a32] text-white rounded-md hover:bg-[#4a3a28] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSigningIn}
              >
                {isSigningIn ? (
                  <>
                    <span className="animate-spin">◌</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#e8d5b9' }}>
      <div className="w-full max-w-md p-8 rounded-3xl shadow-lg" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5c4a32]">Developer Dashboard</h1>
          <p className="mt-2 text-[#5c4a32]/80">
            Sign in to access your coding profile and statistics
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => startSignIn('github')}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white hover:bg-white/90 transition-colors border border-[#b39f84]"
          >
            <div className="flex items-center">
              <Github size={24} className="text-[#333]" />
              <span className="ml-3 font-medium text-[#5c4a32]">Sign in with GitHub</span>
            </div>
            <LockKeyhole size={16} className="text-[#5c4a32]/60" />
          </button>
          
          <button
            onClick={() => startSignIn('leetcode')}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white hover:bg-white/90 transition-colors border border-[#b39f84]"
          >
            <div className="flex items-center">
              <Code size={24} className="text-[#f89f1b]" />
              <span className="ml-3 font-medium text-[#5c4a32]">Sign in with LeetCode</span>
            </div>
            <LockKeyhole size={16} className="text-[#5c4a32]/60" />
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-[#5c4a32]/70">
            Sign in to at least one service to continue
          </p>
          <p className="mt-2 text-xs text-[#5c4a32]/50">
            Your data stays local and is only used to display your dashboard
          </p>
        </div>
      </div>
    </div>
  );
} 