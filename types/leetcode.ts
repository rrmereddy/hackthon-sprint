export type LeetCodeStats = {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
};

export type LeetCodeSubmission = {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  status: string;
  language: string;
  problemId: string;
  problemName: string;
  runtime: string;
  memory: string;
  url: string;
};

export type LeetCodeProblem = {
  id: number | string;
  title: string;
  titleSlug: string;
  difficulty: string;
  isPaidOnly?: boolean;
  status: string | null;
  tags: string[];
  acceptanceRate: string | number;
  url: string;
};

export type LeetCodeUserProfile = {
  username: string;
  realName: string | null;
  profileUrl: string;
  avatarUrl: string;
  ranking: number;
  reputation: number;
  starRating: number;
}; 