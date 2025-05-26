'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchGitHubUser, fetchGitHubRepositories, generateMockContributions, GitHubRepository } from '@/server/githubService';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle, Github, Maximize2, Minimize2, ChevronLeft, ExternalLink, Users, Calendar, Star } from 'lucide-react';
import GitHubOverview from './GitHubOverview';
import GitHubRepositories from './GitHubRepositories';
import GitHubContributions from './GitHubContributions';
import Image from 'next/image';

interface GitHubDashboardProps {
  onExpand?: () => void;
  isExpanded?: boolean;
}

export default function GitHubDashboard({ onExpand, isExpanded }: GitHubDashboardProps) {
  const { user } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  
  const username = user?.github?.username || 'octocat';
  
  const { data: githubUser, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['github-user', username],
    queryFn: () => fetchGitHubUser(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: repositories, isLoading: isLoadingRepos, error: reposError } = useQuery({
    queryKey: ['github-repos', username],
    queryFn: () => fetchGitHubRepositories(username, 30),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // For contributions, we generate mock data using React Query
  const { data: contributions = [], isLoading: isLoadingContributions, error: contributionsError } = useQuery({
    queryKey: ['github-contributions', username],
    queryFn: () => generateMockContributions(90),
    enabled: true,
    staleTime: 60 * 60 * 1000, // 1 hour since this is mock data
  });

  const isLoading = isLoadingUser || isLoadingRepos || isLoadingContributions;
  const error = userError || reposError || contributionsError;

  const closeRepoDetails = () => {
    setSelectedRepo(null);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-[#5c4a32]/70">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <p>Loading GitHub data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-red-500 max-w-xs mx-auto text-center">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="mb-1">Failed to load GitHub data</p>
          <p className="text-sm text-red-400">{(error as Error).message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  if (selectedRepo) {
    return (
      <div className="h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between bg-[#c9b698]/50 p-3 rounded-t-xl">
          <button 
            onClick={closeRepoDetails}
            className="flex items-center text-[#5c4a32] hover:text-[#4a3a28] transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            <span>Back to repositories</span>
          </button>
          
          <h2 className="text-lg font-semibold text-[#5c4a32]">{selectedRepo.name}</h2>
          
          <a
            href={selectedRepo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5c4a32] hover:text-[#4a3a28] transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-[#c9b698]/30">
          <div className="bg-white/90 rounded-lg p-4 border border-[#b39f84]/50 mb-4">
            <h3 className="font-medium text-[#5c4a32] mb-2">Repository Information</h3>
            <p className="text-[#5c4a32]/80 text-sm mb-4">{selectedRepo.description || 'No description provided'}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#5c4a32]/60">Owner</p>
                <div className="flex items-center mt-1">
                  <Image
                    src={selectedRepo.owner.avatar_url} 
                    alt={selectedRepo.owner.login}
                    width={50}
                    height={50}
                    className="w-5 h-5 rounded-full mr-2"
                  />
                  <a
                    href={selectedRepo.owner.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5c4a32] hover:underline"
                  >
                    {selectedRepo.owner.login}
                  </a>
                </div>
              </div>
              
              <div>
                <p className="text-[#5c4a32]/60">Created</p>
                <p className="mt-1">{new Date(selectedRepo.created_at).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-[#5c4a32]/60">Last Update</p>
                <p className="mt-1">{new Date(selectedRepo.updated_at).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-[#5c4a32]/60">Language</p>
                <p className="mt-1">{selectedRepo.language || 'Not specified'}</p>
              </div>
              
              <div>
                <p className="text-[#5c4a32]/60">Stars</p>
                <p className="mt-1">{selectedRepo.stargazers_count}</p>
              </div>
              
              <div>
                <p className="text-[#5c4a32]/60">Forks</p>
                <p className="mt-1">{selectedRepo.forks_count}</p>
              </div>
            </div>
          </div>
          
          {selectedRepo.topics && selectedRepo.topics.length > 0 && (
            <div className="bg-white/90 rounded-lg p-4 border border-[#b39f84]/50 mb-4">
              <h3 className="font-medium text-[#5c4a32] mb-2">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {selectedRepo.topics.map(topic => (
                  <span
                    key={topic}
                    className="px-2 py-1 text-xs rounded-full bg-[#b39f84]/30 text-[#5c4a32]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Simple view for dashboard mode
  if (!isExpanded) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-base font-bold text-[#5c4a32] flex items-center">
            <Github size={16} className="mr-1" />
            GitHub Dashboard
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
          {/* Simplified user overview */}
          {githubUser && (
            <div className="bg-[#c9b698]/30 rounded-xl p-2 flex items-center">
              <div className="mr-2 rounded-full overflow-hidden border-2 border-[#b39f84] h-8 w-8 relative">
                <Image 
                  src={githubUser.avatar_url} 
                  alt={githubUser.login} 
                  width={32} 
                  height={32}
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 truncate">
                <h3 className="text-xs font-bold text-[#5c4a32] truncate">{githubUser.name || githubUser.login}</h3>
                <div className="flex items-center text-[10px] text-[#5c4a32]/80">
                  <Users size={8} className="mr-1" />
                  <span>{githubUser.followers} followers</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Simplified contribution activity */}
          <div className="bg-[#c9b698]/30 rounded-xl p-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[10px] font-semibold text-[#5c4a32] flex items-center">
                <Calendar size={10} className="mr-1" />
                Recent Activity
              </h3>
              
              {contributions && contributions.length > 0 && (
                <span className="text-[10px] text-[#5c4a32]/80 font-medium">
                  {contributions.reduce((sum, day) => sum + day.count, 0)} contributions
                </span>
              )}
            </div>
            
            {/* Simplified contribution chart (last 14 days) */}
            <div className="flex items-end h-6 gap-[2px]">
              {contributions && contributions.slice(-14).map((day, i) => (
                <div 
                  key={i}
                  className="flex-1 rounded-sm tooltip"
                  style={{ 
                    height: `${Math.min(100, (day.count / 5) * 100)}%`,
                    backgroundColor: day.count === 0 
                      ? '#ebedf0' 
                      : day.count < 2 
                        ? '#9be9a8' 
                        : day.count < 4 
                          ? '#40c463'
                          : day.count < 6
                            ? '#30a14e'
                            : '#216e39'
                  }}
                  title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString()}`}
                />
              ))}
            </div>
          </div>
          
          {/* Top repositories */}
          {repositories && (
            <div className="bg-[#c9b698]/30 rounded-xl p-2">
              <h3 className="text-[10px] font-semibold text-[#5c4a32] mb-1">Top Repositories</h3>
              <div className="space-y-1">
                {repositories.slice(0, 3).map(repo => (
                  <div 
                    key={repo.id}
                    className="flex items-center text-[10px] p-1 rounded hover:bg-[#b39f84]/20 cursor-pointer"
                    onClick={() => setSelectedRepo(repo)}
                  >
                    <div className="flex-1 truncate">
                      <div className="font-medium text-[#5c4a32] truncate">{repo.name}</div>
                    </div>
                    <div className="flex items-center text-[#5c4a32]/70 ml-2">
                      <Star size={8} className="mr-1" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detailed view for expanded mode
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-base font-bold text-[#5c4a32] flex items-center">
          <Github size={16} className="mr-1" />
          GitHub Dashboard
        </h2>
        
        <button 
          onClick={onExpand}
          className="p-1 rounded-md hover:bg-[#b39f84]/30 text-[#5c4a32] transition-colors"
          title="Minimize"
        >
          <Minimize2 size={14} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1 overflow-hidden">
        <div className="md:col-span-1 h-full overflow-y-auto">
          {githubUser && (
            <GitHubOverview user={githubUser} />
          )}
        </div>
        
        <div className="md:col-span-2 space-y-2 h-full overflow-y-auto">
          <GitHubContributions contributions={contributions} />
          
          {repositories && (
            <GitHubRepositories 
              repositories={repositories}
              onSelectRepository={setSelectedRepo}
            />
          )}
        </div>
      </div>
    </div>
  );
} 