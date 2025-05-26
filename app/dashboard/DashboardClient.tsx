'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import GitHubDashboard from '@/components/github/GitHubDashboard';
import LeetCodeDashboard from '@/components/leetcode/LeetCodeDashboard';
import AuthGuard from '@/components/auth/AuthGuard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MessageSquare, Users, Home, FileText, Sun } from 'lucide-react';

// Create a client
const queryClient = new QueryClient();

export default function DashboardClient() {
  const [expandedSection, setExpandedSection] = useState<'github' | 'leetcode' | 'collaboration' | 'chat' | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'docs' | 'theme'>('home');

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
                  {expandedSection === 'collaboration' && (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between pb-1">
                        <h2 className="text-base font-bold text-[#5c4a32] flex items-center">
                          <Users size={16} className="mr-1" />
                          Collaboration Dashboard
                        </h2>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-[#5c4a32]/70">
                        <p>Collaboration features coming soon</p>
                      </div>
                    </div>
                  )}
                  {expandedSection === 'chat' && (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between pb-1">
                        <h2 className="text-base font-bold text-[#5c4a32] flex items-center">
                          <MessageSquare size={16} className="mr-1" />
                          Chat Dashboard
                        </h2>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-[#5c4a32]/70">
                        <p>Chat features coming soon</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="size-full p-3 flex flex-col gap-3">
                {/* Top row with GitHub and LeetCode */}
                <div className="flex gap-3">
                  {/* GitHub Dashboard */}
                  <div className="flex-1 rounded-3xl p-3 shadow-lg" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
                    <GitHubDashboard onExpand={() => toggleExpandSection('github')} />
                  </div>
                  
                  {/* LeetCode Dashboard */}
                  <div className="flex-1 rounded-3xl p-3 shadow-lg" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
                    <LeetCodeDashboard onExpand={() => toggleExpandSection('leetcode')} />
                  </div>
                </div>
                
                {/* Middle row with Collaboration */}
                <div className="flex-1 rounded-3xl p-3 shadow-lg" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
                  <div className="flex items-center justify-between pb-1">
                    <h2 className="text-base font-bold text-[#5c4a32] flex items-center">
                      <Users size={16} className="mr-1" />
                      Implement Collaboration Feature
                    </h2>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-[#5c4a32]/70 cursor-pointer" onClick={() => toggleExpandSection('collaboration')}>
                    <p>Coming soon</p>
                  </div>
                </div>
                
                {/* Bottom row with Chat */}
                <div className="h-16 rounded-3xl p-3 shadow-lg" style={{ backgroundColor: '#d9c6a8', border: '2px solid #b39f84' }}>
                  <div className="flex items-center justify-between h-full">
                    <h2 className="text-base font-bold text-[#5c4a32] flex items-center">
                      <MessageSquare size={16} className="mr-1" />
                      Implement Chat Feature
                    </h2>
                    <button 
                      className="text-[#5c4a32]/70 hover:text-[#5c4a32] transition-colors"
                      onClick={() => toggleExpandSection('chat')}
                    >
                      <p>Coming soon</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation Footer */}
          <div className="h-16 flex justify-center items-center px-3">
            <div 
              className="flex items-center justify-around bg-[#d9c6a8] border-2 border-[#b39f84] rounded-full shadow-lg px-4 py-2 space-x-6"
            >
              <button 
                className={`p-2 rounded-full ${activeTab === 'home' ? 'bg-[#b39f84]' : 'hover:bg-[#b39f84]/30'}`}
                onClick={() => setActiveTab('home')}
              >
                <Home size={20} className="text-[#5c4a32]" />
              </button>
              <button 
                className={`p-2 rounded-full ${activeTab === 'docs' ? 'bg-[#b39f84]' : 'hover:bg-[#b39f84]/30'}`}
                onClick={() => setActiveTab('docs')}
              >
                <FileText size={20} className="text-[#5c4a32]" />
              </button>
              <button 
                className={`p-2 rounded-full ${activeTab === 'theme' ? 'bg-[#b39f84]' : 'hover:bg-[#b39f84]/30'}`}
                onClick={() => setActiveTab('theme')}
              >
                <Sun size={20} className="text-[#5c4a32]" />
              </button>
            </div>
          </div>
        </section>
      </AuthGuard>
    </QueryClientProvider>
  );
} 