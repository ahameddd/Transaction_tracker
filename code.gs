const SPREADSHEET_ID = ''; // Leave empty if creating script from spreadsheet

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'transaction') {
      // Get the spreadsheet
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      
      // Convert the record type to proper sheet name format
      let sheetName = data.record
        .split(/(?=[A-Z])/) // Split on capital letters
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
        .join(' ');
      
      // Handle special cases
      if (sheetName === 'Sales') sheetName = 'Sales';
      if (sheetName === 'Sea Food') sheetName = 'Sea Food';
      if (sheetName === 'Char Coal') sheetName = 'Char Coal';
      if (sheetName === 'Packing Materials') sheetName = 'Packing Materials';
      if (sheetName === 'Cleaning Materials') sheetName = 'Cleaning Materials';
      if (sheetName === 'Sakthi Masala') sheetName = 'Sakthi Masala';
      if (sheetName === 'Electricity Charges') sheetName = 'Electricity Charges';
      if (sheetName === 'Taxes & Municipality') sheetName = 'Taxes & Municipality';
      if (sheetName === 'Bank Dues') sheetName = 'Bank Dues';
      if (sheetName === 'Wages & Rent') sheetName = 'Wages & Rent';
      if (sheetName === 'Transport Charges') sheetName = 'Transport Charges';
      if (sheetName === 'Repairs & Maintenance') sheetName = 'Repairs & Maintenance';
      if (sheetName === 'Store Stock') sheetName = 'Store Stock';
      if (sheetName === 'Other Expenses') sheetName = 'Other Expenses';
      
      // Get the appropriate sheet based on the record type
      let sheet = ss.getSheetByName(sheetName);
      
      if (!sheet) {
        // Create sheet if it doesn't exist
        sheet = ss.insertSheet(sheetName);
        // Add headers
        sheet.appendRow(['Date', 'Amount', 'Details', 'Staff', 'Timestamp']);
        sheet.setFrozenRows(1);
      }
      
      // Append the data to the appropriate sheet
      sheet.appendRow([
        data.date,
        data.amount,
        data.details,
        data.staff,
        data.timestamp
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        'success': true,
        'message': 'Transaction recorded successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      'success': false,
      'message': 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'success': false,
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('The API is working')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Function to create all sheets if they don't exist
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = [
    'Sales', 'Groceries', 'Vegetables', 'Rice', 'Oil', 'Chicken', 'Sea Food', 'Eggs',
    'Dairy Products', 'Water', 'LPG', 'Char Coal', 'Petrol', 'Packing Materials',
    'Cleaning Materials', 'Stationaries', 'Maida', 'Cashew', 'Sakthi Masala',
    'Coconut', 'Fruits', 'Noodles', 'Mutton', 'Onion', 'Beverages', 'Garlic',
    'Firewood', 'Electricity Charges', 'Taxes & Municipality', 'Bank Dues',
    'Wages & Rent', 'Transport Charges', 'Repairs & Maintenance', 'Store Stock',
    'Other Expenses'
  ];
  const headers = ['Date', 'Amount', 'Details', 'Staff', 'Timestamp'];
  
  sheetNames.forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  });
} 