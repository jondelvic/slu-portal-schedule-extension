// TODO: Transfer downloading here and get csv/ics content from content.js
const csvButton = document.getElementById("csv-btn");
const icsButton = document.getElementById("ics-btn");
const jsonButton = document.getElementById("json-btn");

csvButton.onclick = function() {
    console.log("You clicked the csv button on the popup");

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "csv"});
    });
}

icsButton.onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "ics"});
    });
}

jsonButton.onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "json"});
    });
}
