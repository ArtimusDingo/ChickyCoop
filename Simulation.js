import {Solution} from "./Solution.js";
import {Support} from "./Support.js";
import { GraphManager } from "./Graph.js";

// solutions: solutions, tries: 100, iterations: 1000, rate: learningRate.value

onmessage = function(event) 
{
	let data = event.data;
	let solutions = reconstructSolutions(data.solutions);
	initPolynomial(solutions);
	let result = fitCurve(solutions, data.tries, data.iterations, data.rate);
	postMessage(result);
  };

function reconstructSolutions(data)
{
	let solutions = [];
	for(let i = 0; i < data.length; i++)
  {
    solutions.push(Solution.buildSolutions(data[i].conc, data[i].mw, data[i].mwappobs, data[i].veq, data[i].species))
  }
  return solutions;
}

function gradientFunction(solutions)
{
	let gradient = [];
	let order = solutions[0].species[solutions[0].species.length - 1];
	// solutions = initPolynomial(solutions)
	for(let s = 0; s < solutions.length; s++)
	{
		solutions[s].solveMolarities();
	}
	for (let i = 0; i <= order; i++)
	{
		gradient.push(0);
	}
	// Define the gradient function
	for (let k = 0; k < solutions.length; k++) {
	  let y = solutions[k].mwappobs;
	  let x = solutions[k].conc;
	  let predictedY = solutions[k].calculateMWapp();
	  let error = predictedY - y;
	  gradient[0] += 2 * error;
	  gradient[1] += 2 * error * x;
	  for (let j = 0; j < order - 1; j++) 
	  {
		gradient[j + 2] += 2 * error * Math.pow(x, j + 2);
	  }
	}
	return gradient;
}
export function gradientOptimize(solutions, iterations, learningRate = 0.000005)
{
	let score = 0.0
	let previousScore = Number.POSITIVE_INFINITY;
	let converge = false;
	let ratio = 0.00;
	for (let i = 0; i < iterations; i++) 
	{
		let previousCoeffs = Array.from(solutions[0].polynomial.coeffs).slice();
		if(converge)
		{
			break;
		}
		let gradient = gradientFunction(solutions);
		for(let k = 0; k < solutions.length; k++)
		{		
			for (let j = 2; j <= solutions[0].species[solutions[0].species.length - 1]; j++) 
			{
				if(!solutions[k].species.includes(j))
			{
				solutions[k].polynomial.coeffs[j] = 0;
				continue;
			}
		  	solutions[k].polynomial.coeffs[j] -= learningRate * gradient[j]; // each coefficient needs a different learning rate...ouch
			}
		}	
		score = RSS(solutions);
		ratio = previousScore / score;

		if(i % 100 === 0 && i > 0)
		{
			if(score > previousScore)
			{	
				learningRate *= 0.5;
				for(let q = 0; q < solutions.length; q++)
				{
					solutions[q].polynomial.coeffs = previousCoeffs;
				}
			}
			previousScore = score;
		}
	}	
	return [solutions, score];
}

export function fitCurve(solutions, tries, iterations, learningRate)
{
	let rankedSolutions = {};
	for(let i = 0; i < tries; i++)
	{
		rankedSolutions[i] = gradientOptimize(solutions, iterations, learningRate);
		learningRate *= 0.9;
	}
	const { key: lowestKey, score: lowestScore } = Object.entries(rankedSolutions).reduce(
		(lowestObj, [key, [, score]]) => score < lowestObj.score ? { key, score } : lowestObj,
		{ score: Infinity }
	  );
	  console.log(rankedSolutions);
	return rankedSolutions[lowestKey][0];

}

function adjustLearningRate(rms, previousRate) 
{
	// Set a base learning rate
	
	// Set a scaling factor to adjust the learning rate
	let scalingFactor = 0.1;
	
	// Calculate the new learning rate based on the RMS
	let newLearningRate = previousRate / (1 + scalingFactor * rms);
	
	// Return the new learning rate
	return newLearningRate;
  }

// sets initial polynomial functions
export function initPolynomial(solutions)
{
	for(let i = 0; i < solutions.length; i++)
	{
		for (let j = 2; j < solutions[i].polynomial.coeffs.length; j++)
	 	{
			if(solutions[i].species.length <= 1)
			{
			// no equilibria, monomer only
				solutions[i].polynomial.coeffs[2] = 0;
			}
			if(!solutions[i].species.includes(j))
			{
				solutions[i].polynomial.coeffs[j] = 0;
			}
			if(solutions[i].polynomial.coeffs[j] === 0)
			{
				let startingK = Support.getStartingK(j);
				solutions[i].polynomial.coeffs[j] = Math.pow(10, startingK) * 2.0;
			}
	 	}
	}
	return solutions;
}


function residualSquared(num1, num2)
{
	let diff = num1 - num2;
	return Math.pow(diff, 2);
}


function RSS(solutions)
{
	const set1 = getmwAppObs(solutions);
	const set2 = getcalculatedMWapps(solutions);
	let sum = 0.0;
	for (let i = 0; i < set1.length; i++) 
	{
		const residual = residualSquared(set1[i], set2[i]);
		sum = sum + residual;
	}
	return sum / set1.length;
}



function getmwAppObs(solutions)
{
	var mwappobs = [];
	for (let i = 0; i < solutions.length; i++)
	{
		mwappobs.push(solutions[i].mwappobs);
	}
	
	return mwappobs;
}

function doIncrement(solutions, currentScore, previousScore, alpha, kStart = 2.0)
{
	if(currentScore < previousScore)
		{
			// continue incrementing 
			optimizeSolutions(solutions, 1.0, alpha, kStart);
			return true;
		}	
		if(currentScore >= previousScore)
		{
			// Since we went over the best score, we undo our last step and return false;
			optimizeSolutions(solutions, 1.0, -alpha, kStart);
			return false;
		}
}

export function optimizationLoop(solutions, maxIterations = 100)
{
	let start = true;
	let previousScore = 0;
	let currentScore = 0;
	let alpha = 0.01;
	let loopSize = 500;  //  initial optimization loop size
					    //  this will increment over 10 orders of magnitude of k on its first go
					    //  this should be sufficient for all but the worst guesses for Veq (A2)
	
						// main progress loop
    currentScore = RSS(solutions);
	previousScore = currentScore;
	for(let j = 2; j < solutions[0].polynomial.coeffs.length; j++)
	{
		let repeat = true;
		for(let i = 0; i < loopSize; i++)
		{
			currentScore = RSS(solutions);
			repeat = doIncrement(solutions, currentScore, previousScore, alpha, j)
			if(repeat || start)
			{
				previousScore = currentScore;
				start = false;
				continue;
			}
			else
			{	
				currentScore = RSS(solutions);
				break;
			}
		}
	}	
	return solutions;
}

function buildSolution(conc, mw, mwappobs, veq, species)
{
  var expression = constructCoefficientArray(species);
  const solution = new Solution(expression, conc, mw, mwappobs, veq, species)
  return solution;
}


function buildSolutions(concentrations, mwsAppobs, mw, veq, species)
{
    let solutions = [];
    for(let i = 0; i < concentrations.length; i++)
    {
      solutions.push(buildSolution(concentrations[i], mw, mwsAppobs[i], veq, species));
    }
    return solutions;
}

export function calculateMWapp(mw, conc, v)
{
  const z = SPC.ZFactor(conc, 100, v);
  return mw / z;
}

export function getcalculatedMWapps(solutions)
{
	var calculatedMWapp = [];
	for (let i = 0; i < solutions.length; i++)
	{
		calculatedMWapp.push(solutions[i].calculateMWapp());
	}
	return calculatedMWapp;
	
}



export function optimizeSolutions(solutions, multiplier = 1.0, alpha = 1.0, kStart = 2.0)
{	
	for(let i = 0; i < solutions.length; i++)
	{
		
		if(solutions[i].species.length <= 1)
		{
			// no equilibria, monomer only
			solutions[i].polynomial.coeffs[2] = 0;
			solutions[i].solveMolarities();
			continue;
		}
		//for(let j = solutions[i].polynomial.coeffs.length; j >= 2; j--)
	//	{
			if(!solutions[i].species.includes(kStart))
		{
				solutions[i].polynomial.coeffs[kStart] = 0;
				solutions[i].solveMolarities();
				continue;
				
		}
			if(solutions[i].polynomial.coeffs[kStart] === 0)
			{
				let startingK = Support.getStartingK(kStart);
				solutions[i].polynomial.coeffs[kStart] = Math.pow(10, startingK) * 2.0;
			}
			else
			{
				var val = Math.log10(solutions[i].polynomial.coeffs[kStart] / 2.0) + (multiplier * alpha); // must divide by 2
				solutions[i].polynomial.coeffs[kStart] = Math.pow(10, (val)) * 2.0;
				
			}
		//}
		solutions[i].solveMolarities();
	}
}




function getStartingK(caseNum) 
{
	// this is based on some semi-empirical observations about what k starts moving the fit
	// case 2 is dimer, 3 trimer, so on and so forth
  switch (caseNum) 
  {
    case 2:
      return 1;
    case 3:
      return 1;
    case 4:
      return 1;
    case 5:
      return 1;
    case 6:
      return 1;
    case 7:
      return 1;
    case 8:
      return 19;
    case 9:
      return 21;
    case 10:
      return 50;
    case 10:
      return 55;
    case 11:
      return 60;
    case 12:
      return 65;
    case 13:
      return 70;
    case 14:
      return 75;
    case 15:
      return 80;
    case 16:
      return 51;
    case 17:
      return 52;
    case 18:
      return 95;
    case 19:
      return 100;
    case 20:
      return 105;
    default:
      return -1; // Return -1 for cases outside the range of 1-20
  }
}