import solutions 
import polynomial
import json 
import naming
from fujichem import FujiChem

class Simulator:
    def __init__(self, simulations):
        self.simulations = simulations
            
    @staticmethod
    def json_simulation_data(simulation):
        simulation_data = {}
        for solute in simulation.solution.solutes:
            simulation_data[solute.name] = [solute.concentration, simulation.A2]
        simulation_data["Apparent Molecular Weight"] = simulation.solution.apparent_weight_average_mw
        json_string = json.dumps(simulation_data)
        print(json_string)
            
class Simulation:
    def __init__(self, solution):
        self.solution = solution
        self.equilibrium_expression = None
        self.A2 = 1.0 # change this
        
    def set_equilibrium_expression(self, expression):
        equilibrium_expression = Polynomial(expression)
        
    def construct_equilibrium_expression(self, coefficients):
        var = polynomial.Polynomial(coefficients)
        return var
       
    def generate_equilibrium_solutes(self, solute_name, equilibrium_constants):
        try:
            #Establish equilibrium amount of monomer and add that as a solute to the solution's list of solutes
            starting_solute = list(filter(lambda instance: instance.name == solute_name, self.solution.solutes))[0]
            working_molecular_weight = starting_solute.molecular_weight
            total_molarity = starting_solute.nominal_molarity()  
            equilibrium_expression = self.construct_equilibrium_expression([-total_molarity, 1] + equilibrium_constants) 
            monomer_molarity = FujiChem.find_equilibrium_monomer(total_molarity, equilibrium_expression) 
            working_name = naming.name_species(starting_solute.name, 1)
            solute = solutions.Solute(working_name, solutions.Solute.compute_concentration_from_molarity(monomer_molarity, working_molecular_weight), working_molecular_weight)
            self.solution.solutes.append(solute)
            #Find equilibrium amounts of remaining species
            for item in range(0, len(equilibrium_constants)):
                working_molarity = 0
                order = item + 2
                if equilibrium_constants[item] != 0:
                    working_molecular_weight =  starting_solute.molecular_weight * order
                    working_molarity = FujiChem.compute_nmer_molarity(monomer_molarity, equilibrium_constants[item] / order, order)
                    working_name = naming.name_species(starting_solute.name, order)
                    solute = solutions.Solute(working_name, solutions.Solute.compute_concentration_from_molarity(working_molarity, working_molecular_weight), working_molecular_weight)
                    self.solution.solutes.append(solute)                  
        except IndexError:
            return None
      
    def model_solution(self, excluded_volume):
        self.A2 = FujiChem.compute_a2(excluded_volume, self.solution.solutes[0].molecular_weight)
        self.solution.compute_weight_average_mw()
        self.solution.compute_apparent_weight_average_mw(excluded_volume)
            
        
class ResultSet:
    def __init__(self, data_set):
        self.data_set = data_set
        
    def json_data_set(self):
        return json.dumps(self.data_set)
        
        