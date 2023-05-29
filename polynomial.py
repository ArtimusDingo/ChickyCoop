class Polynomial: 
    def __init__(self, coeffs):
        self.coeffs = coeffs

    def evaluate(self, x):
        result = 0
        for degree, coeff in enumerate(self.coeffs):
            result += coeff * (x ** degree)
        return result

    def derivative(self, order = 1):
        derv_coeffs = []
        working_coeffs = self.coeffs
        for num in range(0, order):
            for degree, coeff in enumerate(working_coeffs):
                derv_coeffs.append(coeff * (degree))
                working_coeffs = derv_coeffs
        working_coeffs = list(filter(lambda x: x != 0, working_coeffs))
        return Polynomial(working_coeffs)

    def estimate_root(self, guess, tolerance = 0.00000001, iterations = 1000):
        derivative = self.derivative()
        ratio = 0
        result = 0
        try:
            for num in range(iterations):
                ratio = self.evaluate(guess) / derivative.evaluate(guess)
                guess -= ratio
                if ratio <= tolerance:
                    return guess
        except ZeroDivisionError:
            return None
        return None








