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
let firstSemEndDate = "12/18/2025" // first semester
let secondSemEndDate = "05/23/2026" // second semester
let shortTermEndDate = "07/22/2026" // short term

// Read class schedule table from schedule tab of portal
const table = document.querySelectorAll("table.mws-table");
const thead = document.querySelectorAll("table.mws-table > thead > tr > th"); 
const tbody = document.getElementsByTagName("tbody"); 

const currentDate = new Date().toLocaleDateString(); // Get current date

const currentDayOfTheWeek = new Date().getDay(); // Get current day (0 - 6; Sunday - Saturday)

const validDays = ['M', 'T', 'W', 'TH', 'F', 'S']; // Days distinguisher at portal

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

// console.log(courseScheduleDetails);

/* TODO: Check the schedule under the DAYS header from the portal if it is for this day. 
If not, don't process for csv and only append the one that's scheduled 
(e.g., THFS (Thursday, Friday, Saturday), DAILY (Monday to Saturday),  TTHS (Tuesday, Thursday, Saturday)) */
// CSV Processing
function exportToCSV() {
    const csvHeaders = ["Subject", "Start Date", "Start Time", "End Time", "Description", "Location"];

    let subject = [];
    let startDate = currentDate;

    if (startDate < 10) {
        startDate = "0" + currentDate;
    }

    // let endDate = shortTermEndDate; // note: removed end date due to csv not supporting recurring events
    let startTime = [];
    let endTime = [];
    let description = [];
    let room = [];
    let dayOfTheWeek = [];

    let csvContent = csvHeaders.join(",");

    for (let i = 0; i < courseScheduleDetails.length; i++) {
        csvContent += "\n";

        let scheduleElements = courseScheduleDetails[i].split(",");

        dayOfTheWeek.push(scheduleElements[5]); // Days column on portal

        // tester onli:
        // dayOfTheWeek[0] = 'TTHS';
        // dayOfTheWeek[1] = 'THFS';
        // dayOfTheWeek[2] = 'MWTH';
        // dayOfTheWeek[0] = 'MWTHFS';
        // dayOfTheWeek[0] = 'MTWTHF';

        let days = dayOfTheWeek[i];
        // console.log(days);

        let weeklySchedule = [];
        if (days == "DAILY") { // If this is DAILY, export immediately since it doesn't matter anyway (CSV is only for single-day exporting)
            weeklySchedule = validDays;
        } else { // If schedule is not DAILY, extract the schedule string and export only if the weekly schedule of that subject is today/tomorrow?
            weeklySchedule += days;
            weeklySchedule = weeklySchedule.split('');

            for (let j = 0; j < weeklySchedule.length; j++) {
                if (weeklySchedule[j] == 'T' && weeklySchedule[j + 1] == 'H') {
                    weeklySchedule.push(weeklySchedule[j] + weeklySchedule[j + 1]);
                    
                    if (weeklySchedule.includes('TH')) { 
                        weeklySchedule.splice(weeklySchedule.indexOf('T'), 1);
                        weeklySchedule.splice(weeklySchedule.indexOf('H'), 1);
                    } 
                }
            }
        }

        console.log(weeklySchedule);

        subject.push(scheduleElements[1] + " (" + scheduleElements[0] + ")"); // <Course Number> (<Class Code>)
        csvContent += subject[i] + ",";

        csvContent += startDate + ","; // Date today 

        // VALID AM TIME: 07:30, 8:00, 8:30, 9:00, 9:30, 10:00, 10:30, 11:30 
        // VALID PM TIME: 12:00, 12:30, 1:30, 2:00, 2:30, 3:00, 3:30, 4:00, 4:30, 5:00, 5:30, 6:00, 6:30, 7:00, 7:30, 8:00, 8:30
        let startTimeString = scheduleElements[4].substring(0, 2) + ":" + scheduleElements[4].substring(2, 4) + " ";

        // Bruteforce condition for am/pm overlap
        // Algorithm:
        //  - Check if the indicated time schedule is AM/PM
        //      a. If PM, verify if there is an AM/PM overlap
        //      b. If AM, it shouldn't have an AM/pm overlap
        if (scheduleElements[4].substring(12, 14) == "PM") {
            // console.log("This is either AM + PM schedule or purely PM");

            if ((scheduleElements[4].substring(0, 2) + scheduleElements[4].substring(2,4)) < 1200 && (scheduleElements[4].substring(0, 2) + scheduleElements[4].substring(2,4)) > 830) {
                // console.log(startTimeString + "is AM");
                startTimeString += "AM";
            } else {
                // console.log(startTimeString + "is PM");
                startTimeString += "PM";
            }
        } else {
            // console.log("This is a pure AM schedule");
            startTimeString += "AM";
        }

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