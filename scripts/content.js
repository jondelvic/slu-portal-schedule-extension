// npm package tabletojson could be used

const table = document.querySelectorAll("table.mws-table");
const thead = document.querySelectorAll("table.mws-table > thead > tr > th"); // pwede pala ito
const tbody = document.getElementsByTagName("tbody");

// Class Schedule Table (index 1 is for the Weekly View Table)
console.log(table[0]); 
console.log(thead); 
console.log(tbody[0]);

// get number of subjects
// Count the number of <tr> elements in <tbody> - 1 (total units)
const tbodyRows = tbody[0].rows;
const courseCount = tbodyRows.length - 1;
console.log("Number of courses enrolled: " + courseCount);

// get headers
const tableHeaders = [];

console.log("TABLE HEADERS:")
for (let i = 0; i < thead.length; i++) {
    console.log(thead.item(i).innerText);
    // tableHeaders.push(thead.children[i].innerText);
}