'use client';

import { useState } from 'react';
import GitHubDashboard from '@/components/github/GitHubDashboard';
import LeetCodeDashboard from '@/components/leetcode/LeetCodeDashboard';
import AuthGuard from '@/components/auth/AuthGuard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export default function DashboardClient() {
  const [expandedSection, setExpandedSection] = useState<'github' | 'leetcode' | 'collaboration' | 'chat' | null>(null);

  const toggleExpandSection = (section: 'github' | 'leetcode' | 'collaboration' | 'chat') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <section className="h-screen w-full flex flex-col" style={{ backgroundColor: '#e8d5b9' }}>
          <div className="flex-1 relative overflow-hidden">
            {expandedSection ? (
              <div className="size-full p-4">
                <div className="w-full h-full rounded-3xl p-4 shadow-lg" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
                  {expandedSection === 'github' && (
                    <GitHubDashboard 
                      onExpand={() => toggleExpandSection('github')} 
                      isExpanded={true} 
                    />
                  )}
                  {expandedSection === 'leetcode' && (
                    <LeetCodeDashboard 
                      onExpand={() => toggleExpandSection('leetcode')} 
                      isExpanded={true} 
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="size-full p-3 flex flex-col gap-3">
                {/* Top row with GitHub and LeetCode */}
                <div className="flex gap-3 h-full">
                  {/* GitHub Dashboard */}
                  <div className="flex-1 rounded-3xl p-3 shadow-lg h-full" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
                    <GitHubDashboard onExpand={() => toggleExpandSection('github')} />
                  </div>
                  
                  {/* LeetCode Dashboard */}
                  <div className="flex-1 rounded-3xl p-3 shadow-lg h-full" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
                    <LeetCodeDashboard onExpand={() => toggleExpandSection('leetcode')} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </AuthGuard>
    </QueryClientProvider>
  );
} 