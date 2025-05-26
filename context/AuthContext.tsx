"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthUser = {
  github?: {
    username: string;
    token?: string;
  };
  leetcode?: {
    username: string;
    token?: string;
  };
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGitHub: (username: string) => Promise<void>;
  signInWithLeetCode: (username: string) => Promise<void>;
  signOut: (provider?: 'github' | 'leetcode') => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const githubUsername = localStorage.getItem('github_username');
    const leetcodeUsername = localStorage.getItem('leetcode_username');
    
    const userData: AuthUser = {};
    
    if (githubUsername) {
      userData.github = { username: githubUsername };
    }
    
    if (leetcodeUsername) {
      userData.leetcode = { username: leetcodeUsername };
    }
    
    if (Object.keys(userData).length > 0) {
      setUser(userData);
    } else {
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  const signInWithGitHub = async (username: string): Promise<void> => {
    try {
      // In a real app, you would perform OAuth authentication
      // For demo purposes, we're just storing the username
      localStorage.setItem('github_username', username);
      
      setUser((prevUser) => ({
        ...prevUser,
        github: { username }
      }));
    } catch (error) {
      console.error('GitHub authentication error:', error);
      throw error;
    }
  };

  const signInWithLeetCode = async (username: string): Promise<void> => {
    try {
      // In a real app, you would perform OAuth authentication
      // For demo purposes, we're just storing the username
      localStorage.setItem('leetcode_username', username);
      
      setUser((prevUser) => ({
        ...prevUser,
        leetcode: { username }
      }));
    } catch (error) {
      console.error('LeetCode authentication error:', error);
      throw error;
    }
  };

  const signOut = (provider?: 'github' | 'leetcode') => {
    if (!provider) {
      // Sign out from all providers
      localStorage.removeItem('github_username');
      localStorage.removeItem('leetcode_username');
      setUser(null);
    } else if (provider === 'github') {
      localStorage.removeItem('github_username');
      setUser((prevUser) => {
        if (!prevUser) return null;
        
        const newUser = { ...prevUser };
        delete newUser.github;
        
        return Object.keys(newUser).length > 0 ? newUser : null;
      });
    } else if (provider === 'leetcode') {
      localStorage.removeItem('leetcode_username');
      setUser((prevUser) => {
        if (!prevUser) return null;
        
        const newUser = { ...prevUser };
        delete newUser.leetcode;
        
        return Object.keys(newUser).length > 0 ? newUser : null;
      });
    }
  };

  const isAuthenticated = user !== null && (user.github !== undefined || user.leetcode !== undefined);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signInWithGitHub, 
      signInWithLeetCode, 
      signOut,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 