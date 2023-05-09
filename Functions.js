import {ResultSet} from "./Solution.js";
import {Solution} from "./Solution.js";
import {SPC} from "./SPC.js";
import {Support} from "./Support.js";
import  {optimizationLoop, performFit} from "./FitOptimizer.js";


// document.getElementById("loadCsvButton").onclick = loadCSV;
document.getElementById("generate-simulation-button").onclick = generateSimulation;
document.getElementById("download-sim-data").onclick = downloadCSV;
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
let csvSet;
let simData;
script.type = 'text/javascript';
script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
head.appendChild(script);


export function downloadCSV() {
  // Generate the CSV string
  const csvContent = generateCSV(simData);

  // Create a Blob object from the CSV string
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary URL for the Blob object
  const url = URL.createObjectURL(blob);

  // Create a link element to download the CSV file
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'data.csv');
  document.body.appendChild(link);

  // Click the link element to download the CSV file
  link.click();

  // Remove the link element from the document
  document.body.removeChild(link);
}

export function generateSimulation()
{
  
  var molSet = generateSimulatedRS(csvSet, document.getElementById("molecular-weight-input"));
  var plotDiv = document.getElementById('plot');
  var statusDiv = document.getElementById('progressbar');
 // plotDiv.style.opacity = '0.5';
 // statusDiv.style.display = 'flex'; 
// plotDiv.style.display = 'none'; 
 plotData([csvSet, molSet]);
   statusDiv.style.display = 'none';
 // plotDiv.style.opacity = '1';

}

export function generateCSV(resultSet)
 {
  // Create an array to hold each row of the CSV
  var rows = [];
  var line = [];
  var header = ["Concentration", "Mw App"];

  // Add the header row
  
  for(let r = 0; r < resultSet.solutions[0].species.length; r++)
  {

    header.push(Support.selectSpeciesName(resultSet.solutions[0].species[r]));
  }
 rows.push(header);
  // keys are all the same for every row...for now 
 const x  = resultSet.getXValues();
 const y  = resultSet.getYValues();
  // Remember to add all rows
  for(let i = 0; i < x.length; i++)
  { 
      let keys = Object.keys(resultSet.data[i]);
      for(let j = 0; j < keys.length; j++)
	{
 	  line = line.concat(resultSet.data[i][keys[j]]);
	}
   	 rows.push(line);
	  line =  [];
  }

  // Join each row with commas and add a newline character
  const csvContent = rows.map((row) => row.join(',')).join('\n');

  // Return the CSV string
  return csvContent;
}
export function constructCoefficientArray(species)
{
var max = species[species.length - 1];
var expression = [0,0];
for(let i = 1; i < max; i++)
{
expression.push(0);
}
return expression;
}

export function buildSolutions(conc, mw, mwappobs, veq, species)
{
  var expression = constructCoefficientArray(species);
  const solution = new Solution(expression, conc, mw, mwappobs, veq, species)
  return solution;
}
export function generateSimulatedRS()
{
  const veq = document.getElementById("excluded-volume-input").value
  const mw = document.getElementById("molecular-weight-input").value
  const xval = csvSet.getValues('x');
  const yval = csvSet.getValues('y');
  const solutions = [];
  const species = getCheckedValues();
  var keys = ['x', 'y'];
  var values = [];

  for(let i = 0; i < csvSet.data.length; i++)
  {
    solutions.push(buildSolutions(xval[i], mw, yval[i], veq, species));
  }
    optimizationLoop(solutions);
    const molaritySet = new ResultSet(solutions);
  for(let o = 0; o < solutions[0].species.length ; o++)
	{
            keys = keys.concat(Support.selectSpeciesName(solutions[0].species[o]));
	}

  for(let k = 0; k < csvSet.data.length; k++)
  {
    var y = solutions[k].calculateMWapp();
    values = [xval[k], y];
    for(let p = 0; p < solutions[k].pmolarities.length; p++)
	{
		values = values.concat(solutions[k].pmolarities[p]);
	}
    molaritySet.addRow(Support.createObjects(keys, values));
    values = [];
  }
getCheckedValues();
  simData = molaritySet;
  return molaritySet;
}

export function calculateMWapp(mw, conc, v)
{
  const z = SPC.ZFactor(conc, 100, v);
  return mw / z;
}

export function loadCSV()
{
  const csvFileInput = document.getElementById('csvFileInput');
  const loadCsvButton = document.getElementById('loadCsvButton');
  const rawSet = new ResultSet();

      loadCsvButton.addEventListener('click', () => {
        const file = csvFileInput.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (event) => {
          const csvData = event.target.result;
          const rows = csvData.split('\n');
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i].split(',');
            if (row.length === 2) {
              rawSet.addRow({x: parseFloat(row[0]), y: parseFloat(row[1])});
            }
          }
          csvSet = rawSet;
          plotData([rawSet]);
        };
      });
}

  export function plotData(resultSets)
  {
    let traces = [];
    const plot = document.getElementById("plot");
    for(const each of resultSets)
    {
   // const x = resultSet.data[0];
      const x = each.getValues('x');
      const y = each.getValues('y');
   

// Create a trace for the scatter plot
const trace = {
  x: x,
  y: y,
  mode: 'trace',
  type: 'scatter'
};
traces.push(trace);
    }

// Create the layout for the plot
const layout = {
  title: 'Mw,app vs Concentration',
  xaxis: { title: 'Concentration (mg/mL)' },
  yaxis: { title: 'Mw, app (kDa)' }
};

// Create the plot
  return Plotly.newPlot(plot, traces, layout);
  }
  
export function getCheckedValues() {
  // get all checkboxes with the name "fruit[]"
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  // extract the values of the checked checkboxes
  const values = Array.from(checkboxes).map(checkbox => parseFloat(checkbox.value));
  // return the array of checkbox values
  return values;
}

