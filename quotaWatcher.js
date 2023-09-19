/**
 * Function to call whenever a URL is fetched
 */
function urlFetched() {
    let sheet = SpreadsheetApp.openById(quotaWatcherSSID).getSheets()
    .filter((s) => s.getSheetId() === quotaSheetID)[0];

    let urlFetchedRange = sheet.getRange(urlFetchedRow, urlFetchedCol);

    if (urlFetchedRange.getValue() >= urlFetchLimit) {
      throw new RangeError("URL Fetch Calls limit reached");
    }

    urlFetchedRange.setValue(urlFetchedRange.getValue() + 1);

    if (urlFetchedRange.getValue() === 1) {
      createLimitTrigger("resetURLFetched");
    }
}

function resetURLFetched() {
    let sheet = SpreadsheetApp.openById(quotaWatcherSSID).getSheets()
    .filter((s) => s.getSheetId() === quotaSheetID)[0];

    let urlFetchedRange = sheet.getRange(urlFetchedRow, urlFetchedCol);
    urlFetchedRange.setValue(0);
}

function createLimitTrigger(functionName) {
    ScriptApp.newTrigger(functionName)
    .timeBased()
    .after(24 * 60 * 60 * 1000)
    .create();
}

function printScriptTriggerFunctionHandles() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var triggers = ScriptApp.getProjectTriggers();
    // Log the event type for the first trigger in the array.
    Logger.log(triggers[0].getEventType());
}