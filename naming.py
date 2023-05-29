def name_species(base_name, order):
    return base_name + " - " + select_species_name(order)

def select_species_name(species):
    if species == 1:
        return "Monomer"
    elif species == 2:
        return "Dimer"
    elif species == 3:
        return "Trimer"
    elif species == 4:
        return "Tetramer"
    elif species == 5:
        return "Pentamer"
    elif species == 6:
        return "Hexamer"
    elif species == 7:
        return "Heptamer"
    elif species == 8:
        return "Octamer"
    elif species == 9:
        return "Nonamer"
    elif species == 10:
        return "Decamer"
    elif species == 11:
        return "Undecamer"
    elif species == 12:
        return "Dodecamer"
    elif species == 13:
        return "Tridecamer"
    elif species == 14:
        return "Tetradecamer"
    elif species == 15:
        return "Pentadecamer"
    elif species == 16:
        return "Hexadecamer"
    elif species == 17:
        return "Heptadecamer"
    elif species == 18:
        return "Octadecamer"
    elif species == 19:
        return "Nonadecamer"
    elif species == 20:
        return "Icosamer"
    elif species == 21:
        return "Eicosamer"
    elif species == 22:
        return "Docosamer"
    elif species == 23:
        return "Tricosamer"
    elif species == 24:
        return "Tetracosamer"
    elif species == 25:
        return "Pentacosamer"
    elif species == 26:
        return "Hexacosamer"
    elif species == 27:
        return "Heptacosamer"
    elif species == 28:
        return "Octacosamer"
    elif species == 29:
        return "Nonacosamer"
    elif species == 30:
        return "Triacontamer"
    elif species == 31:
        return "Untriacontamer"
    elif species == 32:
        return "Dotriacontamer"
    elif species == 33:
        return "Tritriacontamer"
    elif species == 34:
        return "Tetratriacontamer"
    elif species == 35:
        return "Pentatriacontamer"
    elif species == 36:
        return "Hexatriacontamer"
    elif species == 37:
        return "Heptatriacontamer"
    elif species == 38:
        return "Octatriacontamer"
    elif species == 39:
        return "Nonatriacontamer"
    elif species == 40:
        return "Tetracontamer"
    else:
        return ""
