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
let firstSemEndDate = "12/18/2025" 
let secondSemEndDate = "05/23/2026" 
let shortTermEndDate = "07/22/2026"

// Read class schedule tables from schedule tab of portal
const table = document.querySelectorAll("table.mws-table");
const thead = document.querySelectorAll("table.mws-table > thead > tr > th"); 
const tbody = document.getElementsByTagName("tbody"); 

const user = document.querySelector("#mws-username"); // User's name for file name downloading
console.log("Hello, " + user.innerText + "!");

const currentDate = new Date().toLocaleDateString(); 

const currentDayOfTheWeek = new Date().getDay(); // (0 - 6; Sunday - Saturday)

const validDays = ['M', 'T', 'W', 'TH', 'F', 'S']; // Days distinguisher at portal; not really needed

// Class Schedule Table Headers
const tableHeaders = [];
for (let i = 0; i < thead.length; i++) {
    tableHeaders.push(thead.item(i).innerText);
}

// Number of Courses Enrolled
const tbodyRows = tbody[0].rows;
const courseCount = tbodyRows.length - 1;
console.log("Number of courses enrolled: " + courseCount);

// Course Schedule Information
console.log("Schedule details of enrolled courses: ")
const courseScheduleDetails = [];

for (let i = 0; i < courseCount; i++) {
    let courseSchedule = tbodyRows.item(i).innerText.replaceAll(/\t/g,',');
    courseSchedule = courseSchedule.substring(0, courseSchedule.length - 1);
    courseScheduleDetails.push(courseSchedule);

    console.log(courseSchedule);
}

// CSV Processing
function exportToCSV() {
    const csvHeaders = ["Subject", "Start Date", "Start Time", "End Time", "Description", "Location"];

    let subject = [];
    let startDate = currentDate;

    if (startDate < 10) {
        startDate = "0" + currentDate;
    }

    // let endDate = shortTermEndDate; // Removed end date due to CSV not supporting recurring events
    let startTime = [];
    let endTime = [];
    let description = [];
    let room = [];
    let dayOfTheWeek = [];

    let csvContent = csvHeaders.join(",");

    for (let i = 0; i < courseScheduleDetails.length; i++) {
        let isScheduledToday = false; // Boolean value if this subject is scheduled today
        csvContent += "\n";

        let scheduleElements = courseScheduleDetails[i].split(",");

        dayOfTheWeek.push(scheduleElements[5]); // Days column on portal

        // TESTER FOR WEEKLY SCHEDULE
        // dayOfTheWeek[0] = 'TTHS';
        // dayOfTheWeek[0] = 'THFS';
        // dayOfTheWeek[0] = 'MWTH';
        // dayOfTheWeek[0] = 'MWTHFS';
        // dayOfTheWeek[0] = 'MTWTHF';

        let days = dayOfTheWeek[i];

        let weeklySchedule = [];
        let weeklyScheduleIndex = [];
        if (days == "DAILY") { // If schedule is daily, include in CSV file if file is exported during monday to saturday
            weeklySchedule = validDays;
            weeklyScheduleIndex = [1, 2, 3, 4, 5, 6]; // 1-6 (Monday to Saturday)
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

            console.log("Today is a " + currentDayOfTheWeek);
        }

        console.log(weeklySchedule);
        console.log(weeklyScheduleIndex);

        subject.push(scheduleElements[1] + " (" + scheduleElements[0] + ")"); // <Course Number> (<Class Code>)
        csvContent += subject[i] + ",";

        csvContent += startDate + ","; // Date today 

        let startTimeString = scheduleElements[4].substring(0, 2) + ":" + scheduleElements[4].substring(2, 4) + " ";

        if (scheduleElements[4].substring(12, 14) == "PM") {
            // console.log("This is either AM + PM schedule or purely PM");
            if ((scheduleElements[4].substring(0, 2) + scheduleElements[4].substring(2,4)) < 1200 && 
            (scheduleElements[4].substring(0, 2) + scheduleElements[4].substring(2,4)) > 830) {
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
        a.download = user.innerText + '_slu-portal-schedule.csv';

        a.click();
    }

    download(csvContent); 

    return csvContent;
}

// TODO: iCalendar Processing (.ics)
function exportToICS() {

}

// TODO: JSON Processing (.json)
function exportToJSON() {
    
}