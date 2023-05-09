import {Solution} from "./Solution.js";
import {Polynomial} from "./Polynomial.js"
import {Support} from "./Support.js";



export function optimizeByVeq(solutions, startVeq)
{
	// increment veQ by 100ths and figure it out
	var previousScore = 0;
	var currentScore = 0;
	currentScore = performFit(solutions);
	console.log(currentScore);
	previousScore = currentScore;
	for(let i = 0; i < 100; i++)
	{
		// setvEq(solutions, (startVeq + 0.01));
		currentScore = performFit(solutions);
		console.log(currentScore);
		if(currentScore <= previousScore)
		{
			
			continue;
		}
		else
		{
			console.log("Best fit generated...");
			break;
		}
			
	}
		
}


export function optimizationLoop(solutions, maxIterations = 1000)
{
	let previousScore = 0;
	let currentScore = 0;
	let alpha = 0.05;
	let iterationCounter = 0;
	let loopSize = 100;  //  initial optimization loop size
					    //  this will increment over 10 orders of magnitude of k on its first go
					    //  this should be sufficient for all but the worst guesses for Veq (A2)
	
						// main progress loop

    currentScore = meanPercentDiff(solutions);
	previousScore = currentScore;
	while(iterationCounter < maxIterations)
	{
		let repeat = true;
		for(let i = 0; i < loopSize; i++)
		{
			currentScore = meanPercentDiff(solutions);
			repeat = doIncrement(solutions, currentScore, previousScore, alpha)
			if(repeat)
			{
				console.log(currentScore);
				previousScore = currentScore;
			}
			else
			{
				alpha = alpha / 10.0;
				currentScore = previousScore;
				iterationCounter++;
				break;
			}
			iterationCounter++;
		}
		if(alpha < 0.0005)
		{
			break;
		}
		loopSize =  Math.floor((1 / alpha));
		iterationCounter++;
	}
	return previousScore;
}

function doIncrement(solutions, currentScore, previousScore, alpha)
{
	if(currentScore <= previousScore)
		{
			// continue incrementing 
			optimizeSolutions(solutions, 1.0, alpha);
			return true;
		}	
		if(currentScore > previousScore)
		{
			// Since we went over the best score, we undo our last step and return false;
			optimizeSolutions(solutions, 1.0, -alpha);
			return false;
		}
}

export function performFit(solutions)
{
	var previousScore = 0; 
	var currentScore = 0;
	var alpha = 0.005; // allows a sweep of 5 orders of magnitude across a given equilibrium constant
	var repeat = true;
        var totalProgress = 0;
	var progressScore = 0.0
	var maxProgress = 2000;
	var stepCount = 0;
	// Prime values to start

		currentScore = meanPercentDiff(solutions);
		previousScore = currentScore;
	
	// gross fitting
	
	for(let i = 1; i < 1000; i++)
	{		
	//totalProgress++
	//	progressScore = totalProgress / maxProgress;
	//	Support.drawProgressBar(progressScore);		
		currentScore = meanPercentDiff(solutions);
		repeat = doIncrement(solutions, currentScore, previousScore, alpha);
		if(repeat)
		{
			previousScore = currentScore;
			stepCount++;
			continue;
		}
		else
		{
			currentScore = previousScore;
			stepCount++;
			break;
		}
	}
	console.log(stepCount);
	alpha = alpha / 1000.0; 
	
	for(let j = 1; j < 1000; j++)
	{
		totalProgress++
		progressScore = totalProgress / maxProgress
		Support.drawProgressBar(progressScore);
		// increments by 1/1000th of the gross fit alpha to find a good minimum - make a generic function since its a code repeat
		currentScore = meanPercentDiff(solutions);
		repeat = doIncrement(solutions, currentScore, previousScore, alpha);
		if(repeat)
		{
			previousScore = currentScore;
			continue;
		}
		else
		{
			currentScore = previousScore;
			break;
		}
		stepCount++
	}
	return previousScore; 
}

function setvEq(solutions, vEq)
{
	for (let i = 0; i < solutions.length; i++)
	{
		solutions[i].setVeq(vEq);
	}
}
export function optimizeSolutions(solutions, multiplier = 1.0, alpha = 1.0)
{
	
// iterative resolution


// loop through each solution to apply a curve fit and give it a shot
	for(let i = 0; i < solutions.length; i++)
	{
		
		if(solutions[i].species.length <= 1)
		{
			// no equilibria, monomer only
			solutions[i].polynomial.coeffs[2] = 0;
			solutions[i].solveMolarities();
			continue;
		}
		for(let j = 2; j < solutions[i].polynomial.coeffs.length; j++)
		{
			if(!solutions[i].species.includes(j))
		{
				solutions[i].polynomial.coeffs[j] = 0;
				solutions[i].solveMolarities();
				continue;
				
		}
			if(solutions[i].polynomial.coeffs[j] === 0)
			{
				let startingK = Support.getStartingK(j);
				solutions[i].polynomial.coeffs[j] = Math.pow(10, startingK) * 2.0;
			}
			else
			{
				var val = Math.log10(solutions[i].polynomial.coeffs[j] / 2.0) + (multiplier * alpha); // must divide by 2
				solutions[i].polynomial.coeffs[j] = Math.pow(10, (val)) * 2.0;
				
			}
		}
		solutions[i].solveMolarities();
	}
}



export function getmwAppObs(solutions)
{
	var mwappobs = [];
	for (let i = 0; i < solutions.length; i++)
	{
		mwappobs.push(solutions[i].mwappobs);
	}
	
	return mwappobs;
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

export function optimizeRoutine(solution)
{
   const pDiff = percentDifference(solution.mwappobs, solution.calculateMWapp())
   if(pDiff < 0.1)
   {
    return  -1.0;
   }
   else if(pDiff > 0.1)
   {
	return 1.0;
   }
   return 0.0;
}

export function optimizeDimer(sol)
{
    var solution = new Solution();
    solution = sol;
    // iterative resolution
    const alpha = 0.1
    // iterations
    const maxIterations = 100;
    // generate a starting equilibrium constant
    var k = 2.0;
    // get solution molarity
    //build equilibrium expression
    // conduct optimization loop
    for(let i = 0; i < maxIterations; i++)
    {
        // apply expression to solution's polynomial
        solution.polynomial.coeffs[1] = 1;
        solution.polynomial.coeffs[2] = (Math.pow(10, k) * 2);
        // solve for molarities with that expression
        solution.solveMolarities();
        // check how close the values are
        const pDiff = percentDifference(solution.mwappobs, solution.calculateMWapp())
        // if difference is greater than the alpha we will decrease k by alpha and the process will continue
        if(pDiff < alpha)
        {
            k = k - alpha;
        }
        else if(pDiff > alpha)
        {
            k = k + alpha;
        }
     
    }
}

export function percentDifference(known, unknown)
{
    return ((known - unknown) / known) * 100.0;
}


function getStartingK(caseNum) 
{
	// this is based on some semi-empirical observations about what k starts moving the fit
	// case 2 is dimer, 3 trimer, so on and so forth
  switch (caseNum) {
    case 2:
      return 2;
    case 3:
      return 5;
    case 4:
      return 7;
    case 5:
      return 8;
    case 5:
      return 11;
    case 6:
      return 15;
    case 7:
      return 19;
    case 8:
      return 21;
    case 9:
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


function scoreDataPoints(solutions, threshold) 
{
	const array1 = getmwAppObs(solutions);
	const array2 = getcalculatedMWapps(solutions);
	let count = 0;
	for (let i = 0; i < array1.length; i++) 
	{
    const diffPercent = Math.abs((array1[i] - array2[i]) / array1[i]) * 100;
    if (diffPercent <= threshold) 
	{
      count++;
    }
  }
  
  // Calculate the score based on the percentage of data points that meet the threshold
  const score = count / array1.length; 
  return score;
}

function minimizePercentDiff(solutions, multiplier, alpha) 
{
	const set1 = getmwAppObs(solutions);
	var set2 = getcalculatedMWapps(solutions); // wtf
	
	let currPercentDiff = calculateAvgPercentDiff(set1, set2);
	let newPercentDiff = currPercentDiff;
	let setScore = scoreDataPoints(solutions, 10);

 for(let i = 1; i <=1000; i++) 
  {
    currPercentDiff = newPercentDiff;
    optimizeSolutions(solutions, multiplier, (alpha)); 
	set2 = getcalculatedMWapps(solutions); 
	
	let newScore = scoreDataPoints(solutions, 10)
	// console.log(scoreDataPoints(solutions, 10));
    newPercentDiff = calculateAvgPercentDiff(set1, set2);		
	if(newPercentDiff > currPercentDiff)
	{
	// undo increment and quit
		optimizeSolutions(solutions, multiplier, (-alpha)); 
		break;
	}
	if(newPercentDiff < currPercentDiff)
	{
		// undo increment and quit
		optimizeSolutions(solutions, multiplier, (alpha)); 
		console.log(scoreDataPoints(solutions, 10));
		break;
	}
	else if (setScore != newScore)
	{
		optimizeSolutions(solutions, multiplier, (-alpha)); 
		console.log("Score hurt by changes, optimization complete.");
		break;
	}
  }

}

function meanPercentDiff(solutions) 
{
	const set1 = getmwAppObs(solutions);
	const set2 = getcalculatedMWapps(solutions)
	let sumPercentDiff = 0;
	for (let i = 0; i < set1.length; i++) 
	{
		const percentDiff = calculatePercentDiff(set1[i], set2[i]);
		sumPercentDiff += percentDiff;
	}
	const avgPercentDiff = sumPercentDiff / set1.length;
	return avgPercentDiff;
}

function calculatePercentDiff(num1, num2) {
  const diff = Math.abs(num1 - num2);
  const avg = (num1 + num2) / 2;
  const percentDiff = (diff / avg) * 100;
  return percentDiff;
}

