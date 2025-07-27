/* TODO: Check the schedule under the DAYS header from the portal if it is for this day. 
If not, don't process for csv and only append the one that's scheduled 
(e.g., THFS (Thursday, Friday, Saturday), DAILY (Monday to Saturday),  TTHS (Tuesday, Thursday, Saturday)) */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);

    switch (request.message) {
        case "ics":
            alert("Exporting to iCalendar is not yet available. \nCurrently working on it!");
            break;
        case "csv":
            exportToCSV();
            break;
        case "json":
            alert("Exporting to JSON is not yet available.");
            break;
        default:
            console.log(request.message);
    }
});

// AY 2024 - 2025 (this must be updated per AY)
let firstSemEndDate = "12/16/2024" // first semester
let secondSemEndDate = "05/22/2025" // second semester
let shortTermEndDate = "07/22/2025" // short term

// Get current date
const currentDate = new Date().toLocaleDateString();

// Get current day (0 - 6; Sunday - Saturday)
const currentDayOfTheWeek = new Date().getDay();

// Read class schedule table from schedule tab of portal
const table = document.querySelectorAll("table.mws-table");
const thead = document.querySelectorAll("table.mws-table > thead > tr > th"); 
const tbody = document.getElementsByTagName("tbody"); 

// Get class schedule table headers
const tableHeaders = [];
for (let i = 0; i < thead.length; i++) {
    tableHeaders.push(thead.item(i).innerText);
}

// Count number of courses enrolled
const tbodyRows = tbody[0].rows;
const courseCount = tbodyRows.length - 1;
console.log("Number of courses enrolled: " + courseCount);

// Get course schedule data
console.log("Schedule details of enrolled courses: ")

const courseScheduleDetails = [];
for (let i = 0; i < courseCount; i++) {
    let courseSchedule = tbodyRows.item(i).innerText.replaceAll(/\t/g,',');
    courseSchedule = courseSchedule.substring(0, courseSchedule.length - 1);

    console.log(courseSchedule);

    courseScheduleDetails.push(courseSchedule);
}

// CSV Processing (.csv)
// note: removed end date due to csv not supporting recurring events
function exportToCSV() {
    const csvHeaders = ["Subject", "Start Date", "Start Time", "End Time", "Description", "Location"];

    let subject = [];
    let startDate = currentDate;

    if (startDate < 10) {
        startDate = "0" + currentDate;
    }

    // let endDate = shortTermEndDate;
    let startTime = [];
    let endTime = [];
    let description = [];
    let room = [];
    let dayOfTheWeek = [];

    let csvContent = csvHeaders.join(",");

    console.log("Today is a " + currentDayOfTheWeek);
    for (let i = 0; i < courseScheduleDetails.length; i++) {
        csvContent += "\n";

        let scheduleElements = courseScheduleDetails[i].split(",");

        dayOfTheWeek.push(scheduleElements[5]);
        
        let days = dayOfTheWeek[i].split('').join(',');
        console.log("Weekly Schedule: ");

        days = days.split(',');
        console.log(days);

        let weeklySchedule = [];

        // checking for 'T' and 'TH' case
        for (let j = 0; j < days.length; j++) {
            if (days[j] == 'T') {
                console.log("This is a tuesday? or a thursday?");
                if (days[j + 1] == 'H') {
                    console.log("This is a thursday!");
                    weeklySchedule.push(days[j] + days[j + 1]);
                    console.log(weeklySchedule);
                } else {
                    console.log("This is a tuesday!");
                }
            } 
        }

        subject.push(scheduleElements[1] + " (" + scheduleElements[0] + ")"); 
        csvContent += subject[i] + ",";

        csvContent += startDate + ",";

        let startTimeString = scheduleElements[4].substring(0, 2) + ":" + scheduleElements[4].substring(2, 4) + " " + scheduleElements[4].substring(12, 14); // this could have an issue with am/pm overlap
        startTime.push(startTimeString);
        csvContent += startTime[i] + ",";

        let endTimeString = scheduleElements[4].substring(7, 9) + ":" + scheduleElements[4].substring(9, 11) + " " + scheduleElements[4].substring(12, 14);
        endTime.push(endTimeString);
        csvContent += endTime[i] + ","

        description.push(scheduleElements[2]);
        csvContent += description[i] + ",";

        room.push(scheduleElements[6]);
        csvContent += room[i];
    }

    console.log(csvContent);

    const download = (data) => {
        const csvBlob = new Blob([data], {type: 'text/csv;charset=utf-8'});
        const csvURL = URL.createObjectURL(csvBlob);

        const a = document.createElement('a');

        a.href = csvURL;
        a.download = 'slu-portal-schedule.csv';

        a.click();
    }

    download(csvContent); 

    return csvContent;
}

// TODO: iCalendar Processing (.ics)
function exportToICS() {

}