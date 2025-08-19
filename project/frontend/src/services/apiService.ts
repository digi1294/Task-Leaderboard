// The ONLY change is on this line. We are now pointing to the correct backend server.
const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  cached?: boolean;
}

interface LeaderboardData {
  performers: Array<{
    id: string;
    name: string;
    score: number;
    completed: number;
    revisions: number;
    overdue: number;
    streak: number;
    profilePic?: string;
  }>;
  stats: {
    monthName: string;
    totalTasks: number;
    completed: number;
    revisions: number;
    overdue: number;
    completionPercentage: number;
    daysIntoMonth: number;
  };
}

class ApiService {
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getLeaderboardData(): Promise<LeaderboardData> {
    try {
      // This now correctly calls http://localhost:3001/api/leaderboard
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/leaderboard`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // The frontend expects the JSON to have a specific structure.
      // We will now modify the backend to provide it.
      const result = await response.json();
      return result;

    } catch (error) {
      console.error('API Error:', error);
      throw new Error(`Failed to fetch leaderboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // The rest of the file remains the same for now...
  async refreshData(): Promise<LeaderboardData> {
    // This function is not used yet, but we'll leave it for now.
    return this.getLeaderboardData();
  }

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

export const apiService = new ApiService();
export type { LeaderboardData };
