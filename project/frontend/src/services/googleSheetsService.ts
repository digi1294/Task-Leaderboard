interface SheetRow {
  name: string;
  score: number;
  completed: number;
  revisions: number;
  overdue: number;
  streak: number;
  profilePic?: string;
}

interface LeaderboardData {
  performers: SheetRow[];
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

// Google Sheets API configuration
const SHEET_ID = '1your-sheet-id-here'; // Replace with actual sheet ID
const API_KEY = 'your-api-key-here'; // Replace with actual API key
const RANGE = 'Sheet1!A2:H50'; // Adjust range as needed

export const fetchLeaderboardData = async (): Promise<LeaderboardData> => {
  try {
    // For now, return mock data until Google Sheets is configured
    // Replace this with actual Google Sheets API call
    const response = await mockFetchFromSheets();
    return response;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    // Fallback to mock data
    return getMockLeaderboardData();
  }
};

// Mock function simulating Google Sheets API response
const mockFetchFromSheets = async (): Promise<LeaderboardData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return getMockLeaderboardData();
};

const getMockLeaderboardData = (): LeaderboardData => {
  const performers = [
    {
      name: 'Iskanchal',
      score: 2850,
      completed: 47,
      revisions: 2,
      overdue: 0,
      streak: 12,
      profilePic: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Goutam',
      score: 2720,
      completed: 42,
      revisions: 5,
      overdue: 1,
      streak: 8,
      profilePic: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Aman',
      score: 2650,
      completed: 39,
      revisions: 3,
      overdue: 0,
      streak: 15,
      profilePic: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Anushka',
      score: 2400,
      completed: 35,
      revisions: 8,
      overdue: 2,
      streak: 0,
      profilePic: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Anuska Accounts',
      score: 2200,
      completed: 32,
      revisions: 4,
      overdue: 1,
      streak: 5,
      profilePic: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Sudhansu',
      score: 2100,
      completed: 29,
      revisions: 6,
      overdue: 0,
      streak: 3,
      profilePic: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Ravi',
      score: 1950,
      completed: 28,
      revisions: 3,
      overdue: 0,
      streak: 7,
      profilePic: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Akshay',
      score: 1850,
      completed: 26,
      revisions: 5,
      overdue: 1,
      streak: 2,
      profilePic: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Abhishek Pal',
      score: 1750,
      completed: 24,
      revisions: 2,
      overdue: 0,
      streak: 9,
      profilePic: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Suman',
      score: 1650,
      completed: 22,
      revisions: 4,
      overdue: 2,
      streak: 0,
      profilePic: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Subhroto',
      score: 1550,
      completed: 21,
      revisions: 1,
      overdue: 0,
      streak: 11,
      profilePic: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Nandini',
      score: 1450,
      completed: 19,
      revisions: 6,
      overdue: 1,
      streak: 1,
      profilePic: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Ayush',
      score: 1350,
      completed: 18,
      revisions: 2,
      overdue: 0,
      streak: 6,
      profilePic: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Prateek Intern',
      score: 1250,
      completed: 17,
      revisions: 3,
      overdue: 2,
      streak: 0,
      profilePic: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  const stats = {
    monthName: 'December 2024',
    totalTasks: 156,
    completed: 134,
    revisions: 18,
    overdue: 4,
    completionPercentage: 86,
    daysIntoMonth: 15
  };

  return { performers, stats };
};

// Function to setup Google Sheets API (call this with actual credentials)
export const setupGoogleSheetsAPI = async (sheetId: string, apiKey: string) => {
  // This would contain the actual Google Sheets API setup
  // For now, we'll use mock data
  console.log('Google Sheets API would be configured with:', { sheetId, apiKey });
};