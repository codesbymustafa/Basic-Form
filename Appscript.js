// Handle preflight OPTIONS requests for CORS
function doOptions(e) {
    // Create and return a response for preflight requests
    let output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.TEXT);
    
    // Set CORS headers to allow all origins
    return addCorsHeaders(output);
}

// Helper function to add CORS headers to responses
function addCorsHeaders(output) {
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  output.setHeader('Access-Control-Max-Age', '3600');
  return output;
}

// Function that will be called when the form submits data
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Access the spreadsheet by ID (you'll replace this with your spreadsheet ID)
    const spreadsheetId = '1CrSYBzYfMuSGNsMEEpJLRb_Hf32iB7v2EdKYmYlCr4M';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Registrations');
    
    // If the sheet doesn't exist, create it and add headers
    if (!sheet) {
      const ss = SpreadsheetApp.openById(spreadsheetId);
      const newSheet = ss.insertSheet('Registrations');
      
      // Define headers for the spreadsheet - Added Serial Number as first column
      const headers = [
        'Serial No.',
        'Timestamp',
        'First Name',
        'Last Name',
        'Age',
        'Phone Number',
        'Graduation Year',
        'Branch',
        'Scholar ID'
      ];
      
      newSheet.appendRow(headers);
      
      // Set formatting for header row
      newSheet.getRange(1, 1, 1, headers.length).setBackground('#bdbdbd').setFontColor('white').setFontWeight('bold');
      
      // Process the registration (no need to check for duplicates on first entry)
      return handleResponse(newSheet, data, false);
    }
    
    // Check if the Scholar ID already exists in the sheet
    const scholarIdExists = checkForDuplicateScholarId(sheet, data.scholarId);
    
    if (scholarIdExists) {
      // Return error if Scholar ID already exists
      let output = ContentService
        .createTextOutput(JSON.stringify({ 
          'status': 'error', 
          'message': 'A registration with this Scholar/Admission ID already exists.' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
      return addCorsHeaders(output);
    }
    
    // If no duplicate found, process the registration
    return handleResponse(sheet, data, true);
    
  } catch (error) {
    // Return error response with CORS headers
    let output = ContentService
      .createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.message }))
      .setMimeType(ContentService.MimeType.JSON);
    return addCorsHeaders(output);
  }
}

// Function to check if Scholar ID already exists
function checkForDuplicateScholarId(sheet, scholarId) {
  // Get all data from the sheet
  const data = sheet.getDataRange().getValues();
  
  // Find the index of the Scholar ID column (assuming it's the 9th column now - index 8)
  const scholarIdColIndex = 8;
  
  // Skip the header row (start from index 1)
  for (let i = 1; i < data.length; i++) {
    // If the Scholar ID matches any existing entry
    if (data[i][scholarIdColIndex] === scholarId) {
      return true; // Duplicate found
    }
  }
  
  return false; // No duplicate found
}

function handleResponse(sheet, data, hasExistingData) {
  // Get the next serial number
  const nextSerialNumber = getNextSerialNumber(sheet);
  
  // Prepare the data row
  const rowData = [
    nextSerialNumber, // Serial Number
    new Date(), // Timestamp
    data.firstName,
    data.lastName,
    data.age,
    data.phoneNumber,
    data.graduationYear,
    data.branch,
    data.scholarId
  ];
  
  // Append the data to the sheet
  sheet.appendRow(rowData);
  
  // Auto-resize columns to fit the data
  if (!hasExistingData) {
    sheet.autoResizeColumns(1, rowData.length);
  }
  
  // Return success response with CORS headers
  let output = ContentService
    .createTextOutput(JSON.stringify({ 'status': 'success', 'message': 'Registration successful!' }))
    .setMimeType(ContentService.MimeType.JSON);
  return addCorsHeaders(output);
}

// Function to get the next serial number
function getNextSerialNumber(sheet) {
  // Get the last row number
  const lastRow = sheet.getLastRow();
  
  // If only header row exists, start with 1
  if (lastRow === 1) {
    return 1;
  }
  
  // Get the last serial number and increment it
  const lastSerialNumber = sheet.getRange(lastRow, 1).getValue();
  return (typeof lastSerialNumber === 'number') ? lastSerialNumber + 1 : 1;
}

// This function allows testing the script by manually running it
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        age: "19",
        phoneNumber: "1234567890",
        graduationYear: "2028",
        branch: "CSE",
        scholarId: "24112011181"
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}