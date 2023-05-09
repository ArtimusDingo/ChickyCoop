
  // solution.js
  import {Polynomial} from "./Polynomial.js";
  import {SPC} from "./SPC.js";
  import {Support} from "./Support.js";
  
// Classes

  export class Solution 
  {

    constructor(coeffs, conc, mw, mwappobs, veq, species, molarities = []) 
    {
      this.wAverageMW = mw;
      this.veq = parseFloat(veq);
      this.polynomial = new Polynomial(coeffs);
      this.mw = mw;
      this.conc = conc;
      this.molarities = molarities;
      this.species = species; // would be [1, 2, 6] for an example of monomer-dimer, trimer
      this.mwappobs = mwappobs;
      this.v = SPC.NumberDensity(this.concentration, this.mw);
      this.pmolarities = [];
    }
    static deserializeSolution(data)
    {
      let solution = new Solution(data.polynomial.coeffs, data.conc, data.mw, data.mwappobs, data.species, data.molarities);
      solution.solveMolarities();
      return solution;
    }
    static buildSolutions(conc, mw, mwappobs, veq, species)
    {
      var expression = this.constructCoefficientArray(species);
      const solution = new Solution(expression, conc, mw, mwappobs, veq, species)
      return solution;
    }
    static constructCoefficientArray(species)
    {
      var max = species[species.length - 1];
      var expression = [0,0];
      for(let i = 1; i < max; i++)
      {
        expression.push(0);
      }
      return expression;
    }
      solveMolarities()
      {
        this.molarities = [];
        const Ctot = this.solveMolarity();
        this.polynomial.coeffs[0] = -Ctot;
        this.polynomial.coeffs[1] = 1.0;
        const monomer = this.polynomial.findRoot(Ctot, 0.00000001, 1000)
        this.molarities.push(monomer);
      
        for(let i = 3; i <= this.polynomial.coeffs.length; i++)
        {
     
          if(this.polynomial.coeffs[i-1] != 0)
          {
           // this.species.push(i-1);
            const molarity = this.solveNMer(this.polynomial.coeffs[i - 1], monomer, i - 1);
            this.molarities.push(molarity);
          }
        }
	      this.solvePmolarities();
        this.solveWAverageMW();
      }
      
solvePmolarities() // this works
{
  for(let i = 0; i < this.molarities.length; i++)
  {
   if(this.molarities[i] == 0.0)
{
continue;
}
  let value = ((this.molarities[i] * (this.species[i] * this.mw)) / this.conc) * 100;
  this.pmolarities.push(value)
}
}
	  setVeq(veq)
	  {
		  this.veq = veq;
	  }
      solveWAverageMW()
      {
        var numerator = 0.0;
        var denominator = 0.0;
        for(let i = 0; i < this.molarities.length; i++)
        {
          numerator = numerator + Math.pow(this.mw * (i + 1), 2.0) * this.molarities[i];
          denominator = denominator + (this.mw * (i + 1)) * this.molarities[i];
        }
        this.wAverageMW = numerator / denominator;
		
      }
      calculateMWapp()
      {
        const z = SPC.ZFactor(this.conc, 100, this.veq);
        return this.wAverageMW / z; // using wAverageMW will help speed things up for other problems
      }

      solveMolarity()
      {
        return this.conc / this.mw;
      }

      solveNMer(k, molarity, exponential)
      {
        return Math.pow(molarity, exponential) * (k / exponential);
      }
      
  }

  
  export function SolveMolarity(concentration, mw)
  {
    return concentration / mw;
  }
  export class ResultSet
 {
    constructor(solutions = [])
    {
      this.data = [];
      this.solutions = solutions;
      this.filename = "";
    }
  
    addRow(row) {
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
  
    toCsv() {
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

    getXValues() 
    {
      return this.data.map(row => row.x);
      
    }

    getYValues() 
    {
      return this.data.map(row => row.y);
    }

    getData() 
    {
      const data = [];
      const x = this.getXValues();
      const y = this.getYValues();
      for (let i = 0; i < x.length; i++) {
        data.push({ x: x[i], y: y[i] });
      }
      return data;
    }
  }

  

   
  
