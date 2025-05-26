'use client';

import { useMemo } from 'react';
import { GitHubContribution } from '@/server/githubService';
import { Calendar } from 'lucide-react';

export default function GitHubContributions({ 
  contributions 
}: { 
  contributions: GitHubContribution[] 
}) {
  const { totalContributions, maxContributions, weekLabels, monthLabels } = useMemo(() => {
    const total = contributions.reduce((sum, day) => sum + day.count, 0);
    const max = Math.max(...contributions.map(day => day.count));
    
    // Generate week labels (Mon, Wed, Fri)
    const weekDays = ['Mon', '', 'Wed', '', 'Fri', '', ''];
    
    // Generate month labels
    const months: Record<string, boolean> = {};
    const monthPositions: { label: string; position: number }[] = [];
    
    contributions.forEach((day, index) => {
      const date = new Date(day.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })}`;
      
      // If this is a new month and not already added
      if (date.getDate() <= 7 && !months[monthYear]) {
        months[monthYear] = true;
        monthPositions.push({ label: monthYear, position: index });
      }
    });
    
    return {
      totalContributions: total,
      maxContributions: max,
      weekLabels: weekDays,
      monthLabels: monthPositions
    };
  }, [contributions]);
  
  const getContributionColor = (count: number) => {
    if (count === 0) return '#ebedf0';
    
    const intensity = Math.min(count / Math.max(maxContributions / 4, 1), 1);
    
    if (intensity < 0.25) {
      return '#9be9a8'; // Lightest green
    } else if (intensity < 0.5) {
      return '#40c463'; // Light green
    } else if (intensity < 0.75) {
      return '#30a14e'; // Medium green
    } else {
      return '#216e39'; // Dark green
    }
  };
  
  // Group contributions by week
  const weeks = useMemo(() => {
    const result: GitHubContribution[][] = [];
    let currentWeek: GitHubContribution[] = [];
    
    // Calculate the start offset to align days correctly
    const firstDate = new Date(contributions[0].date);
    const firstDayOfWeek = firstDate.getDay(); // 0 = Sunday, 1 = Monday, ...
    const offset = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); // Convert to Monday = 0, ... Sunday = 6
    
    // Add empty days for alignment
    for (let i = 0; i < offset; i++) {
      currentWeek.push({ date: '', count: 0 });
    }
    
    contributions.forEach(day => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add remaining days if any
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    
    return result;
  }, [contributions]);

  const formatTooltipDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-[#c9b698]/30 rounded-xl p-3 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-[#5c4a32] flex items-center gap-1">
          <Calendar size={14} />
          Contribution Activity
        </h2>
        
        <div className="text-xs text-[#5c4a32]/80">
          <span className="font-medium">{totalContributions}</span> contributions
        </div>
      </div>
      
      <div className="relative flex flex-col flex-1">
        {/* Month Labels */}
        <div className="flex h-4 pl-8 mb-1">
          {monthLabels.map((month, idx) => (
            <div 
              key={idx} 
              className="text-[10px] text-[#5c4a32]/70"
              style={{ 
                position: 'absolute', 
                left: `${(month.position / contributions.length) * (weeks.length * 12) + 32}px` 
              }}
            >
              {month.label}
            </div>
          ))}
        </div>
        
        {/* Contribution Grid */}
        <div className="flex overflow-x-auto overflow-y-hidden pb-1">
          {/* Week Labels */}
          <div className="flex flex-col pr-1 pt-1">
            {weekLabels.map((day, idx) => (
              <div key={idx} className="h-3 w-4 text-[10px] text-[#5c4a32]/70 flex items-center">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Squares */}
          <div className="flex space-x-[2px]">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col space-y-[2px]">
                {week.map((day, dayIdx) => (
                  <div 
                    key={`${weekIdx}-${dayIdx}`} 
                    className="w-3 h-3 rounded-[2px] tooltip"
                    style={{ backgroundColor: getContributionColor(day.count) }}
                    title={day.date ? `${day.count} contributions on ${formatTooltipDate(day.date)}` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end mt-1 text-[10px] text-[#5c4a32]/70">
          <span className="mr-1">Less</span>
          <div className="flex space-x-[2px]">
            {[0, 1, 2, 3, 4].map(level => (
              <div 
                key={level}
                className="w-2 h-2 rounded-[2px]"
                style={{ 
                  backgroundColor: level === 0 
                    ? '#ebedf0' 
                    : level === 1 
                      ? '#9be9a8' 
                      : level === 2 
                        ? '#40c463' 
                        : level === 3 
                          ? '#30a14e' 
                          : '#216e39' 
                }}
              />
            ))}
          </div>
          <span className="ml-1">More</span>
        </div>
        
        {/* Empty State */}
        {totalContributions === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
            <div className="text-center p-2">
              <p className="text-xs text-[#5c4a32]/70">No contributions found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 