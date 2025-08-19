import React from 'react';
import { Coffee, Moon, Sun, Focus } from 'lucide-react';
import type { TimeMode } from '../hooks/useTimeControl';

interface TimeOverlayProps {
  mode: TimeMode;
  currentTime: string;
}

const motivationalQuotes = [
  "Success is consistency in small actions. 🌟",
  "Great teams build great products. 🚀",
  "Every task completed is progress made. 📈",
  "Excellence is a habit, not an act. ⭐",
  "Together we achieve more. 🤝",
  "Quality work speaks for itself. 💎",
  "Progress over perfection. 🎯",
  "Innovation starts with dedication. 💡"
];

export const TimeOverlay: React.FC<TimeOverlayProps> = ({ mode, currentTime }) => {
  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  if (mode === 'lunch') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center z-50">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-8xl mb-4">🍱</div>
          <h1 className="text-6xl font-bold text-white mb-4">Lunch Break</h1>
          <p className="text-2xl text-orange-200 max-w-2xl mx-auto leading-relaxed">
            {getRandomQuote()}
          </p>
          <div className="flex items-center justify-center space-x-3 text-orange-300">
            <Coffee className="w-8 h-8" />
            <span className="text-xl font-medium">{currentTime}</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'endday') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="text-8xl mb-4">🏁</div>
          <h1 className="text-6xl font-bold text-white mb-4">Workday Complete</h1>
          <p className="text-2xl text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            {getRandomQuote()}
          </p>
          <div className="flex items-center justify-center space-x-3 text-indigo-300">
            <Moon className="w-8 h-8" />
            <span className="text-xl font-medium">See you tomorrow!</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'morning') {
    return (
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 z-40 animate-slide-down">
        <div className="flex items-center justify-center space-x-4">
          <Sun className="w-6 h-6 text-yellow-300" />
          <span className="text-xl font-semibold">Good Morning, Team! Let's make today amazing! ☀️</span>
        </div>
      </div>
    );
  }

  if (mode === 'focus') {
    return (
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-3 z-40">
        <div className="flex items-center justify-center space-x-4">
          <Focus className="w-5 h-5 text-purple-300" />
          <span className="text-lg font-medium">🔒 Focus Time - Deep Work Mode Active</span>
        </div>
      </div>
    );
  }

  return null;
};