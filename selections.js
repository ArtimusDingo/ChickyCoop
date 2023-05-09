export function generateCheckboxes(containerId, numCheckboxes) {
  const container = document.getElementById(containerId);

  // Calculate the number of rows needed based on the number of checkboxes
  const numRows = Math.ceil(numCheckboxes / 10);

  for (let i = 0; i < numRows; i++) {
    // Create a container div for each row of checkboxes
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("checkbox-row");
    container.appendChild(rowContainer);

    // Create a container div for every 10 checkboxes
    for (let j = 1; j <= 10; j++) {
      const checkboxIndex = i * 10 + j;
      if (checkboxIndex > numCheckboxes) {
        // If we've created all the necessary checkboxes, break out of the loop
        break;
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = getPolymerName(checkboxIndex);
      checkbox.value = checkboxIndex;
      checkbox.classList.add("checkbox");

      const label = document.createElement("label");
      label.setAttribute("for", getPolymerName(checkboxIndex));
      label.textContent = getPolymerName(checkboxIndex);

      const checkboxContainer = document.createElement("div");
      checkboxContainer.classList.add("checkbox-container");
      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);

      // Append the checkbox container to the current row container
      rowContainer.appendChild(checkboxContainer);

      // If we've reached the 10th checkbox, create a new container div
      if (j % 10 === 0) {
        const groupContainer = document.createElement("div");
        groupContainer.classList.add("checkbox-group");
        rowContainer.appendChild(groupContainer);
      }
    }
  }
}


export function generateDropDown()
{
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
document.body.appendChild(select);
}

function getPolymerName(numMonomers) {
  switch (numMonomers) {
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
    default:
      return "";
  }
}


