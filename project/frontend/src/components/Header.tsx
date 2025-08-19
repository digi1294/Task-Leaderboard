import React from 'react';
import { RefreshCw, Calendar } from 'lucide-react';

// --- THIS IS THE FIX (Part 1) ---
// We now import the logo image directly into the code.
// This is a more reliable way to handle assets.
import companyLogo from '../assets/company-logo.png';

interface HeaderProps {
  currentTime: string;
  refreshCountdown: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTime,
  refreshCountdown
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 border-b border-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            
            {/* --- THIS IS THE FIX (Part 2) --- */}
            {/* The 'src' attribute now uses the imported 'companyLogo' variable. */}
            <img src={companyLogo} alt="Company Logo" className="h-12" />

            <div className="flex items-center space-x-2 text-slate-300">
              <Calendar className="w-4 h-4" />
              <span className="text-base">{currentTime}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-400">
              <RefreshCw className={`w-4 h-4 ${refreshCountdown <= 10 ? 'animate-spin' : ''}`} />
              <span className="text-sm">Next refresh: {refreshCountdown}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
