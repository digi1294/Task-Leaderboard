import React, { useState, useEffect } from 'react';
import { Star, Flame, AlertTriangle, TrendingUp } from 'lucide-react';
import { MotivationalQuotes } from './MotivationalQuotes';

// --- THIS IS THE FIX (Part 1) ---
// We've re-added the interface for the trend data.
interface TrendData {
    vsLastMonth: number;
    qualityScore: number;
    teamVelocity: string;
}

interface SidebarProps {
  doerOfTheWeek: {
    name: string;
    score: number;
    badges: string[];
  };
  overdueSpotlight: {
    count: number;
    names: string[];
  };
  // We also ensure the component expects the trendData prop.
  trendData: TrendData | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ doerOfTheWeek, overdueSpotlight, trendData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // Show 3 names per page
  const totalPages = Math.ceil(overdueSpotlight.names.length / itemsPerPage);

  useEffect(() => {
    if (totalPages > 1) {
      const interval = setInterval(() => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
      }, 5000); // Change page every 5 seconds
      return () => clearInterval(interval);
    }
  }, [totalPages]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOverdueNames = overdueSpotlight.names.slice(startIndex, endIndex);


  return (
    <div className="space-y-3">
      {/* Doer of the Week */}
      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-3 rounded-lg border border-purple-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <h3 className="text-base font-bold text-white">Doer of the Month</h3>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400">
              <img 
                src={`https://i.pravatar.cc/150?u=${doerOfTheWeek.name}`}
                alt={doerOfTheWeek.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h4 className="text-lg font-bold text-white mb-1">{doerOfTheWeek.name}</h4>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full font-bold text-sm mb-2">
            {doerOfTheWeek.score} points
          </div>
        </div>
      </div>

      {/* Motivational Quotes */}
      <MotivationalQuotes />

      {/* Overdue Spotlight */}
      {overdueSpotlight.count > 0 && (
        <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 p-3 rounded-lg border border-red-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-white">Needs Attention</h3>
            </div>
            {totalPages > 1 && (
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentPage ? 'bg-red-400' : 'bg-red-800/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center mb-2">
            <p className="text-red-400 text-sm">
              {overdueSpotlight.count} overdue task{overdueSpotlight.count > 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="space-y-1" style={{ minHeight: '60px' }}>
            {currentOverdueNames.map((name, index) => (
              <div key={index} className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded text-xs text-center">
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- THIS IS THE FIX (Part 2) --- */}
      {/* The Performance Trend tile has been added back. */}
      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">This Month's Trend</h3>
        </div>
        
        {trendData ? (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">vs Last Month</span>
              <span className={`${trendData.vsLastMonth >= 0 ? 'text-green-400' : 'text-red-400'} font-semibold text-sm`}>
                {trendData.vsLastMonth >= 0 ? '+' : ''}{trendData.vsLastMonth}% {trendData.vsLastMonth >= 0 ? '↗' : '↘'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Quality Score</span>
              <span className="text-blue-400 font-semibold text-sm">{trendData.qualityScore}/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Team Velocity</span>
              <span className="text-purple-400 font-semibold text-sm">{trendData.teamVelocity}</span>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-sm text-center">Loading trend data...</div>
        )}
      </div>
    </div>
  );
};
