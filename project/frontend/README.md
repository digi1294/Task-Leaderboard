# DigitalInclined Task Leaderboard Dashboard

A sophisticated real-time leaderboard system with Google Sheets integration, designed for large screen displays to motivate and track team performance.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  Google Sheets  │
│   (React/Vite)  │◄──►│   (Express.js)  │◄──►│   (Data Source) │
│   Port: 5173    │    │   Port: 3001    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + Google Sheets API
- **Icons**: Lucide React
- **Deployment**: Static hosting + Node.js server

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Cloud Console account (for Sheets API)
- Google Sheets document with team data

### 1. Clone and Install
```bash
git clone <repository-url>
cd task-leaderboard-dashboard
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Google Sheets Configuration
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SHEET_RANGE=Sheet1!A2:H50

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Start Development
```bash
# Start both backend and frontend
npm run dev:full

# OR start separately
npm run server    # Backend only (port 3001)
npm run dev       # Frontend only (port 5173)
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 📊 Google Sheets Integration

### Setting Up Google Sheets API

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google Sheets API

2. **Create API Key**:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Restrict key to Google Sheets API
   - Copy the API key to your `.env` file

3. **Prepare Your Spreadsheet**:
   ```
   | A        | B     | C         | D         | E       | F      | G                    |
   |----------|-------|-----------|-----------|---------|--------|----------------------|
   | Name     | Score | Completed | Revisions | Overdue | Streak | Profile Picture URL  |
   | Iskanchal| 2850  | 47        | 2         | 0       | 12     | https://example.com  |
   | Goutam   | 2720  | 42        | 5         | 1       | 8      | https://example.com  |
   ```

4. **Share Your Sheet**:
   - Make the Google Sheet publicly readable
   - Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### Data Format Requirements

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| A (Name) | String | Team member name | ✅ |
| B (Score) | Number | Total performance score | ✅ |
| C (Completed) | Number | Completed tasks count | ✅ |
| D (Revisions) | Number | Tasks requiring revisions | ✅ |
| E (Overdue) | Number | Overdue tasks count | ✅ |
| F (Streak) | Number | Consecutive workdays | ✅ |
| G (Profile Pic) | URL | Profile picture URL | ❌ |

## 🔧 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### GET /api/leaderboard
Fetch current leaderboard data with caching.

**Response:**
```json
{
  "success": true,
  "data": {
    "performers": [
      {
        "id": "1",
        "name": "Iskanchal",
        "score": 2850,
        "completed": 47,
        "revisions": 2,
        "overdue": 0,
        "streak": 12,
        "profilePic": "https://example.com/pic.jpg"
      }
    ],
    "stats": {
      "monthName": "December 2024",
      "totalTasks": 156,
      "completed": 134,
      "revisions": 18,
      "overdue": 4,
      "completionPercentage": 86,
      "daysIntoMonth": 15
    }
  },
  "timestamp": "2024-12-15T10:30:00.000Z",
  "cached": false
}
```

#### POST /api/refresh
Force refresh data from Google Sheets, bypassing cache.

**Response:**
```json
{
  "success": true,
  "message": "Data refreshed successfully",
  "data": { /* same as leaderboard */ },
  "timestamp": "2024-12-15T10:30:00.000Z"
}
```

#### GET /api/health
Server health check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-15T10:30:00.000Z",
  "environment": "development"
}
```

### Error Responses
```json
{
  "success": false,
  "error": "Failed to fetch leaderboard data",
  "message": "Detailed error message"
}
```

## 🎮 Features Overview

### Leaderboard System
- **Top 3 Performers**: Medal display with detailed stats
- **Full Team Display**: Auto-paginated for all team members
- **Real-time Updates**: 5-minute auto-refresh from Google Sheets
- **Fallback System**: Mock data when Sheets unavailable

### Gamification
- **Badges**: 
  - 🎯 Perfect Quality (0 revisions)
  - 🔥 Streak (5+ consecutive days)
  - ⚡ Speed Demon (20+ completed tasks)
- **Doer of the Month**: Top performer spotlight
- **Progress Tracking**: Completion rates and trends

### Visual Features
- **Profile Pictures**: Professional team member photos
- **Responsive Design**: Optimized for large displays
- **Dark Theme**: Professional appearance
- **Smooth Animations**: Engaging transitions

## 🛠️ Development

### Project Structure
```
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── StatsBar.tsx
│   │   ├── TopPerformers.tsx
│   │   └── Sidebar.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAutoRefresh.ts
│   │   └── useLeaderboardData.ts
│   ├── services/           # API services
│   │   └── apiService.ts
│   ├── data/               # Mock data
│   │   └── mockData.ts
│   └── App.tsx
├── server/                 # Backend API
│   └── index.js
├── public/
└── package.json
```

### Key Components

#### `useLeaderboardData` Hook
Manages data fetching, caching, and error handling:
```typescript
const { performers, stats, isLoading, error, refresh } = useLeaderboardData();
```

#### `apiService`
Handles all API communication with error handling:
```typescript
import { apiService } from './services/apiService';

// Fetch data
const data = await apiService.getLeaderboardData();

// Force refresh
const freshData = await apiService.refreshData();
```

### Adding New Team Members
1. Add to Google Sheets
2. System automatically picks up new members
3. No code changes required

### Customizing Badges
Edit `src/hooks/useLeaderboardData.ts`:
```typescript
// Badge logic
if (performer.revisions === 0 && performer.completed > 0) {
  badges.push({ type: 'no-revisions', label: 'Perfect Quality', icon: null });
}
if (performer.streak >= 5) {  // Change threshold here
  badges.push({ type: 'streak', label: `${performer.streak} Day Streak`, icon: null });
}
```

## 🚀 Deployment

### Development
```bash
npm run dev:full
```

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
GOOGLE_SHEETS_API_KEY=your_production_api_key
GOOGLE_SHEET_ID=your_sheet_id
FRONTEND_URL=https://your-domain.com
```

### Deployment Options

#### Option 1: Static + Serverless
- **Frontend**: Deploy `dist/` to Netlify/Vercel
- **Backend**: Deploy to Heroku/Railway/Render

#### Option 2: Full Stack Hosting
- Deploy entire project to VPS/Cloud server
- Use PM2 for process management
- Nginx for reverse proxy

#### Option 3: Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "server"]
```

### Large Screen Display Setup
1. **Kiosk Mode**:
   ```bash
   # Chrome kiosk mode
   google-chrome --kiosk --disable-web-security http://localhost:5173
   ```

2. **Auto-start on Boot** (Linux):
   ```bash
   # Add to ~/.bashrc or create systemd service
   npm run dev:full
   ```

3. **Screen Resolution**: Optimized for 1920x1080 displays

## 🔍 Troubleshooting

### Common Issues

#### Google Sheets API Errors
```bash
# Check API key permissions
curl "https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/Sheet1!A2:H50?key={API_KEY}"
```

#### CORS Issues
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check browser console for CORS errors

#### Data Not Updating
- Check server logs: `npm run server`
- Verify Google Sheets permissions
- Test manual refresh: `POST /api/refresh`

#### Performance Issues
- Increase cache duration in `server/index.js`
- Optimize image sizes for profile pictures
- Check network connectivity to Google Sheets

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run server
```

### Health Monitoring
```bash
# Check server health
curl http://localhost:3001/api/health

# Check data freshness
curl http://localhost:3001/api/leaderboard | jq '.cached'
```

## 📈 Performance Optimization

### Backend Optimizations
- **Caching**: 5-minute cache reduces API calls
- **Scheduled Refresh**: Background updates every 5 minutes
- **Error Handling**: Graceful fallback to mock data
- **Connection Pooling**: Efficient Google Sheets API usage

### Frontend Optimizations
- **Image Optimization**: Compressed profile pictures
- **Lazy Loading**: Components load as needed
- **Efficient Re-renders**: React.memo and useMemo
- **Bundle Splitting**: Vite automatic code splitting

### Monitoring
- Server logs for API performance
- Browser DevTools for frontend performance
- Google Sheets API quota monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Update documentation if needed
5. Submit pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

### Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Manual testing checklist
- [ ] Data loads from Google Sheets
- [ ] Fallback to mock data works
- [ ] Auto-refresh functions
- [ ] All team members display correctly
- [ ] Badges calculate properly
```

## 📞 Support

### Getting Help
- Check this README first
- Review server logs for errors
- Test API endpoints manually
- Verify Google Sheets setup

### Contact
For setup assistance or customization requests, contact the DigitalInclined development team.

---

**🚀 Powered By Your Trust**