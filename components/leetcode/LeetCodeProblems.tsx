'use client';

import { useState } from 'react';
import { LeetCodeProblem } from '@/types/leetcode';
import { Circle, ExternalLink, Check, Search } from 'lucide-react';

interface LeetCodeProblemsProps {
  problems: LeetCodeProblem[];
}

export default function LeetCodeProblems({ problems }: LeetCodeProblemsProps) {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = 
      difficultyFilter === 'all' || 
      problem.difficulty.toLowerCase() === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === 'easy') return 'text-green-600';
    if (lowerDifficulty === 'medium') return 'text-yellow-600';
    if (lowerDifficulty === 'hard') return 'text-red-600';
    return 'text-[#5c4a32]';
  };

  const getDifficultyBgColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === 'easy') return 'bg-green-100';
    if (lowerDifficulty === 'medium') return 'bg-yellow-100';
    if (lowerDifficulty === 'hard') return 'bg-red-100';
    return 'bg-gray-100';
  };

  // const getDifficultyCircle = (difficulty: string) => {
  //   const lowerDifficulty = difficulty.toLowerCase();
  //   if (lowerDifficulty === 'easy') return <Circle size={8} className="fill-green-500 text-green-500" />;
  //   if (lowerDifficulty === 'medium') return <Circle size={8} className="fill-yellow-500 text-yellow-500" />;
  //   if (lowerDifficulty === 'hard') return <Circle size={8} className="fill-red-500 text-red-500" />;
  //   return <Circle size={8} className="fill-gray-500 text-gray-500" />;
  // };

  return (
    <div>
      <div className="mb-3 space-y-2">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#b39f84]/50 bg-white/80 text-[#5c4a32] placeholder-[#5c4a32]/50 focus:outline-none focus:ring-1 focus:ring-[#b39f84]"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#5c4a32]/60" />
        </div>
        
        {/* Difficulty filters */}
        <div className="flex gap-1 text-[10px]">
          <button
            onClick={() => setDifficultyFilter('all')}
            className={`px-2 py-1 rounded-full ${difficultyFilter === 'all' ? 'bg-[#b39f84] text-white' : 'bg-[#b39f84]/20 text-[#5c4a32]'}`}
          >
            All
          </button>
          <button
            onClick={() => setDifficultyFilter('easy')}
            className={`px-2 py-1 rounded-full flex items-center gap-1 ${
              difficultyFilter === 'easy' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
            }`}
          >
            <Circle size={6} className="fill-current" />
            Easy
          </button>
          <button
            onClick={() => setDifficultyFilter('medium')}
            className={`px-2 py-1 rounded-full flex items-center gap-1 ${
              difficultyFilter === 'medium' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            <Circle size={6} className="fill-current" />
            Medium
          </button>
          <button
            onClick={() => setDifficultyFilter('hard')}
            className={`px-2 py-1 rounded-full flex items-center gap-1 ${
              difficultyFilter === 'hard' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
            }`}
          >
            <Circle size={6} className="fill-current" />
            Hard
          </button>
        </div>
      </div>
      
      {filteredProblems.length === 0 ? (
        <div className="text-center py-6 text-[#5c4a32]/70 text-sm">
          No problems found matching the criteria
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
          {filteredProblems.map((problem) => (
            <div 
              key={problem.id} 
              className="p-2 rounded-lg bg-white/40 border border-[#b39f84]/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${getDifficultyBgColor(problem.difficulty)} border ${getDifficultyColor(problem.difficulty)}`}></div>
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#5c4a32] hover:underline flex items-center"
                >
                  {problem.title}
                  {problem.isPaidOnly && (
                    <span className="ml-1 px-1 py-0.5 text-[8px] bg-amber-100 text-amber-800 rounded">
                      Premium
                    </span>
                  )}
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#b39f84]/20 text-[#5c4a32]">
                  {typeof problem.acceptanceRate === 'number' 
                    ? `${problem.acceptanceRate.toFixed(1)}%`
                    : problem.acceptanceRate}
                </span>
                
                {problem.status === 'ac' && (
                  <Check size={12} className="text-green-500" />
                )}
                
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5c4a32]/60 hover:text-[#5c4a32]"
                >
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 