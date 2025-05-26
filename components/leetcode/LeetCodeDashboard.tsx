'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchLeetCodeStats, fetchLeetCodeSubmissions, fetchLeetCodeProblems, fetchLeetCodeUserProfile } from '@/server/leetcodeService';
import { Loader2, AlertCircle, Code, Maximize2, Minimize2, ChevronRight, ChevronDown, CheckCircle, Circle, Trophy } from 'lucide-react';
import LeetCodeStatsCard from './LeetCodeStats';
import LeetCodeSubmissions from './LeetCodeSubmissions';
import LeetCodeProblems from './LeetCodeProblems';

interface LeetCodeDashboardProps {
  onExpand?: () => void;
  isExpanded?: boolean;
}

export default function LeetCodeDashboard({ onExpand, isExpanded }: LeetCodeDashboardProps) {
  const { user } = useAuth();
  const [expandedSection, setExpandedSection] = useState<'submissions' | 'problems' | null>(null);
  
  const username = user?.leetcode?.username || 'demo_user';
  
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['leetcode-profile', username],
    queryFn: () => fetchLeetCodeUserProfile(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['leetcode-stats', username],
    queryFn: () => fetchLeetCodeStats(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: submissions, isLoading: isLoadingSubmissions, error: submissionsError } = useQuery({
    queryKey: ['leetcode-submissions', username],
    queryFn: () => fetchLeetCodeSubmissions(username, 15),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: problems, isLoading: isLoadingProblems, error: problemsError } = useQuery({
    queryKey: ['leetcode-problems', username],
    queryFn: () => fetchLeetCodeProblems(username, 30),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = isLoadingProfile || isLoadingStats || isLoadingSubmissions || isLoadingProblems;
  const error = statsError || submissionsError || problemsError;

  const toggleSection = (section: 'submissions' | 'problems') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-[#5c4a32]/70">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <p>Loading LeetCode data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-red-500 max-w-xs mx-auto text-center">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="mb-1">Failed to load LeetCode data</p>
          <p className="text-sm text-red-400">{(error as Error).message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  if (!stats || !submissions || !problems) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-[#5c4a32]/70">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>No LeetCode data available</p>
        </div>
      </div>
    );
  }

  if (!isExpanded) {
    const calculateProgressPercentage = (solved: number, total: number) => {
      return Math.round((solved / total) * 100);
    };
    
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-base font-bold text-[#5c4a32] flex items-center">
            <Code size={16} className="mr-1" />
            LeetCode Dashboard
          </h2>
          
          <button 
            onClick={onExpand}
            className="p-1 rounded-md hover:bg-[#b39f84]/30 text-[#5c4a32] transition-colors"
            title="Expand"
          >
            <Maximize2 size={14} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="bg-[#c9b698]/30 rounded-xl p-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[10px] font-semibold text-[#5c4a32]">Problem Solving</h3>
              <div className="flex items-center">
                <Trophy size={8} className="text-[#5c4a32] mr-1" />
                <span className="text-[10px] text-[#5c4a32]">Rank: {stats.ranking.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="text-[10px] text-[#5c4a32] flex justify-between mb-1">
              <span>Problems Solved:</span>
              <span className="font-medium">{stats.totalSolved} / {stats.totalQuestions}</span>
            </div>
            
            <div className="w-full h-1.5 bg-[#b39f84]/30 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-[#b39f84]" 
                style={{ width: `${calculateProgressPercentage(stats.totalSolved, stats.totalQuestions)}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-3 gap-1 text-[8px]">
              <div className="flex items-center text-green-600">
                <Circle size={6} className="mr-1 fill-green-500 text-green-500" />
                <span>Easy: {stats.easySolved}</span>
              </div>
              <div className="flex items-center text-yellow-600">
                <Circle size={6} className="mr-1 fill-yellow-500 text-yellow-500" />
                <span>Medium: {stats.mediumSolved}</span>
              </div>
              <div className="flex items-center text-red-600">
                <Circle size={6} className="mr-1 fill-red-500 text-red-500" />
                <span>Hard: {stats.hardSolved}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#c9b698]/30 rounded-xl p-2">
            <h3 className="text-[10px] font-semibold text-[#5c4a32] mb-1">Recent Submissions</h3>
            <div className="space-y-1">
              {submissions.slice(0, 3).map((submission, idx) => (
                <div key={idx} className="flex items-center text-[10px] p-1 rounded bg-white/40">
                  <div 
                    className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      submission.status === 'Accepted' ? 'bg-green-500' : 
                      submission.status === 'Wrong Answer' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                  />
                  <div className="flex-1 truncate">
                    <span className="font-medium text-[#5c4a32] truncate">{submission.problemName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-base font-bold text-[#5c4a32] flex items-center">
          <Code size={16} className="mr-1" />
          LeetCode Dashboard
          {profile && (
            <span className="ml-1 text-xs font-normal text-[#5c4a32]/70">
              @{profile.username}
            </span>
          )}
        </h2>
        
        <button 
          onClick={onExpand}
          className="p-1 rounded-md hover:bg-[#b39f84]/30 text-[#5c4a32] transition-colors"
          title="Minimize"
        >
          <Minimize2 size={14} />
        </button>
      </div>
      
      <div className="flex-1 max-h-full overflow-auto space-y-2">
        <LeetCodeStatsCard stats={stats} />
        
        <div className="bg-[#c9b698]/30 rounded-xl">
          <button 
            className="w-full px-3 py-2 flex items-center justify-between text-left"
            onClick={() => toggleSection('submissions')}
          >
            <h2 className="text-xs font-semibold text-[#5c4a32]">Recent Submissions</h2>
            {expandedSection === 'submissions' ? (
              <ChevronDown size={14} className="text-[#5c4a32]" />
            ) : (
              <ChevronRight size={14} className="text-[#5c4a32]" />
            )}
          </button>
          
          {expandedSection === 'submissions' && (
            <div className="px-3 pb-3">
              <LeetCodeSubmissions submissions={submissions} />
            </div>
          )}
        </div>
        
        <div className="bg-[#c9b698]/30 rounded-xl">
          <button 
            className="w-full px-3 py-2 flex items-center justify-between text-left"
            onClick={() => toggleSection('problems')}
          >
            <h2 className="text-xs font-semibold text-[#5c4a32]">Problem Collection</h2>
            {expandedSection === 'problems' ? (
              <ChevronDown size={14} className="text-[#5c4a32]" />
            ) : (
              <ChevronRight size={14} className="text-[#5c4a32]" />
            )}
          </button>
          
          {expandedSection === 'problems' && (
            <div className="px-3 pb-3">
              <LeetCodeProblems problems={problems} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 