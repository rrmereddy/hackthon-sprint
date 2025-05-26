'use client';

import { useMemo } from 'react';
import { GitHubUser } from '@/server/githubService';
import { Calendar, Star, GitFork, Users, Link2, MapPin, Building, Mail } from 'lucide-react';
import Image from 'next/image';

export default function GitHubOverview({ user }: { user: GitHubUser }) {
  const memberSince = useMemo(() => {
    if (!user.created_at) return '';
    
    const date = new Date(user.created_at);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [user.created_at]);

  const lastActive = useMemo(() => {
    if (!user.updated_at) return '';
    
    const date = new Date(user.updated_at);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [user.updated_at]);

  return (
    <div className="bg-[#c9b698]/30 rounded-xl p-3 flex flex-col">
      <div className="flex items-center">
        <div className="mr-3 rounded-full overflow-hidden border-2 border-[#b39f84] h-12 w-12 relative">
          <Image 
            src={user.avatar_url} 
            alt={user.login} 
            width={48} 
            height={48}
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          <h2 className="text-base font-bold text-[#5c4a32]">{user.name || user.login}</h2>
          <a 
            href={user.html_url}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-[#5c4a32]/80 hover:underline flex items-center gap-1"
          >
            @{user.login}
          </a>
        </div>
      </div>
      
      {user.bio && (
        <div className="mt-2 text-[#5c4a32]/90 text-xs">
          {user.bio}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-1 mt-3">
        <div className="flex items-center text-xs text-[#5c4a32]/80">
          <Calendar size={12} className="mr-1" />
          <span>Joined {memberSince}</span>
        </div>
        
        <div className="flex items-center text-xs text-[#5c4a32]/80">
          <Star size={12} className="mr-1" />
          <span>Repos: {user.public_repos}</span>
        </div>
        
        <div className="flex items-center text-xs text-[#5c4a32]/80">
          <Users size={12} className="mr-1" />
          <span>Followers: {user.followers}</span>
        </div>
        
        <div className="flex items-center text-xs text-[#5c4a32]/80">
          <Users size={12} className="mr-1" />
          <span>Following: {user.following}</span>
        </div>
      </div>
      
      <div className="mt-3 space-y-1">
        {user.company && (
          <div className="flex items-center text-xs text-[#5c4a32]/80">
            <Building size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">{user.company}</span>
          </div>
        )}
        
        {user.location && (
          <div className="flex items-center text-xs text-[#5c4a32]/80">
            <MapPin size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">{user.location}</span>
          </div>
        )}
        
        {user.blog && (
          <div className="flex items-center text-xs text-[#5c4a32]/80">
            <Link2 size={12} className="mr-1 flex-shrink-0" />
            <a 
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline truncate"
            >
              {user.blog}
            </a>
          </div>
        )}
        
        {user.email && (
          <div className="flex items-center text-xs text-[#5c4a32]/80">
            <Mail size={12} className="mr-1 flex-shrink-0" />
            <a 
              href={`mailto:${user.email}`}
              className="hover:underline truncate"
            >
              {user.email}
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 