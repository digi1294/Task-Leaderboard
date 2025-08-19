const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { google } = require('googleapis');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Google Sheets setup
const sheets = google.sheets('v4');

// In-memory cache for leaderboard data
let cachedLeaderboardData = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to fetch data from Google Sheets
async function fetchFromGoogleSheets() {
  try {
    const response = await sheets.spreadsheets.values.get({
      key: process.env.GOOGLE_SHEETS_API_KEY,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A2:H50',
    });

    const rows = response.data.values || [];
    
    const performers = rows
      .filter(row => row[0] && row[1]) // Ensure name and score exist
      .map((row, index) => ({
        id: String(index + 1),
        name: row[0] || '',
        score: parseInt(row[1]) || 0,
        completed: parseInt(row[2]) || 0,
        revisions: parseInt(row[3]) || 0,
        overdue: parseInt(row[4]) || 0,
        streak: parseInt(row[5]) || 0,
        profilePic: row[6] || null
      }))
      .sort((a, b) => b.score - a.score); // Sort by score descending

    // Calculate stats
    const totalTasks = performers.reduce((sum, p) => sum + p.completed + p.revisions + p.overdue, 0);
    const completed = performers.reduce((sum, p) => sum + p.completed, 0);
    const revisions = performers.reduce((sum, p) => sum + p.revisions, 0);
    const overdue = performers.reduce((sum, p) => sum + p.overdue, 0);
    const completionPercentage = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    const now = new Date();
    const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const daysIntoMonth = now.getDate();

    const stats = {
      monthName,
      totalTasks,
      completed,
      revisions,
      overdue,
      completionPercentage,
      daysIntoMonth
    };

    return { performers, stats };
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    throw error;
  }
}

// Helper function to get mock data as fallback
function getMockData() {
  const performers = [
    {
      id: '1',
      name: 'Iskanchal',
      score: 2850,
      completed: 47,
      revisions: 2,
      overdue: 0,
      streak: 12,
      profilePic: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: 'Goutam',
      score: 2720,
      completed: 42,
      revisions: 5,
      overdue: 1,
      streak: 8,
      profilePic: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: 'Aman',
      score: 2650,
      completed: 39,
      revisions: 3,
      overdue: 0,
      streak: 15,
      profilePic: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '4',
      name: 'Anushka',
      score: 2400,
      completed: 35,
      revisions: 8,
      overdue: 2,
      streak: 0,
      profilePic: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '5',
      name: 'Anuska Accounts',
      score: 2200,
      completed: 32,
      revisions: 4,
      overdue: 1,
      streak: 5,
      profilePic: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '6',
      name: 'Sudhansu',
      score: 2100,
      completed: 29,
      revisions: 6,
      overdue: 0,
      streak: 3,
      profilePic: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '7',
      name: 'Ravi',
      score: 1950,
      completed: 28,
      revisions: 3,
      overdue: 0,
      streak: 7,
      profilePic: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '8',
      name: 'Akshay',
      score: 1850,
      completed: 26,
      revisions: 5,
      overdue: 1,
      streak: 2,
      profilePic: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '9',
      name: 'Abhishek Pal',
      score: 1750,
      completed: 24,
      revisions: 2,
      overdue: 0,
      streak: 9,
      profilePic: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '10',
      name: 'Suman',
      score: 1650,
      completed: 22,
      revisions: 4,
      overdue: 2,
      streak: 0,
      profilePic: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '11',
      name: 'Subhroto',
      score: 1550,
      completed: 21,
      revisions: 1,
      overdue: 0,
      streak: 11,
      profilePic: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '12',
      name: 'Nandini',
      score: 1450,
      completed: 19,
      revisions: 6,
      overdue: 1,
      streak: 1,
      profilePic: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '13',
      name: 'Ayush',
      score: 1350,
      completed: 18,
      revisions: 2,
      overdue: 0,
      streak: 6,
      profilePic: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '14',
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
}

// Function to get leaderboard data with caching
async function getLeaderboardData() {
  const now = Date.now();
  
  // Return cached data if it's still fresh
  if (cachedLeaderboardData && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedLeaderboardData;
  }

  try {
    // Try to fetch from Google Sheets
    const data = await fetchFromGoogleSheets();
    cachedLeaderboardData = data;
    lastFetchTime = now;
    console.log('✅ Successfully fetched data from Google Sheets');
    return data;
  } catch (error) {
    console.warn('⚠️ Failed to fetch from Google Sheets, using mock data:', error.message);
    // Fallback to mock data
    const mockData = getMockData();
    cachedLeaderboardData = mockData;
    lastFetchTime = now;
    return mockData;
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const data = await getLeaderboardData();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      cached: lastFetchTime ? Date.now() - lastFetchTime < CACHE_DURATION : false
    });
  } catch (error) {
    console.error('Error in /api/leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard data',
      message: error.message
    });
  }
});

app.post('/api/refresh', async (req, res) => {
  try {
    // Force refresh by clearing cache
    cachedLeaderboardData = null;
    lastFetchTime = null;
    
    const data = await getLeaderboardData();
    res.json({
      success: true,
      message: 'Data refreshed successfully',
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/refresh:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh data',
      message: error.message
    });
  }
});

// Scheduled data refresh every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('🔄 Scheduled refresh starting...');
  try {
    cachedLeaderboardData = null;
    lastFetchTime = null;
    await getLeaderboardData();
    console.log('✅ Scheduled refresh completed');
  } catch (error) {
    console.error('❌ Scheduled refresh failed:', error);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Leaderboard API: http://localhost:${PORT}/api/leaderboard`);
  console.log(`🔄 Refresh API: http://localhost:${PORT}/api/refresh`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
  
  // Initial data load
  getLeaderboardData().then(() => {
    console.log('📈 Initial leaderboard data loaded');
  }).catch(error => {
    console.error('❌ Failed to load initial data:', error);
  });
});