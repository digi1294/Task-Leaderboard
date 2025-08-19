import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

// Define interfaces for our data structures
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

interface LeaderboardStats {
  monthName: string;
  totalTasks: number;
  completed: number;
  revisions: number;
  overdue: number;
  completionPercentage: number;
  daysIntoMonth: number;
}

interface TrendData {
    vsLastMonth: number;
    qualityScore: number;
    teamVelocity: string;
}

// --- THIS IS THE CHANGE (Part 1) ---
// We add the optional 'soundTrigger' property to the data we expect from the API.
interface LeaderboardData {
    performers: Performer[];
    stats: LeaderboardStats;
    trendData: TrendData;
    soundTrigger?: string; // e.g., 'new_leader'
}


export const useLeaderboardData = (refreshInterval: number = 300000) => {
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  // --- THIS IS THE CHANGE (Part 2) ---
  // We add state to hold the sound trigger we receive.
  const [soundTrigger, setSoundTrigger] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data: LeaderboardData = await apiService.getLeaderboardData();
      
      setPerformers(data.performers);
      setStats(data.stats);
      setTrendData(data.trendData);
      setLastUpdated(new Date());

      // --- THIS IS THE CHANGE (Part 3) ---
      // If the API response includes a sound trigger, we set it in our state.
      // We also add a random number to ensure the state updates even if the trigger is the same.
      if (data.soundTrigger) {
        setSoundTrigger(`${data.soundTrigger}_${Date.now()}`);
      }
      
      console.log('✅ Leaderboard data loaded successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load leaderboard data';
      setError(errorMessage);
      console.error('❌ Error loading leaderboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, loadData]);

  // --- THIS IS THE CHANGE (Part 4) ---
  // We return the sound trigger from the hook so the App can use it.
  return { 
    performers, 
    stats, 
    trendData,
    soundTrigger,
    isLoading, 
    error, 
    lastUpdated
  };
};
