const table = document.querySelectorAll("table.mws-table");
const thead = document.querySelectorAll("table.mws-table > thead > tr > th"); // pwede pala ito
const tbody = document.getElementsByTagName("tbody"); 

// Class Schedule Table (index 1 is for the Weekly View Table)
// console.log(table[0]); 
// console.log(thead); 
// console.log(tbody[0]);

// get headers
const tableHeaders = [];
for (let i = 0; i < thead.length; i++) {
    // console.log(thead.item(i).innerText);
    tableHeaders.push(thead.item(i).innerText);
}

console.log(tableHeaders); // just realized that i might not be needing the headers after all lolz (unless maybe i implement json conversion)

// get number of subjects
// Count the number of <tr> elements in <tbody> - 1 (total units)
const tbodyRows = tbody[0].rows;
const courseCount = tbodyRows.length - 1;
console.log("Number of courses enrolled: " + courseCount);

// get data 
const courseScheduleDetails = [];
console.log("Schedule details of enrolled courses: ")
for (let i = 0; i < courseCount; i++) {
    console.log(tbodyRows.item(i).innerText.replaceAll(/\t/g,',')); // remove tab whitespace and replace with comma
    courseScheduleDetails.push(tbodyRows.item(i).innerText.replaceAll(/\t/g,','));
}

console.log(courseScheduleDetails);

/* NOTES:
    - If marked as DAILY, event frequency should be monday to saturday
*/

// Variables for schedule details
const eventTitle = "";
const startDate = "";
const endDate = "";
const startTime = "";
const endTime = "";
const description = "";
const room = "";

// CSV Headers accordingly
const csvHeaders = "Subject,Start Date,End Date,Start Time, End Time,Description,Location"

// function for .csv processing


// function for .ics processing