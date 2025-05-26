'use client';

import { LeetCodeStats as LeetCodeStatsType } from '@/types/leetcode';
import { CheckCircle, Circle, Medal, BarChart3, Zap, Trophy, Award, CheckCircle2 } from 'lucide-react';

interface LeetCodeStatsCardProps {
  stats: LeetCodeStatsType;
}

export default function LeetCodeStatsCard({ stats }: LeetCodeStatsCardProps) {
  const calculateProgressPercentage = (solved: number, total: number) => {
    return Math.round((solved / total) * 100);
  };

  const renderProgressBar = (solved: number, total: number, difficulty: 'easy' | 'medium' | 'hard') => {
    const percentage = calculateProgressPercentage(solved, total);
    const colors = {
      easy: {
        bg: 'bg-green-100',
        fill: 'bg-green-500',
        text: 'text-green-700'
      },
      medium: {
        bg: 'bg-yellow-100',
        fill: 'bg-yellow-500',
        text: 'text-yellow-700'
      },
      hard: {
        bg: 'bg-red-100',
        fill: 'bg-red-500',
        text: 'text-red-700'
      }
    };
    
    return (
      <div className={`w-full h-2 ${colors[difficulty].bg} rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${colors[difficulty].fill}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="bg-[#c9b698]/30 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[#5c4a32]">Problem Solving Stats</h3>
        <div className="flex items-center text-xs text-[#5c4a32]">
          <Trophy size={12} className="mr-1" />
          <span>Rank: {stats.ranking.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/40 p-2 rounded-lg">
          <div className="text-xs text-[#5c4a32] flex justify-between items-center mb-1">
            <span className="font-medium">Solved</span>
            <span>{stats.totalSolved} / {stats.totalQuestions}</span>
          </div>
          <div className="w-full h-1.5 bg-[#b39f84]/30 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-[#b39f84]" 
              style={{ width: `${calculateProgressPercentage(stats.totalSolved, stats.totalQuestions)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white/40 p-2 rounded-lg">
          <div className="text-xs text-[#5c4a32] flex justify-between items-center mb-1">
            <span className="font-medium">Acceptance Rate</span>
            <span>{typeof stats.acceptanceRate === 'number' ? stats.acceptanceRate.toFixed(1) : stats.acceptanceRate}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#b39f84]/30 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-[#b39f84]" 
              style={{ width: `${stats.acceptanceRate}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex flex-col items-center bg-white/40 p-2 rounded-lg">
          <Circle size={12} className="mb-1 fill-green-500 text-green-500" />
          <span className="font-medium text-[#5c4a32]">Easy</span>
          <span className="text-green-600">{stats.easySolved} / {stats.easyTotal}</span>
        </div>
        
        <div className="flex flex-col items-center bg-white/40 p-2 rounded-lg">
          <Circle size={12} className="mb-1 fill-yellow-500 text-yellow-500" />
          <span className="font-medium text-[#5c4a32]">Medium</span>
          <span className="text-yellow-600">{stats.mediumSolved} / {stats.mediumTotal}</span>
        </div>
        
        <div className="flex flex-col items-center bg-white/40 p-2 rounded-lg">
          <Circle size={12} className="mb-1 fill-red-500 text-red-500" />
          <span className="font-medium text-[#5c4a32]">Hard</span>
          <span className="text-red-600">{stats.hardSolved} / {stats.hardTotal}</span>
        </div>
      </div>
    </div>
  );
} 