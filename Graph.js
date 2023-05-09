import {Solution} from "./Solution.js";
import {ResultSet} from "./Solution.js";

export class GraphManager
{
    constructor(optionHolder, optionSelector, graphs = [])
    {
        this.optionSelector = optionSelector;
        this.optionHolder = optionHolder;
        this.graphs = graphs;
        this.init = false;
    }

    generateID()
    {
        while(true)
        {
            const id = Math.floor(Math.random() * 500) + 1;
            for(let i = 0; i < this.graphs.length; i++)
            {
                if(this.graphs[i].id === id)
                {
                    break;
                }
            }
            return id;
        }
    }
    selectGraph(id)
    {
        for(let i = 0; i < this.graphs.length; i++)
        {
            if(this.graphs[i].id == id)
            {
                return this.graphs[i];
            }
        }
    }
    getX(selection)
    {
    return this.selectGraph(selection).x
    }

    getY(selection)
    {
    return this.selectGraph(selection).y;
    }

    getName(selection)
    {
        return this.selectGraph(selection).name;
    }

    getGraphs()
    {
        return this.graphs;
    }
    addGraph(graph)
    {
        this.graphs.push(graph);
    }

    getOptions()
    {
        let options = [];
        for(let i = 0; i < this.graphs.length; i++)
        {
            let graphs = {};
            graphs["name"] = this.graphs[i].name;
            graphs["value"] = i;
            options.push(graphs);
        }
        return options;
    }


    createGraph(resultSet)
    {
        const id = this.generateID();
        let graph = new Graph(resultSet.filename, resultSet.getValues('x'), resultSet.getValues('y'), "Concentration (mg/mL)", "MW,app (kDa)", "red", id);
        this.addGraph(graph);
        this.addOptions(graph);
        this.addSimOptions(graph);
	return id;
    }

     deleteGraphs(selection)
     {
        
        let graphSelection = document.getElementById("graphSelect");
        let simSelect = document.getElementById("selectSimData");
        for (let i = graphSelection.options.length - 1; i >= 0; i--) 
        {
            const id = graphSelection.options[i].value;
            for (let j = simSelect.options.length - 1; j >= 0; j--)
            {
                if(simSelect.options[j].value === id)
                {
                    console.log("Deleted...")
                    simSelect.options.remove(j);
                    break;
                }
            }
            if (graphSelection.options[i].selected) 
            {
              graphSelection.options[i].remove();
              for(let i = 0; i < selection.length; i++)
              {
                  this.graphs.splice(this.selectGraph(selection[i]), 1);
                  break;
              } 
            }   
        }          
 
     }
    createGraphs(resultSets)
    {
        for(let i = 0; i < resultSets.length; i++)
        {
            this.createGraph(resultSets[i]);
        }
    }
   
    setGraphName(graphID, name)
    {
        this.selectGraph(graphID).setName(name);
    }

    setGraphColor(graphID, color)
    {
       this.selectGraph(graphID).setColor(color);
    }

   startGraphManager()
   {
   
   //  let options = this.getOptions();
   //  this.addOptions(options, this.optionSelector);
     this.init = true;
   }

   addOptions(graph)
   {
    let graphSelection = document.getElementById("graphSelect");
    let option = document.createElement("option");
    option.value = graph.id;
    option.textContent = graph["name"];
    graphSelection.appendChild(option); 

   }
   addSimOptions(graph)
   {
    let graphSelection = document.getElementById("selectSimData");
    let option = document.createElement("option");
    option.value = graph.id;
    option.textContent = graph["name"];
    graphSelection.appendChild(option); 
   }

   displayPlots(graphs, plot)
   {
console.log(graphs);
    let traces = [];
    for(let i = 0; i < graphs.length; i++)
    {
        const trace = {x: graphs[i]["x"], y: graphs[i]["y"], mode: 'marker', type: 'scatter', name:graphs[i]["name"], line: {color: graphs[i]["color"]}};
        traces.push(trace);
    }
    const layout = {title: 'Mw,app vs Concentration', xaxis: { title: 'Concentration (mg/mL)' }, yaxis: { title: 'Mw, app (kDa)' }};
    return Plotly.newPlot(plot, traces, layout);
   }


   
}
  
export function getCheckedValues() {
  // get all checkboxes with the name "fruit[]"
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  // extract the values of the checked checkboxes
  const values = Array.from(checkboxes).map(checkbox => parseFloat(checkbox.value));
  // return the array of checkbox values
  return values;
}


class Graph
{
    constructor(name, x, y, xtitle, ytitle, color, id, visible = false)
    {
        this.name = name;
        this.x = x;
        this.y = y;
        this.xtitle = xtitle;
        this.ytitle = ytitle;
        this.color = color;
        this.visible = visible;
        this.id = id;      
    }

    setName(name)
    {
        this.name = name;
    }

    setX(x)
    {
        this.x = x;
    }

    setY(y)
    {
        this.y = y;
    }

    setColor(color)
    {
        this.color = color;
    }
}
