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

// AY 2025 - 2026 (UPDATE THIS EVERY YEAR)
let firstSemEndDate = "12/18/2025" // 20251218 FREQ=WEEKLY;BYDAY=<WEEKDAYS IN 2CHAR FORMAT>;UNTIL=20251218T000000Z
let secondSemEndDate = "05/23/2026" 
let shortTermEndDate = "07/22/2026"

// Read class schedule tables from schedule tab of portal
const table = document.querySelectorAll("table.mws-table");
const thead = document.querySelectorAll("table.mws-table > thead > tr > th"); 
const tbody = document.getElementsByTagName("tbody"); 

const user = document.querySelector("#mws-username").innerText; 
let nameSplitter = user.split(' ');
console.log("Hello, " + user + "!");

const currentDate = new Date().toLocaleDateString('en-US'); // Format for google calendar (MM/DD/YYYY)
console.log("Date today: " + currentDate);

let currentDayOfTheWeek = new Date().getDay(); // (0 - 6; Sunday - Saturday)
console.log("Day of the week: " + currentDayOfTheWeek);

const validDays = ['M', 'T', 'W', 'TH', 'F', 'S']; // Days distinguisher at portal

// Class Schedule Table Headers
const tableHeaders = [];
for (let i = 0; i < thead.length; i++) {
    tableHeaders.push(thead.item(i).innerText);
}

const tbodyRows = tbody[0].rows;
const courseCount = tbodyRows.length - 1;
console.log("Number of courses enrolled: " + courseCount);

// Course Schedule Information
console.log("Schedule details of enrolled courses: ")
const courseScheduleDetails = [];

for (let i = 0; i < courseCount; i++) {
    let courseSchedule = tbodyRows.item(i).innerText.replaceAll(/\t/g,'|');
    console.log(courseSchedule);
    courseSchedule = courseSchedule.substring(0, courseSchedule.length - 1);
    courseScheduleDetails.push(courseSchedule);
}

// I think the reason why these exist is due to adding of subjects? (Need to verify)
// Time schedule seems the same but the day of the week differs
function irregularChecker(courseScheduleDetailsArr) {
    let cleanCourseScheduleDetails = [];
    console.log(courseScheduleDetailsArr);

    for (let i = 0; i < courseScheduleDetailsArr.length; i++) {
	cleanCourseScheduleDetails.push(courseScheduleDetailsArr[i].replace("||||", ""));
    }

    console.log(cleanCourseScheduleDetails);

    // TODO: Retrieve the day of the week for the irregular schedule row and append it to the row above it
}

irregularChecker(courseScheduleDetails);

// CSV Processing
function exportToCSV() {
    const csvHeaders = ["Subject", "Start Date", "Start Time", "End Time", "Description", "Location"];

    let startDate = currentDate;

    if (startDate < 10) { // TODO: Check if this is needed since there is already a fixed format for the date
        startDate = "0" + currentDate;
    }

    // let endDate = shortTermEndDate; // Removed end date due to CSV not supporting recurring events
    let dayOfTheWeek = [];

    let csvContent = csvHeaders.join(",");

    for (let i = 0; i < courseScheduleDetails.length; i++) {
        let scheduleElements = courseScheduleDetails[i].replaceAll(',', '.').split("|");

        dayOfTheWeek.push(scheduleElements[5]); // Days column on portal

        let days = dayOfTheWeek[i];

        let weeklySchedule = [];
        let weeklyScheduleIndex = [];
        if (days == "DAILY") { // If schedule is daily, include in CSV file 
            weeklySchedule = validDays;
            weeklyScheduleIndex = [1, 2, 3, 4, 5, 6]; // Monday to Saturday
        } else { // If schedule is not DAILY, extract the schedule string and export only if the weekly schedule of that subject is today
            weeklySchedule += days;
            weeklySchedule = weeklySchedule.split('');

            for (let j = 0; j < weeklySchedule.length; j++) {
                if (weeklySchedule[j] == 'T' && weeklySchedule[j + 1] == 'H') {
                    weeklySchedule.push(weeklySchedule[j] + weeklySchedule[j + 1]);
                    weeklyScheduleIndex.push(4);
                    
                    if (weeklySchedule.includes('TH')) { // Remove 'T' and 'H' 
                        weeklySchedule.splice(weeklySchedule.indexOf('T'), 1);
                        weeklySchedule.splice(weeklySchedule.indexOf('H'), 1);
                    } 
                }

                switch (weeklySchedule[j]) {
                    case 'M':
                        weeklyScheduleIndex.push(1);
                        break;
                    case 'T':
                        weeklyScheduleIndex.push(2);
                        break;
                    case 'W':
                        weeklyScheduleIndex.push(3);
                        break;
                    case 'F':
                        weeklyScheduleIndex.push(5);
                        break;
                    case 'S': // SATURDAY (Sundays for graduate students are not yet handled)
                        weeklyScheduleIndex.push(6);
                        break;
                } 
            }
        }

        if (!weeklyScheduleIndex.includes(currentDayOfTheWeek)) {
            
        } else {
            csvContent += "\n";
            csvContent += scheduleElements[1] + " (" + scheduleElements[0] + ")" + ","; // <Course Number> (<Class Code>)

            csvContent += startDate + ","; // Date today 

            let startTimeString = scheduleElements[4].substring(0, 2) + ":" + scheduleElements[4].substring(2, 4) + " ";

            if (scheduleElements[4].substring(12, 14) == "PM") { // Either PM only or overlapping AM/PM
                if ((scheduleElements[4].substring(0, 2) + scheduleElements[4].substring(2,4)) < 1200 && (scheduleElements[4].substring(0, 2) + scheduleElements[4].substring(2,4)) > 830) { // AM
                    startTimeString += "AM";
                } else { // PM
                    startTimeString += "PM";
                }
            } else { // AM only
                startTimeString += "AM";
            }

            csvContent += startTimeString + ",";

            let endTimeString = scheduleElements[4].substring(7, 9) + ":" + scheduleElements[4].substring(9, 11) + " " + scheduleElements[4].substring(12, 14);
            csvContent += endTimeString + ",";

            csvContent += scheduleElements[2] + ","; // Description

            csvContent += scheduleElements[6]; // Room
        }

    }

    console.log(csvContent);

    const download = (data) => {
        const csvBlob = new Blob([data], {type: 'text/csv;charset=utf-8'});
        const csvURL = URL.createObjectURL(csvBlob);

        const a = document.createElement('a');

        a.href = csvURL;
        a.download = nameSplitter.at(nameSplitter.length - 1) + '-sched-today.csv';

        a.click();
    }

    download(csvContent); 
    return csvContent;
}

// TODO: iCalendar Processing (.ics)
/* 

BEGIN:VCALENDAR
VERSION: 2.0
PRODID:

BEGIN:VEVENT
UID:
DTSTAMP:
DTSTART:
DTEND:
// (https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html) (https://icalendar.org/iCalendar-RFC-5545/3-3-10-recurrence-rule.html)
RRULE:FREQ=WEEKLY;WKST=SU;
SUMMARY:
DESCRIPTION:
LOCATION:

BEGIN:VALARM
ACTION:DISPLAY
TRIGGER: 15 MINUTES BEFORE TIME
DESCRIPTION:This is an event reminder
END:VALARM

END:VEVENT

END:VCALENDAR


*/
function exportToICS() {

}

// TODO: JSON Processing (.json)
function exportToJSON() {
    
}
