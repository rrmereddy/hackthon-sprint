// server/leetcodeService.ts
'use server';

import { LeetCodeStats, LeetCodeSubmission, LeetCodeProblem, LeetCodeUserProfile } from '@/types/leetcode';

const API_BASE_URL = 'https://leetcode-api-pied.vercel.app';

export async function fetchLeetCodeUserProfile(username: string): Promise<LeetCodeUserProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${username}`, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error('Failed to fetch LeetCode user profile');
    }
    
    const data = await response.json();
    
    return {
      username: data.username,
      realName: data.realName || data.username,
      profileUrl: `https://leetcode.com/${username}`,
      avatarUrl: data.avatar || 'https://assets.leetcode.com/users/default_avatar.jpg',
      ranking: data.profile?.ranking || 0,
      reputation: data.profile?.reputation || 0,
      starRating: data.starRating || 0,
    };
  } catch (error) {
    console.error('Error fetching LeetCode user profile:', error);
    return generateMockUserProfile(username);
  }
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${username}`, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error('Failed to fetch LeetCode stats');
    }
    
    const data = await response.json();
    const submitStats = data.submitStats || {};
    
    return {
      totalSolved: submitStats.acSubmissionNum?.[0]?.count || 0,
      totalQuestions: submitStats.totalSubmissionNum?.[0]?.count || 0,
      easySolved: submitStats.acSubmissionNum?.[1]?.count || 0,
      easyTotal: submitStats.totalSubmissionNum?.[1]?.count || 0,
      mediumSolved: submitStats.acSubmissionNum?.[2]?.count || 0,
      mediumTotal: submitStats.totalSubmissionNum?.[2]?.count || 0,
      hardSolved: submitStats.acSubmissionNum?.[3]?.count || 0,
      hardTotal: submitStats.totalSubmissionNum?.[3]?.count || 0,
      acceptanceRate: data.profile?.acceptanceRate || 0,
      ranking: data.profile?.ranking || 0,
      contributionPoints: data.profile?.reputation || 0,
      reputation: data.profile?.reputation || 0,
    };
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return generateMockStats();
  }
}

export async function fetchLeetCodeSubmissions(username: string, limit: number = 10): Promise<LeetCodeSubmission[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${username}/submissions`, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error('Failed to fetch LeetCode submissions');
    }
    
    const data = await response.json();
    const submissions = data.recentSubmissionList || [];
    
    return submissions.slice(0, limit).map((submission: any) => ({
      id: submission.id,
      title: submission.title,
      titleSlug: submission.titleSlug,
      timestamp: parseInt(submission.timestamp, 10) * 1000, // Convert seconds to milliseconds
      status: submission.statusDisplay,
      language: submission.lang,
      problemId: submission.id, // Assuming API submission.id is the problem's ID for this context
      problemName: submission.title,
      runtime: submission.runtime || 'N/A',
      memory: submission.memory || 'N/A',
      url: `https://leetcode.com/problems/${submission.titleSlug}/submissions/`,
    }));
  } catch (error) {
    console.error('Error fetching LeetCode submissions:', error);
    return generateMockSubmissions(limit);
  }
}

export async function fetchLeetCodeProblems(username: string, limit: number = 20): Promise<LeetCodeProblem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/problems`, { next: { revalidate: 86400 } }); // Cache for 24 hours
    
    if (!response.ok) {
      throw new Error('Failed to fetch LeetCode problems');
    }
    
    const data = await response.json();
    const problems = data.stat_status_pairs || [];
    
    return problems.slice(0, limit).map((problem: any) => ({
      id: problem.stat.question_id,
      title: problem.stat.question__title,
      titleSlug: problem.stat.question__title_slug,
      difficulty: problem.difficulty.level === 1 ? 'Easy' : problem.difficulty.level === 2 ? 'Medium' : 'Hard',
      isPaidOnly: problem.paid_only,
      status: problem.status || null,
      tags: problem.tags || [], // Assuming tags are directly available or need to be mapped if structure is different
      acceptanceRate: problem.stat.total_acs && problem.stat.total_submitted ? 
        (problem.stat.total_acs / problem.stat.total_submitted * 100) : // Keep as number
        0,
      url: `https://leetcode.com/problems/${problem.stat.question__title_slug}/`,
    }));
  } catch (error) {
    console.error('Error fetching LeetCode problems:', error);
    return generateMockProblems(limit);
  }
}

export async function fetchDailyChallenge(): Promise<LeetCodeProblem | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/daily`, { next: { revalidate: 86400 } }); // Cache for 24 hours
    
    if (!response.ok) {
      throw new Error('Failed to fetch daily challenge');
    }
    
    const data = await response.json();
    
    return {
      id: data.question.questionId,
      title: data.question.title,
      titleSlug: data.question.titleSlug,
      difficulty: data.question.difficulty,
      isPaidOnly: data.question.isPaidOnly,
      status: null, // Daily challenge might not have a user-specific status here
      tags: data.question.topicTags?.map((tag: any) => tag.name) || [],
      acceptanceRate: data.question.acRate ? (data.question.acRate * 100) : 0, // Keep as number
      url: `https://leetcode.com/problems/${data.question.titleSlug}/`,
    };
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    return null;
  }
}

// Mock data generators (fallback if API fails)
function generateMockUserProfile(username: string): LeetCodeUserProfile {
  return {
    username,
    realName: username,
    profileUrl: `https://leetcode.com/${username}`,
    avatarUrl: 'https://assets.leetcode.com/users/default_avatar.jpg',
    ranking: Math.floor(Math.random() * 100000) + 1,
    reputation: Math.floor(Math.random() * 1000),
    starRating: Math.floor(Math.random() * 5) + 1,
  };
}

function generateMockStats(): LeetCodeStats {
  const easySolved = Math.floor(Math.random() * 300) + 50;
  const mediumSolved = Math.floor(Math.random() * 200) + 30;
  const hardSolved = Math.floor(Math.random() * 50) + 5;
  const totalSolved = easySolved + mediumSolved + hardSolved;
  
  return {
    totalSolved,
    totalQuestions: 2500,
    easySolved,
    easyTotal: 700,
    mediumSolved,
    mediumTotal: 1400,
    hardSolved,
    hardTotal: 400,
    acceptanceRate: Math.floor(Math.random() * 30) + 60,
    ranking: Math.floor(Math.random() * 100000) + 1,
    contributionPoints: Math.floor(Math.random() * 1000),
    reputation: Math.floor(Math.random() * 1000),
  };
}

function generateMockSubmissions(limit: number): LeetCodeSubmission[] {
  const statuses = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'];
  const languages = ['JavaScript', 'Python', 'Java', 'C++'];
  const problems = [
    { id: 1, name: 'Two Sum', slug: 'two-sum' },
    { id: 2, name: 'Add Two Numbers', slug: 'add-two-numbers' },
    { id: 3, name: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters' },
    { id: 4, name: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays' },
    { id: 5, name: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring' },
  ];
  
  return Array.from({ length: limit }, (_, i) => {
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    const date = new Date();
    date.setDate(date.getDate() - i); // Simulate submissions over a few days
    
    return {
      id: `${i + 1}-${randomProblem.id}`, // Ensure unique ID for mock
      title: randomProblem.name,
      titleSlug: randomProblem.slug,
      timestamp: date.getTime(), // Use number for timestamp
      status: statuses[Math.floor(Math.random() * statuses.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      problemId: randomProblem.id.toString(),
      problemName: randomProblem.name,
      runtime: `${Math.floor(Math.random() * 100) + 50} ms`,
      memory: `${Math.floor(Math.random() * 10) + 40} MB`,
      url: `https://leetcode.com/problems/${randomProblem.slug}/submissions/`,
    };
  });
}

function generateMockProblems(limit: number): LeetCodeProblem[] {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const tags = [
    'Array', 'String', 'Hash Table', 'Dynamic Programming', 
    'Math', 'Sorting', 'Greedy', 'Depth-First Search', 
    'Binary Search', 'Database', 'Breadth-First Search', 'Tree',
    'Binary Tree', 'Matrix', 'Bit Manipulation', 'Stack'
  ];
  
  return Array.from({ length: limit }, (_, i) => {
    const id = i + 100; // Avoid collision with real problem IDs if possible
    const title = `Mock Problem ${id}`;
    const titleSlug = `mock-problem-${id}`;
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const randomTags = Array.from(
      { length: Math.floor(Math.random() * 4) + 1 },
      () => tags[Math.floor(Math.random() * tags.length)]
    );
    
    return {
      id,
      title,
      titleSlug,
      difficulty,
      isPaidOnly: Math.random() > 0.8,
      status: Math.random() > 0.6 ? 'ac' : null,
      tags: [...new Set(randomTags)], // Ensure unique tags
      acceptanceRate: (Math.random() * 50 + 30), // Keep as number
      url: `https://leetcode.com/problems/${titleSlug}/`,
    };
  });
}