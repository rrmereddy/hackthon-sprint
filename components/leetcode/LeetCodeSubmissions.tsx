'use client';

import { useMemo, useState } from 'react';
import { LeetCodeSubmission } from '@/types/leetcode';
import { Clock, CheckCircle, XCircle, AlertCircle, Filter, ExternalLink } from 'lucide-react';

interface LeetCodeSubmissionsProps {
  submissions: LeetCodeSubmission[];
}

export default function LeetCodeSubmissions({ submissions }: LeetCodeSubmissionsProps) {
  const [filter, setFilter] = useState<'all' | 'accepted' | 'failed'>('all');

  const filteredSubmissions = useMemo(() => {
    if (filter === 'all') return submissions;
    if (filter === 'accepted') return submissions.filter(s => s.status.includes('Accepted'));
    return submissions.filter(s => !s.status.includes('Accepted'));
  }, [submissions, filter]);

  const getStatusIcon = (status: string) => {
    if (status.includes('Accepted')) {
      return <CheckCircle size={14} className="text-green-500" />;
    } else if (status.includes('Wrong')) {
      return <XCircle size={14} className="text-red-500" />;
    } else if (status.includes('Time Limit')) {
      return <Clock size={14} className="text-yellow-500" />;
    } else {
      return <AlertCircle size={14} className="text-orange-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-[#5c4a32]">Recent Submissions</h3>
        
        <div className="flex items-center text-[10px] gap-1">
          <Filter size={10} className="text-[#5c4a32]/70" />
          <div className="flex items-center gap-1 bg-[#b39f84]/20 rounded-full p-0.5">
            <button 
              className={`px-2 py-0.5 rounded-full ${filter === 'all' ? 'bg-[#b39f84]/80 text-white' : 'text-[#5c4a32]'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-2 py-0.5 rounded-full ${filter === 'accepted' ? 'bg-[#b39f84]/80 text-white' : 'text-[#5c4a32]'}`}
              onClick={() => setFilter('accepted')}
            >
              Accepted
            </button>
            <button 
              className={`px-2 py-0.5 rounded-full ${filter === 'failed' ? 'bg-[#b39f84]/80 text-white' : 'text-[#5c4a32]'}`}
              onClick={() => setFilter('failed')}
            >
              Failed
            </button>
          </div>
        </div>
      </div>
      
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-6 text-[#5c4a32]/70 text-sm">
          No submissions found matching the filter
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSubmissions.map((submission, idx) => (
            <div 
              key={idx} 
              className="p-2 rounded-lg bg-white/40 border border-[#b39f84]/30"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">{getStatusIcon(submission.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <a 
                      href={submission.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#5c4a32] hover:underline truncate"
                    >
                      {submission.problemName || submission.title}
                    </a>
                    <a
                      href={submission.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5c4a32]/70 hover:text-[#5c4a32] ml-1"
                    >
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#b39f84]/20 text-[#5c4a32]">
                        {submission.language}
                      </span>
                      {submission.runtime !== 'N/A' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#b39f84]/20 text-[#5c4a32]">
                          {submission.runtime}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#5c4a32]/70">
                      {formatDate(submission.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 