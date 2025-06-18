// AY 2024 - 2025 (this must be updated per AY)
let firstSemEndDate = "12/16/2024" // first semester
let secondSemEndDate = "05/22/2025" // second semester
let shortTermEndDate = "07/22/2025" // short term

// Get current date
const currentDate = new Date().toLocaleDateString();

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
function exportToCSV() {
    const csvHeaders = ["Subject", "Start Date", "End Date", "Start Time", "End Time", "Description", "Location"];

    let subject = [];
    let startDate = "0" + currentDate;
    let endDate = shortTermEndDate;
    let startTime = [];
    let endTime = [];
    let description = [];
    let room = [];

    let csvContent = csvHeaders.join(",");

    for (let i = 0; i < courseScheduleDetails.length; i++) {
        let scheduleElements = courseScheduleDetails[i].split(",");

        subject.push(scheduleElements[1] + " (" + scheduleElements[0] + ")"); 

        let startTimeString = scheduleElements[4].substring(0, 2) + ":" + scheduleElements[4].substring(2, 4) + " " + scheduleElements[4].substring(12, 14); // this could have an issue with am/pm overlap
        startTime.push(startTimeString);

        let endTimeString = scheduleElements[4].substring(7, 9) + ":" + scheduleElements[4].substring(9, 11) + " " + scheduleElements[4].substring(12, 14);
        endTime.push(endTimeString);

        description.push(scheduleElements[2]);

        room.push(scheduleElements[6]);
    }

    console.log(csvContent);
    console.log(subject);
    console.log(startTime);
    console.log(endTime);
    console.log(description);
    console.log(room);

    console.log(startDate);
    console.log(endDate);
}

exportToCSV();

// TODO: iCalendar Processing (.ics)