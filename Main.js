import {ResultSet} from "./Solution.js";
import {Solution} from "./Solution.js";
import {SPC} from "./SPC.js";
import {Support} from "./Support.js";
import  {optimizationLoop} from "./Simulation.js";
import  {gradientOptimize} from "./Simulation.js";
import  {fitCurve} from "./Simulation.js";
import  {initPolynomial} from "./Simulation.js";
import { GraphManager } from "./Graph.js";
import { FileManager } from "./Interface.js";
import {generateCSV} from "./Functions.js";

// initialization stuff

let worker = new Worker('Simulation.js', { type: "module" })
let optimizedSolutions = [];
worker.onmessage = function(event) 
{
  optimizedSolutions = event.data;
  finalizeSimulation(optimizedSolutions);
  runSimButtion.disabled = false;
};
let simulations = []; // keeps track of simulations for export;



const plot = document.getElementById('plot');
const fileInput = document.getElementById("csvFileInput")
const graphOptions = document.getElementById('graphOptions'); // div that holds all graph options
const graphSelect = document.getElementById('graphSelect'); // select graph dropdown selector
const graphButton = document.getElementById('showGraphButton');
const colorPicker = document.getElementById('colorPicker');
const replotButton = document.getElementById('replotGraphs');
const showSimulationButton = document.getElementById("showSimulationButton");
const simulationOptions = document.getElementById('simulationOptions');
const runSimButtion = document.getElementById("generate-simulation-button");
const simSelect = document.getElementById('selectSimData'); // select graph dropdown selector
const deleteGraphs = document.getElementById('deleteGraphs');
const learningRate = document.getElementById('learningRate');
let graphManager = new GraphManager(graphOptions, graphSelect);
let fileManager = new FileManager(graphManager);

// Handlers
fileInput.onclick = handleFileInput;
graphButton.onclick = handleGraphButton;
colorPicker.oninput = handleColorChange;
colorPicker.onclick = handleColorChange;
replotButton.onclick = handleReplot;
runSimButtion.onclick = handleRunSimulation;
showSimulationButton.onclick = handleShowSimulationButton;
deleteGraphs.onclick = handleDeleteGraphs;
// graphSelect.onchange = handleReplot;


document.getElementById("download-sim-data").onclick = handleDownloadSimulation;

function handleFileInput()
{
  fileManager.loadCSV(fileInput, plot);
}

function handleGraphButton()
{
  Support.displayGraphOptions(graphOptions, graphButton);
}

function handleShowSimulationButton()
{
  Support.displaySimulatorOptions(simulationOptions, showSimulationButton);
}

function handleDeleteGraphs()
{
  const selectedOptions = Array.from(graphSelect.selectedOptions).map(option => option.value);
  console.log(selectedOptions);
  graphManager.deleteGraphs(selectedOptions);
}

function handleReplot()
{
  let graphs = [];
  const selectedOptions = Array.from(graphSelect.selectedOptions).map(option => option.value);
  
  for(let i = 0; i < selectedOptions.length; i++)
  {
   graphs.push(graphManager.selectGraph(selectedOptions[i]));
  }
  graphManager.displayPlots(graphs, plot)
}

function handleColorChange()
{
   try
   {
    const selectedOptions = Array.from(graphSelect.selectedOptions).map(option => option.value);
    for(let i = 0; i < selectedOptions.length; i++)
    {
    graphManager.setGraphColor(selectedOptions[i], colorPicker.value);
    }
     graphManager.displayPlots(graphManager.graphs, plot);
  }
  catch(error)
  {
    console.log(error);
  }
}

function handleDownloadSimulation()
{ 
  // needs error catching
  let id = simSelect.value;
  let csvContent;
  for(let i = 0; i < simulations.length; i++)
  {
    if(id == simulations[i].id)
    {
      csvContent = simulations[i];
    }
  }
  csvContent = generateCSV(csvContent); // convert to csv data format
  const blob = new Blob([csvContent], { type: 'text/csv' }); // create a Blob object from the CSV content 
  const link = document.createElement('a'); // create a temporary link element
  link.href = URL.createObjectURL(blob); // set the href attribute of the link element to a URL created from the Blob object
  link.download = 'data.csv'; // set the download attribute of the link element to the desired file name with the .csv extension
  link.click(); // programmatically click the link element to trigger the file download
  }
  

function handleRunSimulation()
{
 //runSimulation();
 workSimulation();
}

function workSimulation()
{
  runSimButtion.disabled = true;
  let solutions = [];
  let values = [];
  const species = getCheckedValues().sort(((a, b) => a - b));
  const selectedOption = Array.from(simSelect.selectedOptions).map(option => option.value);
  const concentrations = graphManager.getX(selectedOption);
  const responses = graphManager.getY(selectedOption);
  const veq = document.getElementById("excluded-volume-input").value
  const mw = document.getElementById("molecular-weight-input").value
  for(let i = 0; i < concentrations.length; i++)
  {
    solutions.push(Solution.buildSolutions(concentrations[i], mw, responses[i], veq, species))
  }

  let data = 
  {
    solutions: solutions, tries: 1, iterations: 1000, rate: learningRate.value
  };
  worker.postMessage(data);
}

function finalizeSimulation(data)
{
  let values = [];
  let solutions = [];
  var keys = ['x', 'y'];
  const selectedOption = Array.from(simSelect.selectedOptions).map(option => option.value);
  for(let i = 0; i < data.length; i++)
  {
    solutions.push(Solution.deserializeSolution(data[i]));
  }
  let molaritySet = new ResultSet(solutions);
  for(let o = 0; o < solutions[0].species.length ; o++)
 {
   keys = keys.concat(Support.selectSpeciesName(solutions[0].species[o]));
 }
 
 for(let k = 0; k < solutions.length; k++)
 {
  var y = solutions[k].calculateMWapp();
  values = [solutions[k].conc, y];
  for(let p = 0; p < solutions[k].pmolarities.length; p++)
 {
 // values = values.concat(solutions[k].pmolarities[p]);
 values = values.concat(solutions[k].molarities[p]);
 }
  molaritySet.addRow(Support.createObjects(keys, values));
  values = [];
 }
 molaritySet.filename = graphManager.getName(selectedOption) + " Simulation ID " + graphManager.graphs[graphManager.graphs.length - 1].id;
 simulations.push(molaritySet);
 graphManager.createGraphs([molaritySet]);
 graphManager.displayPlots([graphManager.selectGraph(selectedOption), graphManager.selectGraph(graphManager.graphs[graphManager.graphs.length - 1].id)], plot);
 molaritySet.id = graphManager.graphs[graphManager.graphs.length - 1].id;

}

function runSimulation()
{
  let solutions = [];
  let values = [];
  const species = getCheckedValues().sort(((a, b) => a - b));
  const selectedOption = Array.from(simSelect.selectedOptions).map(option => option.value);
  const concentrations = graphManager.getX(selectedOption);
  const responses = graphManager.getY(selectedOption);
  const veq = document.getElementById("excluded-volume-input").value
  const mw = document.getElementById("molecular-weight-input").value
  const maxIterations = parseInt(document.getElementById("maxIterations").value)
  var keys = ['x', 'y'];
  for(let i = 0; i < concentrations.length; i++)
  {
    solutions.push(Solution.buildSolutions(concentrations[i], mw, responses[i], veq, species))
  }
  initPolynomial(solutions);
  let optimalSolution = [];
 // gradientOptimize(solutions, maxIterations, parseFloat(learningRate.value));

 optimalSolution = fitCurve(solutions, 10, 1000, learningRate.value);
 // let optimalSolution = fitCurve(solutions, 10, 1000, learningRate.value);
 let molaritySet = new ResultSet(optimalSolution);
 for(let o = 0; o < solutions[0].species.length ; o++)
{
  keys = keys.concat(Support.selectSpeciesName(optimalSolution[0].species[o]));
}

for(let k = 0; k < concentrations.length; k++)
{
 var y = optimalSolution[k].calculateMWapp();
 values = [concentrations[k], y];
 for(let p = 0; p < optimalSolution[k].pmolarities.length; p++)
{
// values = values.concat(solutions[k].pmolarities[p]);
values = values.concat(optimalSolution[k].molarities[p]);
}
 molaritySet.addRow(Support.createObjects(keys, values));
 values = [];
}
document.getElementById("generate-simulation-button").disabled = false;
molaritySet.filename = graphManager.getName(selectedOption) + " Simulation ID " + graphManager.graphs[graphManager.graphs.length - 1].id;
simulations.push(molaritySet);
graphManager.createGraphs([molaritySet]);
graphManager.displayPlots([graphManager.selectGraph(selectedOption), graphManager.selectGraph(graphManager.graphs[graphManager.graphs.length - 1].id)], plot);
molaritySet.id = graphManager.graphs[graphManager.graphs.length - 1].id;
 

}


export function generateSimulation(selection)
{
document.getElementById("generate-simulation-button").disabled = true;
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
  solutions.push(Solution.buildSolutions(xval[i], mw, yval[i], veq, species));
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
document.getElementById("generate-simulation-button").disabled = false;
plotData([csvSet, molaritySet]);
}
 
export function getCheckedValues() 
{
  // get all checkboxes with the name "fruit[]"
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  // extract the values of the checked checkboxes
  const values = Array.from(checkboxes).map(checkbox => parseFloat(checkbox.value));
  // return the array of checkbox values
  return values;
}
