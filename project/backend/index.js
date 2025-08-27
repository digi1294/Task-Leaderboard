// backend/index.js

require('dotenv').config();
const express = require('express');
const cors =require('cors');
const { getSheetData } = require('./googleSheets');

const app = express();
const PORT = process.env.PORT || 3001;

// This is a simple "route" handler for the homepage.
// It tells the server what to do when someone visits the main URL.
app.get('/', (req, res) => {
  res.send('<h1>Success!</h1><p>Your Leaderboard application is running on Google Cloud!</p>');
});

app.use(cors());
app.use(express.json());

let cache = {
  data: null,
  lastFetch: 0,
};
let previousLeader = null; // For sound triggers

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * A helper function to parse dates from your sheet, assuming dd/mm/yyyy format.
 * @param {string} dateStr - The date string from the Google Sheet.
 * @returns {Date|null} A Date object or null if invalid.
 */
function parseDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    try {
        const parts = dateStr.split(' ')[0].split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return isNaN(date) ? null : date;
    } catch (e) {
        return null;
    }
}


/**
 * Processes data from the Master sheet with advanced scoring and trend calculation.
 * @param {Object} allSheets - An object with sheet names as keys and data arrays as values.
 * @returns {Object} - Contains the processed performers, stats, and trend data.
 */
function processAndFormatData(allSheets) {
  const masterList = allSheets['Master'];

  if (!masterList || masterList.length === 0) {
    console.error("Error: 'Master' sheet not found or is empty.");
    return { performers: [], stats: {}, trendData: {} };
  }

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthTasks = [];
  const lastMonthTasks = [];

  // 1. Separate tasks into current month and last month based on 'Latest Revision' date.
  masterList.forEach(task => {
    const taskDate = parseDate(task.latestrevision);
    if (taskDate) {
      if (taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear) {
        currentMonthTasks.push(task);
      } else if (taskDate.getMonth() === lastMonth && taskDate.getFullYear() === lastMonthYear) {
        lastMonthTasks.push(task);
      }
    }
  });

  // 2. A helper function to calculate stats for a given list of tasks.
  const calculateStatsForPeriod = (tasks) => {
    const stats = { completed: 0, revisions: 0 };
    tasks.forEach(task => {
        if (task.status && task.status.toLowerCase() === 'completed') {
            stats.completed++;
        }
        stats.revisions += parseInt(task.totalrevisions, 10) || 0;
    });
    return stats;
  };

  const currentMonthStats = calculateStatsForPeriod(currentMonthTasks);
  const lastMonthStats = calculateStatsForPeriod(lastMonthTasks);

  // 3. Calculate Trend Data
  const qualityScore = currentMonthStats.completed > 0 
    ? (((currentMonthStats.completed - currentMonthStats.revisions) / currentMonthStats.completed) * 10).toFixed(1)
    : '0.0';
  
  const velocityChange = lastMonthStats.completed > 0
    ? Math.round(((currentMonthStats.completed - lastMonthStats.completed) / lastMonthStats.completed) * 100)
    : (currentMonthStats.completed > 0 ? 100 : 0); // If last month was 0, any completion is a 100% increase

  const trendData = {
      vsLastMonth: velocityChange,
      qualityScore: parseFloat(qualityScore),
      teamVelocity: currentMonthStats.completed > 20 ? 'High' : (currentMonthStats.completed > 10 ? 'Medium' : 'Low')
  };

  // 4. Process the main leaderboard stats using ONLY current month's tasks.
  const doerStats = {};
  currentMonthTasks.forEach(task => {
    const performerName = task.name;
    const status = task.status ? task.status.toLowerCase() : '';
    const totalRevisions = parseInt(task.totalrevisions, 10) || 0;
    const latestRevisionDateStr = task.latestrevision;
    
    if (performerName && typeof performerName === 'string' && performerName.trim() !== '') {
      const cleanName = performerName.split(' - ')[0].trim();
      if (!doerStats[cleanName]) {
        doerStats[cleanName] = { completed: 0, revisions: 0, overdue: 0, lastCompletionDate: null };
      }
      doerStats[cleanName].revisions += totalRevisions;
      if (status === 'completed') {
        doerStats[cleanName].completed += 1;
        const completionDate = parseDate(latestRevisionDateStr);
        if (completionDate && (!doerStats[cleanName].lastCompletionDate || completionDate > doerStats[cleanName].lastCompletionDate)) {
            doerStats[cleanName].lastCompletionDate = completionDate;
        }
      } else if (status === 'pending') {
        const dueDate = parseDate(latestRevisionDateStr);
        if (dueDate && dueDate < today) {
          doerStats[cleanName].overdue += 1;
        }
      } else if (status === 'overdue') {
        doerStats[cleanName].overdue += 1;
      }
    }
  });

  const performers = Object.entries(doerStats).map(([name, stats]) => {
    const score = (stats.completed * 10) - (stats.revisions * 1) - (stats.overdue * 2);
    return {
      id: name, name, score, ...stats,
      profilePic: `https://i.pravatar.cc/40?u=${name.replace(/\s/g, '')}`
    };
  }).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (!a.lastCompletionDate) return 1;
    if (!b.lastCompletionDate) return -1;
    return b.lastCompletionDate - a.lastCompletionDate;
  });

  const overallStats = {
    monthName: today.toLocaleString('default', { month: 'long' }),
    totalTasks: currentMonthTasks.length,
    completed: currentMonthStats.completed,
    revisions: currentMonthStats.revisions,
    overdue: performers.reduce((sum, p) => sum + p.overdue, 0),
    completionPercentage: currentMonthTasks.length > 0 ? Math.round((currentMonthStats.completed / currentMonthTasks.length) * 100) : 0,
    daysIntoMonth: today.getDate(),
  };

  return { performers, stats: overallStats, trendData };
}


async function dataHandler(req, res) {
  const now = Date.now();
  if (cache.data && (now - cache.lastFetch < CACHE_DURATION)) {
    console.log('Serving formatted data from cache.');
    return res.json(cache.data);
  }
  try {
    console.log('Fetching fresh data from Google Sheets...');
    const allSheetsData = await getSheetData();
    const formattedData = processAndFormatData(allSheetsData);

    // --- Sound Trigger Logic ---
    let soundTrigger = null;
    const currentLeader = formattedData.performers.length > 0 ? formattedData.performers[0].name : null;
    if (previousLeader && currentLeader && currentLeader !== previousLeader) {
        console.log(`SOUND TRIGGER: New leader detected! ${currentLeader} has overtaken ${previousLeader}.`);
        soundTrigger = 'new_leader';
    }
    previousLeader = currentLeader;

    // --- Create final payload ---
    const responsePayload = {
        ...formattedData, // This includes performers, stats, and trendData
        soundTrigger: soundTrigger, // Add the sound trigger flag
    };

    cache = { data: responsePayload, lastFetch: Date.now() };
    res.json(responsePayload);
  } catch (error) {
    console.error('Failed to get or process sheet data:', error);
    res.status(500).json({ error: 'Failed to retrieve data from the source.' });
  }
}

app.get('/api/leaderboard', dataHandler);

app.listen(PORT, () => {
  console.log(`Backend server is now running on http://localhost:${PORT}`);
});
