export class Support 
{

  static displaySimulatorOptions(simulatorOptions, simulatorButton)
  {
    if (simulationOptions.style.display === 'none' || simulationOptions.style.display === "")
     {
      simulatorOptions.style.display = 'block';
      simulatorButton.textContent = 'Hide Simulator Options';
     } 
     else 
     {
      simulatorOptions.style.display = 'none';
      simulatorButton.textContent = 'Show Simulator Options';
    }
  }
  static displayGraphOptions(graphOptions, graphButton) 
   {
    const setting = window.getComputedStyle(graphOptions).getPropertyValue("display");   
    if (setting === 'none')
     {
      graphOptions.style.display = 'block';
      graphButton.textContent = 'Hide Graph Options';
     } 
     else 
     {
      graphOptions.style.display = 'none';
      graphButton.textContent = 'Show Graph Options';
    }
  }
  

  static generateDropDown()
  {
  var section = document.getElementById('inputs');
  var select = document.createElement("select");
  
  // Create options and add them to the select element
  var option1 = document.createElement("option");
  option1.value = "best_fit_a2";
  option1.text = "Best-Fit A2";
  select.add(option1);
  
  var option2 = document.createElement("option");
  option2.value = "variable_a2";
  option2.text = "Variable A2";
  select.add(option2);
  
  var option3 = document.createElement("option");
  option3.value = "custom_parameters";
  option3.text = "Custom Parameters";
  select.add(option3);
  
  // Add the select element to the page
  section.insertBefore(select, section.firstChild);
  }

  static generateCheckboxes(containerId, numCheckboxes) {
    const container = document.getElementById(containerId);
  
    // Calculate the number of rows and columns needed based on the number of checkboxes
    const numRows = 4;
    const numCols = Math.ceil(numCheckboxes / numRows);
  
    for (let i = 0; i < numRows; i++) {
      // Create a container div for each row of checkboxes
      const rowContainer = document.createElement("div");
      rowContainer.classList.add("checkbox-row");
      container.appendChild(rowContainer);
  
      for (let j = 0; j < numCols; j++) {
        const checkboxIndex = i + j * numRows + 1;
        if (checkboxIndex > numCheckboxes) {
          // If we've created all the necessary checkboxes, break out of the loop
          break;
        }
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = this.selectSpeciesName(checkboxIndex);
        checkbox.value = checkboxIndex;
        checkbox.classList.add("checkbox");
  
        const label = document.createElement("label");
        label.setAttribute("for", this.selectSpeciesName(checkboxIndex));
        label.textContent = this.selectSpeciesName(checkboxIndex);
  
        const checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        rowContainer.appendChild(checkboxContainer);
      }
    }
  }
  
static drawProgressBar(progress)
 {
  var progress = document.getElementById("progress");

        var degrees = progress/ 100 * 360;
        progress.style.transform = "rotate(" + degrees + "deg)";
      
}

    static createObjects(keys, values) 
  {
  const obj = {};

  for (let i = 0; i < keys.length; i++) {
    obj[keys[i]] = values[i];
  }
	return obj;
}  
  static getStartingK(caseNum) 
{
// this is based on some semi-empirical observations about what k starts moving the fit
// case 2 is dimer, 3 trimer, so on and so forth
  switch (caseNum) 
  {
    case 2:
      return 2;
    case 3:
      return 5;
    case 4:
      return 7;
    case 5:
      return 8;
    case 6:
      return 11;
    case 7:
      return 15;
    case 8:
      return 19;
    case 9:
      return 23;
    case 10:
      return 27;
    case 11:
      return 30;
    case 12:
      return 33;
    case 13:
      return 36;
    case 14:
      return 40;
    case 15:
      return 43;
    case 16:
      return 46;
    case 17:
      return 49;
    case 18:
      return 52;
    case 19:
      return 55;
    case 20:
      return 58;
    case 21:
      return 61;
case 22:
      return 64;
    case 23:
      return 67;
    case 24:
      return 70;
    case 25:
      return 73;
    case 26:
      return 76;
    case 27:
      return 79;
    case 28:
      return 82;
    case 29:
      return 85;
    case 30:
      return 88;
    case 31:
      return 91;
    case 32:
      return 94;
    case 33:
      return 97;
    case 34:
      return 100;
    case 35:
      return 103;
    case 36:
      return 106;
    case 37:
      return 109;
    case 38:
      return 112;
    case 39:
      return 115;
    case 40:
      return 118;
    default:
      return -1; // Return -1 for cases outside the range of 1-20
  }
}

  static selectSpeciesName(species) 
  {
   switch (species) 
   {
    case 1:
      return "Monomer";
    case 2:
      return "Dimer";
    case 3:
      return "Trimer";
    case 4:
      return "Tetramer";
    case 5:
      return "Pentamer";
    case 6:
      return "Hexamer";
    case 7:
      return "Heptamer";
    case 8:
      return "Octamer";
    case 9:
      return "Nonamer";
    case 10:
      return "Decamer";
    case 11:
      return "Undecamer";
    case 12:
      return "Dodecamer";
    case 13:
      return "Tridecamer";
    case 14:
      return "Tetradecamer";
    case 15:
      return "Pentadecamer";
    case 16:
      return "Hexadecamer";
    case 17:
      return "Heptadecamer";
    case 18:
      return "Octadecamer";
    case 19:
      return "Nonadecamer";
    case 20:
      return "Icosamer";
    case 21:
      return "Eicosamer";
    case 22:
      return "Docosamer";
    case 23:
      return "Tricosamer";
    case 24:
      return "Tetracosamer";
    case 25:
      return "Pentacosamer";
    case 26:
      return "Hexacosamer";
    case 27:
      return "Heptacosamer";
    case 28:
      return "Octacosamer";
    case 29:
      return "Nonacosamer";
    case 30:
      return "Triacontamer";
    case 31:
      return "Untriacontamer";
    case 32:
      return "Dotriacontamer";
    case 33:
      return "Tritriacontamer";
    case 34:
      return "Tetratriacontamer";
    case 35:
      return "Pentatriacontamer";
    case 36:
      return "Hexatriacontamer";
    case 37:
      return "Heptatriacontamer";
    case 38:
      return "Octatriacontamer";
    case 39:
      return "Nonatriacontamer";
    case 40:
      return "Tetracontamer";

default:
      return "";
  }
  }

  static selectSpeciesNumber(speciesName) 
{
  switch (speciesName) {
  case "Monomer":
  return 1;
  case "Dimer":
  return 2;
  case "Trimer":
  return 3;
  case "Tetramer":
  return 4;
  case "Pentamer":
  return 5;
  case "Hexamer":
  return 6;
  case "Heptamer":
  return 7;
  case "Octamer":
  return 8;
  case "Nonamer":
  return 9;
  case "Decamer":
  return 10;
  case "Undecamer":
  return 11;
  case "Dodecamer":
  return 12;
  case "Tridecamer":
  return 13;
  case "Tetradecamer":
  return 14;
  case "Pentadecamer":
  return 15;
  case "Hexadecamer":
  return 16;
  case "Heptadecamer":
  return 17;
  case "Octadecamer":
  return 18;
  case "Nonadecamer":
  return 19;
  case "Icosamer":
  return 20;
  case "Eicosamer":
  return 21;
  case "Docosamer":
  return 22;
  case "Tricosamer":
  return 23;
  case "Tetracosamer":
  return 24;
  case "Pentacosamer":
  return 25;
  case "Hexacosamer":
  return 26;
  case "Heptacosamer":
  return 27;
  case "Octacosamer":
  return 28;
  case "Nonacosamer":
  return 29;
  case "Triacontamer":
  return 30;
  case "Untriacontamer":
  return 31;
  case "Dotriacontamer":
  return 32;
  case "Tritriacontamer":
  return 33;
  case "Tetratriacontamer":
  return 34;
  case "Pentatriacontamer":
  return 35;
  case "Hexatriacontamer":
  return 36;
  case "Heptatriacontamer":
  return 37;
  case "Octatriacontamer":
  return 38;
  case "Nonatriacontamer":
  return 39;
  case "Tetracontamer":
  return 40;
  default:
  return NaN;
  }
  }
}

