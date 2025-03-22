const SPREADSHEET_ID = ''; // Leave empty if creating script from spreadsheet

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get the appropriate sheet based on the record type
    const sheet = ss.getSheetByName(data.record.charAt(0).toUpperCase() + data.record.slice(1));
    
    if (!sheet) {
      throw new Error('Sheet not found for record type: ' + data.record);
    }
    
    // Append the data to the appropriate sheet
    sheet.appendRow([
      data.date,
      data.amount,
      data.details,
      data.timestamp
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("The API is working");
}

// Add this function to create sheets if they don't exist
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = ['Sales', 'Chicken', 'Maida', 'Oil'];
  const headers = ['Date', 'Amount', 'Details', 'Timestamp'];
  
  sheetNames.forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  });
} 