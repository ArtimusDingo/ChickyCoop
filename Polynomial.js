export class Polynomial {
  constructor(coeffs) {
    this.coeffs = coeffs;
  }

  // Evaluate the polynomial at x
  evaluate(x) {
    let result = 0;
    for (let i = 0; i < this.coeffs.length; i++) {
      result += this.coeffs[i] * Math.pow(x, i);
    }
    return result;
  }

  // Add two polynomials together
  add(other) {
    const resultCoeffs = [];
    const len = Math.max(this.coeffs.length, other.coeffs.length);
    for (let i = 0; i < len; i++) {
      resultCoeffs.push((this.coeffs[i] || 0) + (other.coeffs[i] || 0));
    }
    return new Polynomial(resultCoeffs);
  }

  // Subtract a polynomial from another
  subtract(other) {
    const resultCoeffs = [];
    const len = Math.max(this.coeffs.length, other.coeffs.length);
    for (let i = 0; i < len; i++) {
      resultCoeffs.push((this.coeffs[i] || 0) - (other.coeffs[i] || 0));
    }
    return new Polynomial(resultCoeffs);
  }

  // Find a root using Newton's method
  findRoot(guess, tolerance, maxIterations) {
    let x = guess;
    for (let i = 0; i < maxIterations; i++) {
      const fx = this.evaluate(x);
      const fpx = this.derivative().evaluate(x);
      const deltaX = fx / fpx;
      x -= deltaX;
      if (Math.abs(deltaX) < tolerance) {
        return x;
      }
    }
    return null;
  }

  // Compute the derivative of the polynomial
  derivative() {
    const resultCoeffs = [];
    for (let i = 1; i < this.coeffs.length; i++) {
      resultCoeffs.push(this.coeffs[i] * i);
    }
    return new Polynomial(resultCoeffs);
  }
}
