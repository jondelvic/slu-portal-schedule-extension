// TODO: Transfer downloading here and get csv/ics content from content.js

chrome.tabs.query( {active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {data: "getScheduleDetails"});
});

const csvButton = document.getElementById("csv-btn");
const icsButton = document.getElementById("ics-btn");

csvButton.onclick = function() {
    console.log("You clicked the csv button on the popup");
}

icsButton.onclick = function() {
    console.log("you clicked on the ical button on the popup. nothjing happens.")
}
