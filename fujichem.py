import math 
from polynomial import Polynomial

A_SPHERE = 1.0
B_SPHERE = 4.0 / math.pi
C_SPHERE = B_SPHERE / 3.0
AVOGADROS_NUMBER = 6022140857746852770

class FujiChem:
    
    @staticmethod
    def hardsphere_correction(i):
        val = ((i - 1.0) * (i - 2.0) * (math.pow(A_SPHERE, 2)) * (math.pow(B_SPHERE, 2)) / (6 * (math.pow(C_SPHERE, 2))))
        val = val + ((i - 1.0) * ((A_SPHERE * B_SPHERE) / C_SPHERE))
        val = val = i * (val + 1.0)
        return val
    
    @staticmethod
    def z_factor(concentration, excluded_volume, iterations = 10):
        z = 0.0
        psi = (concentration * excluded_volume) / 1000.0
        for num in range(2, 101):
            z = z + (FujiChem.hardsphere_correction(num) * math.pow(psi, num - 1))
        return z + 1
    
    @staticmethod
    def compute_total_molarity(concentration, molecular_weight):
        return concentration / molecular_weight
    
    def compute_concentration_from_molarity(molarity, molecular_weight):
        return molarity * molecular_weight
    
    
    @staticmethod 
    # Data must be passed as 2D array, the first being concentration, the second molecular weight
    def compute_weight_average_mw(solute_data):
        numerator = 0.0
        denominator = 0.0
        weight_average_mw = 0.0
        for concentration, molecular_weight in zip(solute_data[0], solute_data[1]):
            molarity = FujiChem.compute_total_molarity(concentration, molecular_weight)
            numerator = numerator + (math.pow(molecular_weight, 2) * molarity)
            denominator = denominator + (molecular_weight * molarity)
        weight_average_mw = numerator / denominator
        return weight_average_mw
    
    @staticmethod
    def apparent_weight_average_mw(solute_data, excluded_volume, iterations = 10):
        weight_average_mw = FujiChem.compute_weight_average_mw(solute_data)
        z = FujiChem.z_factor(solute_data[0][0], excluded_volume, iterations)
        return weight_average_mw / z
    
    @staticmethod
    def find_equilibrium_monomer(total_molarity, poly):
        return poly.estimate_root(total_molarity)
    
    @staticmethod
    def compute_nmer_molarity(monomer_molarity, k, order):
        return k * math.pow(monomer_molarity, order)
    
    @staticmethod
    def compute_r_over_k(dndc, mw):
        return math.pow(dndc, 2) * mw
    
    @staticmethod
    def compute_a2(excluded_volume, molecular_weight):
        return (excluded_volume / molecular_weight) * 4.0
    

        