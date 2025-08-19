import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const motivationalQuotes = [
  "Excellence is not a skill, it's an attitude. 💪",
  "Great teams don't happen by accident. 🚀",
  "Quality is not an act, it's a habit. ⭐",
  "Success is the sum of small efforts repeated. 🔥",
  "Teamwork makes the dream work. 🤝",
  "Progress, not perfection. 📈",
  "Every expert was once a beginner. 🌟",
  "Consistency beats perfection. ⚡"
];

export const MotivationalQuotes: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-3 rounded-xl border border-indigo-500/30">
      <div className="flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <p className="text-indigo-200 font-medium text-sm text-center transition-all duration-500">
          {motivationalQuotes[currentQuote]}
        </p>
        <Sparkles className="w-4 h-4 text-indigo-400" />
      </div>
    </div>
  );
};