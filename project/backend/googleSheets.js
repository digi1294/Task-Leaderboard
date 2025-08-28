// backend/googleSheets.js

// This line imports the googleapis library, which is needed to interact with Google services.
const { google } = require('googleapis');

// This line imports and configures the `dotenv` library.
// It allows us to use a `.env` file to securely store environment variables
// like your Spreadsheet ID, so they aren't hardcoded in the source code.
require('dotenv').config();

// --- CONFIGURATION ---
// The following settings are loaded from your `.env` file, which you must create on the server.
// See the instructions below the code block.

// The path to your service account key file. We've been using 'credentials.json'.
const CREDENTIALS_PATH = './credentials.json';

// Your unique Google Spreadsheet ID. This is loaded from the .env file.
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// A comma-separated list of sheet names you want to read (e.g., "Sheet1,Players").
const SHEET_NAMES_STR = process.env.SHEET_NAMES;
// --- END CONFIGURATION ---


// We check to make sure the required environment variables exist. If not, the app will stop with a helpful error.
if (!SPREADSHEET_ID || !SHEET_NAMES_STR) {
  throw new Error("FATAL ERROR: GOOGLE_SHEET_ID and/or SHEET_NAMES are not defined in the .env file.");
}

// We split the string of sheet names into an array for the API call.
const SHEET_NAMES = SHEET_NAMES_STR.split(',').map(name => name.trim());

// The 'scope' tells Google what permissions we are requesting. 'readonly' means we can only view sheets, not change them.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

/**
 * Creates an authenticated Google Auth client.
 */
async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });
  const authClient = await auth.getClient();
  return authClient;
}

/**
 * Fetches data from all sheets listed in the SHEET_NAMES variable.
 * It uses the first row of each sheet as a header to create structured JSON data.
 * @returns {Promise<Object>} An object where each key is a sheet name and the value is an array of data rows.
 */
async function getSheetData() {
  try {
    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Use `batchGet` to fetch multiple sheets in a single, efficient API call.
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

    // Process the results for each sheet.
    valueRanges.forEach(rangeResult => {
      const sheetName = rangeResult.range.split('!')[0].replace(/'/g, ''); 
      const rows = rangeResult.values;

      if (rows && rows.length > 1) { // We need at least a header row and one data row.
        const header = rows[0];
        const dataRows = rows.slice(1);

        const data = dataRows.map((row) => {
          const rowData = {};
          if (row) {
            header.forEach((key, index) => {
              // Sanitize header key to be a valid JS object key.
              const sanitizedKey = typeof key === 'string' ? key.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '') : `column_${index}`;
              rowData[sanitizedKey] = row[index];
            });
          }
          return rowData;
        }).filter(obj => Object.keys(obj).length > 0); // Filter out any completely empty rows.
        
        allSheetData[sheetName] = data;
      } else {
        allSheetData[sheetName] = []; // Add an empty array for sheets with no data rows.
      }
    });

    return allSheetData;

  } catch (error) {
    console.error('Detailed error from Google Sheets API:', error.message);
    throw new Error('Could not retrieve data from Google Sheets.');
  }
}

// Makes the getSheetData function available to be used in other files like index.js.
module.exports = { getSheetData };