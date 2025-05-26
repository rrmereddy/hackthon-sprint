'use client';

import { useMemo, useState } from 'react';
import { GitHubRepository } from '@/server/githubService';
import { Star, GitFork, Clock, ArrowUpRight, Filter } from 'lucide-react';

export default function GitHubRepositories({ 
  repositories,
  onSelectRepository
}: { 
  repositories: GitHubRepository[];
  onSelectRepository?: (repo: GitHubRepository) => void;
}) {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'forks'>('updated');

  const filteredAndSortedRepos = useMemo(() => {
    let filtered = repositories;
    
    // Apply search filter
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filtered = repositories.filter(repo => 
        repo.name.toLowerCase().includes(lowerFilter) || 
        (repo.description && repo.description.toLowerCase().includes(lowerFilter))
      );
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === 'stars') {
        return b.stargazers_count - a.stargazers_count;
      } else if (sortBy === 'forks') {
        return b.forks_count - a.forks_count;
      } else {
        // 'updated'
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [repositories, filter, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string | null) => {
    if (!language) return '#ccc';
    
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      Go: '#00ADD8',
      Ruby: '#701516',
      PHP: '#4F5D95',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#178600',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Rust: '#dea584',
      Dart: '#00B4AB'
    };
    
    return colors[language] || '#ccc';
  };

  return (
    <div className="bg-[#c9b698]/30 rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#5c4a32]">Repositories</h2>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search repositories..."
              className="pl-8 pr-2 py-1 text-sm rounded-md border border-[#b39f84] bg-white/80 text-[#5c4a32] placeholder-[#5c4a32]/40 w-48 focus:outline-none focus:ring-1 focus:ring-[#b39f84]"
            />
            <Filter size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#5c4a32]/60" />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'updated' | 'stars' | 'forks')}
            className="py-1 px-2 text-sm rounded-md border border-[#b39f84] bg-white/80 text-[#5c4a32] focus:outline-none focus:ring-1 focus:ring-[#b39f84]"
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredAndSortedRepos.length === 0 ? (
          <div className="text-center py-8 text-[#5c4a32]/70">
            {filter ? 'No repositories match your search' : 'No repositories found'}
          </div>
        ) : (
          filteredAndSortedRepos.map(repo => (
            <div 
              key={repo.id} 
              className="p-3 rounded-lg bg-white/70 hover:bg-white transition-colors border border-[#b39f84]/50 cursor-pointer"
              onClick={() => onSelectRepository && onSelectRepository(repo)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-[#5c4a32] flex items-center">
                    {repo.name}
                    {repo.fork && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-[#b39f84]/30 text-[#5c4a32]/70">
                        Fork
                      </span>
                    )}
                    {repo.visibility === 'private' && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-[#b39f84]/60 text-[#5c4a32]">
                        Private
                      </span>
                    )}
                  </h3>
                  {repo.description && (
                    <p className="text-sm text-[#5c4a32]/70 mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                </div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5c4a32]/70 hover:text-[#5c4a32] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowUpRight size={16} />
                </a>
              </div>
              
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-[#5c4a32]/80">
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    ></span>
                    <span>{repo.language}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Star size={14} />
                  <span>{repo.stargazers_count}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <GitFork size={14} />
                  <span>{repo.forks_count}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>Updated {formatDate(repo.updated_at)}</span>
                </div>
              </div>
              
              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {repo.topics.slice(0, 5).map(topic => (
                    <span
                      key={topic}
                      className="text-xs px-2 py-0.5 rounded-full bg-[#b39f84]/30 text-[#5c4a32]"
                    >
                      {topic}
                    </span>
                  ))}
                  {repo.topics.length > 5 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#b39f84]/30 text-[#5c4a32]">
                      +{repo.topics.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 