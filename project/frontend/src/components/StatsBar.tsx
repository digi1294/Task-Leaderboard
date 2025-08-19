import React from 'react';
import { CheckCircle, Clock, AlertTriangle, Target, TrendingUp } from 'lucide-react';

interface StatsData {
  monthName: string;
  daysIntoMonth: number;
  totalTasks: number;
  completed: number;
  revisions: number;
  overdue: number;
  completionPercentage: number;
}

interface StatsBarProps {
  stats: StatsData;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
    bgColor: string;
  }> = ({ icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} p-3 rounded-xl border border-slate-700 backdrop-blur-sm`}>
      <div className="flex items-center space-x-2">
        <div className={`p-1.5 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium">{title}</p>
          <p className="text-lg font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900/50 p-2 border-b border-slate-700">
      <div className="px-3">
        <div className="grid grid-cols-6 gap-2">
          <StatCard
            icon={<Calendar className="w-5 h-5 text-blue-400" />}
            title={stats.monthName}
            value={`Day ${stats.daysIntoMonth}`}
            color="bg-blue-500/20"
            bgColor="bg-slate-800/50"
          />
          
          <StatCard
            icon={<Target className="w-5 h-5 text-purple-400" />}
            title="Total Tasks"
            value={stats.totalTasks}
            color="bg-purple-500/20"
            bgColor="bg-slate-800/50"
          />
          
          <StatCard
            icon={<CheckCircle className="w-5 h-5 text-green-400" />}
            title="Completed"
            value={stats.completed}
            color="bg-green-500/20"
            bgColor="bg-slate-800/50"
          />
          
          <StatCard
            icon={<TrendingUp className="w-5 h-5 text-yellow-400" />}
            title="Revisions"
            value={stats.revisions}
            color="bg-yellow-500/20"
            bgColor="bg-slate-800/50"
          />
          
          <StatCard
            icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
            title="Overdue"
            value={stats.overdue}
            color="bg-red-500/20"
            bgColor="bg-slate-800/50"
          />
          
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-slate-400 text-xs font-medium">Monthly Completion</p>
              <span className="text-lg font-bold text-white">{stats.completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stats.completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);