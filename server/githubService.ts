'use server';

import { cache } from 'react';

export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  visibility: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
};

export type GitHubUser = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export type GitHubContribution = {
  date: string;
  count: number;
};

// Fetch GitHub user with caching - revalidate every 10 minutes
export const fetchGitHubUser = cache(async (username: string): Promise<GitHubUser> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      next: { revalidate: 600 } // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    throw error;
  }
});

// Fetch GitHub repositories with caching - revalidate every 10 minutes
export const fetchGitHubRepositories = cache(async (username: string, perPage: number = 10): Promise<GitHubRepository[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        },
        next: { revalidate: 600 } // Cache for 10 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
});

// Generate mock contribution data for demo purposes
// In a real app, this would require OAuth to access private GitHub API endpoints
export async function generateMockContributions(days: number = 90): Promise<GitHubContribution[]> {
  const contributions: GitHubContribution[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate a random count with higher probability on weekdays
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Generate more contributions on weekdays than weekends
    const maxCount = isWeekend ? 5 : 12;
    const randomFactor = isWeekend ? 0.3 : 0.7; // Less activity on weekends
    
    // Occasionally have a day with no contributions
    const noContributionChance = isWeekend ? 0.4 : 0.2;
    
    let count = 0;
    if (Math.random() > noContributionChance) {
      count = Math.floor(Math.random() * maxCount * randomFactor) + 1;
    }
    
    contributions.push({
      date: date.toISOString().split('T')[0],
      count
    });
  }
  
  return contributions;
} 