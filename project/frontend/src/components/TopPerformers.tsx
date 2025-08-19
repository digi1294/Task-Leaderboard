import React from 'react';
import { Crown, Flame, Target, Zap, Award } from 'lucide-react';
import { useTeamPagination } from '../hooks/useTeamPagination';

interface Badge {
  type: 'no-revisions' | 'streak' | 'fast-finisher';
  label: string;
  icon: React.ReactNode;
}

interface Performer {
  id: string;
  name: string;
  score: number;
  completed: number;
  revisions: number;
  overdue: number;
  completionRate: number;
  streak: number;
  badges: Badge[];
  profilePic?: string;
}

interface TopPerformersProps {
  performers: Performer[];
}

export const TopPerformers: React.FC<TopPerformersProps> = ({ performers }) => {
  const itemsPerPage = 6;
  const { topThree, currentPageItems, currentPage, totalPages, hasMultiplePages } = useTeamPagination(performers, itemsPerPage);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 0: return 'from-yellow-400 to-yellow-600'; // Gold
      case 1: return 'from-gray-300 to-gray-500';     // Silver
      case 2: return 'from-amber-600 to-amber-800';   // Bronze
      default: return 'from-slate-400 to-slate-600';
    }
  };

  const getMedalIcon = (rank: number) => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[rank] || '🏅';
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'no-revisions': return <Target className="w-4 h-4" />;
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'fast-finisher': return <Zap className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const TopPerformerCard: React.FC<{ performer: Performer; rank: number }> = ({ performer, rank }) => (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-lg border-2 transition-all duration-500 ${
      rank === 0 ? 'border-yellow-400 shadow-2xl shadow-yellow-400/20' :
      rank === 1 ? 'border-gray-400 shadow-xl shadow-gray-400/10' :
      'border-amber-600 shadow-lg shadow-amber-600/10'
    }`}>
      {/* Medal and Crown */}
      <div className="flex items-center justify-between mb-1">
        <div className="text-xl">{getMedalIcon(rank)}</div>
        {rank === 0 && <Crown className="w-5 h-5 text-yellow-400 animate-pulse" />}
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center mb-2">
        <div className={`relative w-12 h-12 rounded-full overflow-hidden border-2 ${
          rank === 0 ? 'border-yellow-400' :
          rank === 1 ? 'border-gray-400' :
          'border-amber-600'
        }`}>
          <img 
            src={performer.profilePic || 'https://i.pravatar.cc/150'} 
            alt={performer.name}
            className="w-full h-full object-cover"
          />
          {rank === 0 && (
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Performer Info */}
      <div className="text-center mb-2">
        <h3 className="text-sm font-bold text-white mb-1">{performer.name}</h3>
        <div className={`inline-block px-2 py-0.5 rounded-full bg-gradient-to-r ${getMedalColor(rank)} text-white font-bold text-xs`}>
          {performer.score} pts
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-1 mb-2">
        <div className="text-center">
          <p className="text-green-400 text-base font-bold">{performer.completed}</p>
          <p className="text-slate-400 text-xs">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-yellow-400 text-base font-bold">{performer.revisions}</p>
          <p className="text-slate-400 text-xs">Revisions</p>
        </div>
        <div className="text-center">
          <p className="text-red-400 text-base font-bold">{performer.overdue}</p>
          <p className="text-slate-400 text-xs">Overdue</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-400 text-xs">Completion Rate</span>
          <span className="text-white font-semibold text-xs">{performer.completionRate}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1">
          <div 
            className={`h-1 rounded-full bg-gradient-to-r ${getMedalColor(rank)} transition-all duration-1000 ease-out`}
            style={{ width: `${performer.completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const RemainingPerformerCard: React.FC<{ performer: Performer; rank: number }> = ({ performer, rank }) => (
    <div className="bg-slate-800/50 p-1.5 rounded-md border border-slate-700 flex items-center justify-between transition-all">
      <div className="flex items-center space-x-1.5">
        <div className="text-sm font-bold text-slate-400 w-6 text-center">#{rank + 1}</div>
        <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-600 flex-shrink-0">
          <img 
            src={performer.profilePic || 'https://i.pravatar.cc/150'} 
            alt={performer.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-white font-semibold text-xs">{performer.name}</h4>
          
          <div className="flex items-center space-x-3 text-xs font-medium">
            <span className="text-green-400" title="Completed">{performer.completed}</span>
            <span className="text-yellow-400" title="Revisions">{performer.revisions}</span>
            <span className="text-red-400" title="Overdue">{performer.overdue}</span>
          </div>

        </div>
      </div>
      <div className="text-right w-12">
        <div className="text-xs font-bold text-white">{performer.score} pts</div>
        <div className="text-xs text-slate-400">{performer.completionRate}%</div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-lg font-bold text-white mb-2 text-center">🏆 Top Performers</h2>
      
      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {topThree.map((performer, index) => (
          <TopPerformerCard key={performer.id} performer={performer} rank={index} />
        ))}
      </div>

      {/* Remaining Performers */}
      {currentPageItems.length > 0 && (
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-300">Other Team Members</h3>
            {hasMultiplePages && (
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentPage ? 'bg-blue-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {currentPageItems.map((performer, index) => {
              // --- THIS IS THE FIX ---
              // We calculate the true rank by accounting for the current page number.
              // This ensures the rank is continuous across all pages.
              const trueRank = 3 + (currentPage * itemsPerPage) + index;
              return (
                <RemainingPerformerCard key={performer.id} performer={performer} rank={trueRank} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
