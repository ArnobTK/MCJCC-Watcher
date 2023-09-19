/**
 * Writes after the end of the last row of data of the specified sheet in the specified
 * spreadsheet using a 2D array.
 * @param {String} spreadsheetID - The ID of the spreadsheet to write in.
 * @param {String} sheetName - The name of the sheet to write to.
 * @param {Array<Array<String>>} - The 2D array with the values to write.
 */
function writeAfterLastRow(spreadsheetID, sheetName, array) {

    if (!(typeof spreadsheetID === 'string') && !(spreadsheetID instanceof String)) {
        throw new TypeError("Invalid Spreadsheet ID '" + spreadsheetID + "'. spreadsheetID must be a String");
    } 

    if (!SpreadsheetApp.openById(spreadsheetID)) {
        throw new RangeError("Invalid Spreadsheet ID '" + spreadsheetID + "'. spreadsheetID does not exist");
    }

    if (!(typeof sheetName === 'string') && !(sheetName instanceof String)) {
        throw new TypeError("Invalid Sheet Name '" + sheetName + "'. sheetName must be a String");
    }

    if (!SpreadsheetApp.openById(spreadsheetID).getSheetByName(sheetName)) {
        throw new RangeError("Invalid Sheet Name '" + sheetName + "'. sheetName does not exist");
    }

    if (!array[0][0]) {
        console.log("Empty Array");
        return;
    }

    let sheet = SpreadsheetApp.openById(spreadsheetID).getSheetByName(sheetName);
    let range = sheet.getRange(sheet.getLastRow() + 1, 1, array.length, array[0].length);
    range.setValues(array);

}