// CheerioGS documentation: https://github.com/tani/cheeriogs

function main() {
    let x = mcjccQuery(3822, new Date(2023, 8, 15), 7);
    writeAfterLastRow(testSSID, "Test Sheet 1", x);
}

/**
 * Queries MCJCC for info on cases happening on specific days.
 * @param {integer} id - A valid Court ID. See Constants.gs for list of valid IDs.
 * @param {Date} startDate - A valid start date from which to search the website.
 * @param {integer} length - A positive integer specifying how many days in the
 *  future to query.
 * @return {Array<Array<String>>} rows - Rows of case data
 */
function mcjccQuery(id, startDate, length) {

    if (!courtIDs[id]) {
        throw new RangeError("Invalid ID '" + id + "'. id must be a valid court ID");
    }

    if (!(Object.prototype.toString.call(startDate) === "[object Date]") 
          || isNaN(startDate)) {
        throw new TypeError("Invalid Date'" + startDate + "'. startDate must be a Date object");
    }

    if (!Number.isInteger(length) || length < 1) {
        throw new TypeError("Invalid Length'" + length + "'. length must be an integer greater than 0");
    }

    // Create MCJCC URL

    let url = "https://justicecourts.maricopa.gov"
    + "/app/courtrecords/CourtCalendar?";
    
    let urlID = "id=" + id;
    let urlSD = "startdate=" + startDate.toLocaleDateString("US-en");
    let urlLen = "length=" + length;

    url = url + urlID + "&" + urlSD + "&" + urlLen;
   
    let content = UrlFetchApp.fetch(url).getContentText();
    urlFetched();
    let $ = Cheerio.load(content);

    let rows = [];

    let caseCalendarWrapper = "#MainContent_CourtCalendarRepeater_DivCaseCalendarWrapper_";
    let caseInfoDiv = "#MainContent_CourtCalendarRepeater_DivCaseInfo_";
    let dateLiteralDiv = "#MainContent_CourtCalendarRepeater_DivStartDateLiteral_";
    let startTimeDiv = "#MainContent_CourtCalendarRepeater_DivStartTime_";
    let trialTypeDiv = "#MainContent_CourtCalendarRepeater_DivType_";
    let partyName1Div = "#MainContent_CourtCalendarRepeater_DivPartyName1_";

    let count = 0;

    // Continue until a calendar wrapper doesn't exist.

    while($(caseCalendarWrapper + count).length) {

        if ($(caseInfoDiv + count).length) {
            let caseInfo = $(caseInfoDiv + count).text().trim();
            let dateLiteral = $(dateLiteralDiv + count).text().trim();
            let startTime = $(startTimeDiv + count).text().trim();
            // .replace regex expression from 
            // https://futurestud.io/tutorials/remove-extra-spaces-from-a-string-in-javascript-or-node-js
            let trialType = $(trialTypeDiv + count).text().replace(/\s+/g, ' ').trim();
            let partyName1 = $(partyName1Div + count).text().trim();

            rows.push([courtIDs[id], caseInfo, dateLiteral, startTime, trialType, partyName1])
        }
        count++;
        console.log(count);
    }    
    return rows;
}

/**
 * Iterates through script properties.
 */
function propertyIterator() {

    let courtIDProgress = parseInt(PropertiesService.getScriptProperties().getProperty("courtIDProgress"));
    let monthProgress = parseInt(PropertiesService.getScriptProperties().getProperty("monthProgress"));
    let sheetProgress = parseInt(PropertiesService.getScriptProperties().getProperty("sheetProgress"));

    if (monthProgress === 11) {
      monthProgress = 0;
      sheetProgress += 1;
    }

    if (sheetProgress === 2024) {
      sheetProgress = 2020;
      courtIDProgress += 1;
    }
}