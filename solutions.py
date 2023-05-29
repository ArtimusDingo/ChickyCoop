from fujichem import FujiChem

class Solute:
    def __init__(self, name, concentration, molecular_weight):
        self.name = name
        self.concentration = concentration
        self.molecular_weight = molecular_weight
        self.apparent_weight_average_mw = None

    @property 
    def name(self):
        return self.name
    
    #@name.setter
    def name(self, value):
        self.name = value

    @property 
    def concentration(self):
        return self.concentration
    
    #@concentration.setter
    def concentration(self, value):
        self.concentration = value

    @property 
    def molecular_weight(self):
        return self.molecular_weight
    
    #@concentration.setter
    def molecular_weight(self, value):
        self.molecular_weight = value
        
    def nominal_molarity(self):
        return FujiChem.compute_total_molarity(self.concentration, self.molecular_weight)
    
    def compute_apparent_weight_average_mw(self, excluded_volume):
        self.apparent_weight_average_mw = FujiChem.apparent_weight_average_mw([[self.concentration], [self.molecular_weight]], excluded_volume)
     
    @staticmethod
    def compute_concentration_from_molarity(molarity, molecular_weight):
        return FujiChem.compute_concentration_from_molarity(molarity, molecular_weight)
        
class Solution:
    def __init__(self, solutes):
        self.solutes = solutes
        self.weight_average_mw = None
        self.apparent_weight_average_mw = None
    
    def compute_weight_average_mw(self):
        concentrations = []
        molecular_weights = []
        for i in range(1, len(self.solutes)):
            concentrations = concentrations + [self.solutes[i].concentration]
            molecular_weights = molecular_weights + [self.solutes[i].molecular_weight]
        self.weight_average_mw = FujiChem.compute_weight_average_mw([concentrations, molecular_weights])
        print(concentrations, molecular_weights)
                   
    def compute_apparent_weight_average_mw(self, excluded_volume):
        self.apparent_weight_average_mw = FujiChem.apparent_weight_average_mw([[self.solutes[0].concentration], [self.weight_average_mw]], excluded_volume)
    
    
        
    

        
  
        




