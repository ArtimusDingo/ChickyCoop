import { GraphManager } from "./Graph.js";
import { ResultSet } from "./Solution.js";

export class FileManager
{
    constructor(graphManager)
    {
        this.loadTrigger = false; // stops the event handler from plotting multiple graphs. An exciting solution to an exciting problem.
        this.graphManager = graphManager;
    }
    getLoadTrigger()
    {
        return this.loadTrigger;
    }
    loadCSV(fileInput, plot)
    {
        fileInput.addEventListener('change', () => this.csvHandler(fileInput))
        this.loadTrigger = false;
    }
    csvHandler(fileInput)
    {
        let rawSet = new ResultSet();
        if(!this.loadTrigger)
        {
            const file = fileInput.files[0];
            let filename = file.name.split('.')[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (event) => 
            {
                const csvData = event.target.result;
                const rows = csvData.split('\n');
                for(let i = 0; i < rows.length; i++)
                {
                    const row = rows[i].split(',');
                    if(row.length === 2)
                    {
                        rawSet.addRow({x: parseFloat(row[0]), y: parseFloat(row[1])});
                    }
                }
                rawSet.filename = filename;
                this.graphManager.createGraphs([rawSet]);
                this.graphManager.displayPlots(this.graphManager.graphs, plot);
            }
        }
        this.loadTrigger = true;
        return rawSet;
    }
}