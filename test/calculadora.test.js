const { sumar, restar, multiplicar, dividir } = require("../src/calculadora");

// Estas pruebas son las que Jenkins ejecutará automáticamente en cada build.
describe("Calculadora - pruebas de QA", () => {
  test("suma dos números correctamente", () => {
    expect(sumar(2, 3)).toBe(5);
  });

  test("resta dos números correctamente", () => {
    expect(restar(10, 4)).toBe(6);
  });

  test("multiplica dos números correctamente", () => {
    expect(multiplicar(3, 4)).toBe(12);
  });

  test("divide dos números correctamente", () => {
    expect(dividir(10, 2)).toBe(5);
  });

  test("lanza error al dividir por cero", () => {
    expect(() => dividir(5, 0)).toThrow("No se puede dividir por cero");
  });

  // Caso a propósito para mostrar cómo se ve un fallo en el reporte de QA
  // (coméntalo o corrígelo según lo que quieras demostrar en tu presentación)
  test("ejemplo de caso límite: suma con negativos", () => {
    expect(sumar(-5, -5)).toBe(-10);
  });
});
