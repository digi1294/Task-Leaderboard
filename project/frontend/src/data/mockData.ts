// Mock data for demonstration purposes
// In production, this would be replaced with Google Sheets API integration

export const mockStats = {
  monthName: 'December 2024',
  totalTasks: 156,
  completed: 134,
  revisions: 18,
  overdue: 4,
  completionPercentage: 86,
  daysIntoMonth: 15
};

// Extended to 25 team members
export const mockPerformers = [
  {
    id: '1',
    name: 'Iskanchal',
    score: 2850,
    completed: 47,
    revisions: 2,
    overdue: 0,
    completionRate: 96,
    streak: 12,
    badges: [
      { type: 'no-revisions' as const, label: 'Perfect Quality', icon: null },
      { type: 'streak' as const, label: '12 Day Streak', icon: null },
      { type: 'fast-finisher' as const, label: 'Speed Demon', icon: null }
    ]
  },
  {
    id: '2',
    name: 'Goutam',
    score: 2720,
    completed: 42,
    revisions: 5,
    overdue: 1,
    completionRate: 88,
    streak: 8,
    badges: [
      { type: 'streak' as const, label: '8 Day Streak', icon: null }
    ]
  },
  {
    id: '3',
    name: 'Aman',
    score: 2650,
    completed: 39,
    revisions: 3,
    overdue: 0,
    completionRate: 93,
    streak: 15,
    badges: [
      { type: 'no-revisions' as const, label: 'Quality Focus', icon: null },
      { type: 'streak' as const, label: '15 Day Streak', icon: null }
    ]
  },
  {
    id: '4',
    name: 'Anushka',
    score: 2400,
    completed: 35,
    revisions: 8,
    overdue: 2,
    completionRate: 78,
    streak: 0,
    badges: []
  },
  {
    id: '5',
    name: 'Anuska Accounts',
    score: 2200,
    completed: 32,
    revisions: 4,
    overdue: 1,
    completionRate: 84,
    streak: 5,
    badges: [
      { type: 'fast-finisher' as const, label: 'Quick Turner', icon: null }
    ]
  },
  {
    id: '6',
    name: 'Sudhansu',
    score: 2100,
    completed: 29,
    revisions: 6,
    overdue: 0,
    completionRate: 83,
    streak: 3,
    badges: []
  },
  {
    id: '7',
    name: 'Ravi',
    score: 1950,
    completed: 28,
    revisions: 3,
    overdue: 0,
    completionRate: 90,
    streak: 7,
    badges: [
      { type: 'streak' as const, label: '7 Day Streak', icon: null }
    ]
  },
  {
    id: '8',
    name: 'Akshay',
    score: 1850,
    completed: 26,
    revisions: 5,
    overdue: 1,
    completionRate: 81,
    streak: 2,
    badges: []
  },
  {
    id: '9',
    name: 'Abhishek Pal',
    score: 1750,
    completed: 24,
    revisions: 2,
    overdue: 0,
    completionRate: 92,
    streak: 9,
    badges: [
      { type: 'no-revisions' as const, label: 'Quality Focus', icon: null },
      { type: 'streak' as const, label: '9 Day Streak', icon: null }
    ]
  },
  {
    id: '10',
    name: 'Suman',
    score: 1650,
    completed: 22,
    revisions: 4,
    overdue: 2,
    completionRate: 79,
    streak: 0,
    badges: []
  },
  {
    id: '11',
    name: 'Subhroto',
    score: 1550,
    completed: 21,
    revisions: 1,
    overdue: 0,
    completionRate: 95,
    streak: 11,
    badges: [
      { type: 'no-revisions' as const, label: 'Perfect Quality', icon: null },
      { type: 'streak' as const, label: '11 Day Streak', icon: null }
    ]
  },
  {
    id: '12',
    name: 'Nandini',
    score: 1450,
    completed: 19,
    revisions: 6,
    overdue: 1,
    completionRate: 73,
    streak: 1,
    badges: []
  },
  {
    id: '13',
    name: 'Ayush',
    score: 1350,
    completed: 18,
    revisions: 2,
    overdue: 0,
    completionRate: 90,
    streak: 6,
    badges: [
      { type: 'streak' as const, label: '6 Day Streak', icon: null }
    ]
  },
  {
    id: '14',
    name: 'Prateek Intern',
    score: 1250,
    completed: 17,
    revisions: 3,
    overdue: 2,
    completionRate: 77,
    streak: 0,
    badges: []
  }
];

export const mockSidebarData = {
  doerOfTheWeek: {
    name: 'Iskanchal',
    score: 2850,
    badges: ['🎯 Perfect Quality', '🔥 12 Day Streak', '⚡ Speed Demon']
  },
  overdueSpotlight: {
    count: 3,
    names: ['Goutam', 'Anushka', 'Anuska Accounts']
  }
};

export const mockChartData = Array.from({ length: 15 }, (_, i) => ({
  day: i + 1,
  completed: Math.floor(Math.random() * 50) + 30,
  revised: Math.floor(Math.random() * 15) + 5,
  overdue: Math.floor(Math.random() * 8) + 1
}));

export const mockUnsatisfiedClients = [
  'TechCorp Solutions - Project delays affecting Q4 deliverables',
  'Global Industries - Communication gaps in weekly updates', 
  'Innovation Labs - Quality concerns on recent submissions',
  'Future Systems - Missing deadline expectations consistently',
  'Digital Dynamics - Revision requests exceeding agreed scope'
]