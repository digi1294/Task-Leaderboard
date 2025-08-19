import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { TopPerformers } from './components/TopPerformers';
import { Sidebar } from './components/Sidebar';
import { TimeOverlay } from './components/TimeOverlay';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { useTimeControl } from './hooks/useTimeControl';
import { useAudio } from './hooks/useAudio';
import { useLeaderboardData } from './hooks/useLeaderboardData';

function App() {
  const [previousTimeMode, setPreviousTimeMode] = useState<string>('normal');
  
  const { countdown } = useAutoRefresh(300);
  const { timeMode, currentTime } = useTimeControl();
  // --- THIS IS THE CHANGE (Part 1) ---
  // We get the new 'playNewLeaderChime' function from our audio hook.
  const { playWelcomeChime, playFocusChime, playLunchJingle, playEndDayFade, playNewLeaderChime } = useAudio();
  // We also get the new 'soundTrigger' from our data hook.
  const { performers, stats, trendData, soundTrigger, isLoading, error } = useLeaderboardData();

  // This useEffect handles the TIME-BASED sounds (lunch, end of day, etc.)
  useEffect(() => {
    if (timeMode !== previousTimeMode) {
      switch (timeMode) {
        case 'morning': playWelcomeChime(); break;
        case 'focus': playFocusChime(); break;
        case 'lunch': playLunchJingle(); break;
        case 'endday': playEndDayFade(); break;
      }
      setPreviousTimeMode(timeMode);
    }
  }, [timeMode, previousTimeMode, playWelcomeChime, playFocusChime, playLunchJingle, playEndDayFade]);

  // --- THIS IS THE CHANGE (Part 2) ---
  // This new useEffect handles the DATA-BASED sounds (new leader).
  useEffect(() => {
    // We check if the trigger exists before trying to play a sound.
    if (soundTrigger) {
        // We check the name of the trigger (removing the random number we added).
        if (soundTrigger.startsWith('new_leader')) {
            playNewLeaderChime();
        }
        // Add more 'if' statements here for other sound triggers in the future.
    }
  }, [soundTrigger, playNewLeaderChime]); // This effect runs only when the soundTrigger changes.

  if (timeMode === 'lunch' || timeMode === 'endday') {
    return <TimeOverlay mode={timeMode} currentTime={currentTime} />;
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Error loading data</p>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      <Header
        currentTime={currentTime}
        refreshCountdown={countdown}
      />

      {timeMode === 'focus' && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-center py-2 text-sm font-semibold animate-pulse flex items-center justify-center gap-x-3">
          <span>✨</span>
          <span>Focus Time - Deep Work Mode Active</span>
          <span>✨</span>
        </div>
      )}

      <StatsBar stats={stats!} />

      <div className="flex-1 flex gap-3 p-3 overflow-y-auto">
        <div className="flex-1 flex flex-col">
          <TopPerformers performers={performers} />
        </div>

        <div className="w-64 flex-shrink-0">
          <Sidebar
            doerOfTheWeek={{
              name: performers[0]?.name || 'Loading...',
              score: performers[0]?.score || 0,
              badges: []
            }}
            overdueSpotlight={{
              count: stats?.overdue || 0,
              names: performers.filter(p => p.overdue > 0).map(p => p.name)
            }}
            trendData={trendData}
          />
        </div>
      </div>

      <div className="bg-slate-900 border-t border-slate-700 py-2">
        <div className="px-4 text-center">
          <p className="text-slate-400 text-sm">
            🚀 Powered By Your Trust • Next refresh in {countdown}s
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
