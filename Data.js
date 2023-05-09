import { Solution } from "./Solution";

export class InputSet
{
    constructor(concentrations, mwsApp, mw, veq, species)
    {
        this.Solutions = new Solution(concentrations, mwsApp, mw, veq, species);
    }
}

export class ResultSet
{
   constructor(score, solutions = [])
   {
     this.id =  0;
     this.data = [];
     this.solutions = solutions;
     this.score = score;
   }
 
   addRow(row) 
   {
     this.data.push(row);
   }
 
   toTable() {
     const table = document.createElement("table");
     const headerRow = document.createElement("tr");
 
     for (const key in this.data[0]) {
       const headerCell = document.createElement("th");
       headerCell.textContent = key;
       headerRow.appendChild(headerCell);
     }
 
     table.appendChild(headerRow);
 
     for (const row of this.data) {
       const tableRow = document.createElement("tr");
 
       for (const key in row) {
         const tableCell = document.createElement("td");
         tableCell.textContent = row[key];
         tableRow.appendChild(tableCell);
       }
 
       table.appendChild(tableRow);
     }
 
     return table;
   }
 
   toCsv() 
   {
     const rows = [];
 
     for (const row of this.data) {
       const values = [];
 
       for (const key in row) {
         values.push(`"${row[key]}"`);
       }
 
       rows.push(values.join(","));
     }
 
     const csv = rows.join("\n");
     return csv;

   }

   getValues(name)
{
return this.data.map(row => row[name]);
}

 }
