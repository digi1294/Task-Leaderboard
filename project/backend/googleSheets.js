// backend/googleSheets.js

const { google } = require('googleapis');
require('dotenv').config();

const CREDENTIALS_PATH = './credentials.json';
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// --- THIS IS THE FIX ---
// We add a check to make sure SHEET_NAMES exists in the .env file.
const SHEET_NAMES_STR = process.env.SHEET_NAMES;
if (!SHEET_NAMES_STR) {
    throw new Error("FATAL ERROR: SHEET_NAMES is not defined in your .env file. Please add it, for example: SHEET_NAMES=Sheet1,Sheet2");
}
// If the variable exists, we split it into an array and trim whitespace from each name.
const SHEET_NAMES = SHEET_NAMES_STR.split(',').map(name => name.trim());

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });
  const authClient = await auth.getClient();
  return authClient;
}

/**
 * Fetches data from multiple sheets and returns it as an object
 * where keys are the sheet names.
 * @returns {Promise<Object>} e.g., { "Sheet1": [...], "Sheet2": [...] }
 */
async function getSheetData() {
  try {
    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges: SHEET_NAMES,
    });

    const valueRanges = response.data.valueRanges;
    if (!valueRanges || valueRanges.length === 0) {
      console.log('No data found in any of the specified sheets.');
      return {};
    }

    const allSheetData = {};

    valueRanges.forEach(rangeResult => {
      // Get clean sheet name. The range can be 'Sheet1!A1:Z1000' or just 'Sheet1'.
      const sheetName = rangeResult.range.split('!')[0].replace(/'/g, ''); 
      const rows = rangeResult.values;

      if (rows && rows.length > 0) {
        const header = rows[0];
        const dataRows = rows.slice(1);

        const data = dataRows.map((row) => {
          const rowData = {};
          if (row) {
            header.forEach((key, index) => {
              // Sanitize key to be a valid JS identifier
              const sanitizedKey = typeof key === 'string' ? key.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '') : `column_${index}`;
              rowData[sanitizedKey] = row[index];
            });
          }
          return rowData;
        }).filter(obj => Object.keys(obj).length > 0);
        
        allSheetData[sheetName] = data;
      } else {
        console.log(`Sheet "${sheetName}" is empty or has no data.`);
        allSheetData[sheetName] = []; // Add empty array for sheets with no data
      }
    });

    return allSheetData;

  } catch (error) {
    console.error('Detailed error from Google Sheets API:', error);
    throw new Error('Could not retrieve data from Google Sheets.');
  }
}

module.exports = { getSheetData };
