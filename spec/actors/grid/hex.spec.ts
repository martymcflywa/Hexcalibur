import { Hex } from "../../../src/actors/grid/hex";

describe("Hex", () => {
  function hexToEqual(a: Hex, b: Hex): boolean {
    return a.q === b.q && a.r === b.r && a.s === b.s;
  }

  beforeEach(() => {
    jasmine.addCustomEqualityTester(hexToEqual);
  });

  describe("construction", () => {
    it("no error when given axes sum to zero", () => {
      expect(() => {
        new Hex(-1, -1, 2);
      }).not.toThrowError();
    });

    it("error when given axes do not sum to zero", () => {
      expect(() => {
        new Hex(1, 2, 3);
      }).toThrowError("Sum of q, r and s must be zero");
    });
  });

  describe("arithmetic", () => {
    it("add hexes", () => {
      const expected = new Hex(-2, -2, 4);
      expect(new Hex(-1, -1, 2).add(new Hex(-1, -1, 2))).toEqual(expected);
    });

    it("subtract hexes", () => {
      const expected = new Hex(-1, -1, 2);
      expect(new Hex(-2, -2, 4).subtract(new Hex(-1, -1, 2))).toEqual(expected);
    });

    it("multiply hexes", () => {
      const expected = new Hex(-1, -1, 2);
      expect(new Hex(-1, -1, 2).multiply(1)).toEqual(expected);
    });
  });

  describe("rotation", () => {
    it("rotate hex left", () => {
      const expected = new Hex(-3, 1, 2);
      expect(new Hex(-1, -2, 3).rotateLeft()).toEqual(expected);
    });

    it("rotate hex right", () => {
      const expected = new Hex(2, -3, 1);
      expect(new Hex(-1, -2, 3).rotateRight()).toEqual(expected);
    });
  });

  describe("calculation", () => {
    it("distance between two hexes", () => {
      const expected = 7;
      expect(new Hex(3, -7, 4).distance(new Hex(0, 0, 0))).toEqual(expected);
    });

    it("neighbor of given direction", () => {
      const expected = new Hex(1, -3, 2);
      expect(new Hex(1, -2, 1).neighbor(2)).toEqual(expected);
    });

    it("neighbor of given diagonal", () => {
      const expected = new Hex(-1, -1, 2);
      expect(new Hex(1, -2, 1).diagonalNeighbor(3)).toEqual(expected);
    });
  });

  describe("rounding", () => {
    it("float hex co-ord to nearest integer hex co-ord", () => {
      const a = new Hex(0, 0, 0);
      const b = new Hex(1, -1, 0);
      const c = new Hex(0, -1, 1);

      expect(new Hex(5, -10, 5)).toEqual(
        new Hex(0, 0, 0).linterpolate(new Hex(10, -20, 10), 0.5).round()
      );
      expect(a.round()).toEqual(a.linterpolate(b, 0.499).round());
      expect(b.round()).toEqual(a.linterpolate(b, 0.501).round());
      expect(a.round()).toEqual(
        new Hex(
          a.q * 0.4 + b.q * 0.3 + c.q * 0.3,
          a.r * 0.4 + b.r * 0.3 + c.r * 0.3,
          a.s * 0.4 + b.s * 0.3 + c.s * 0.3
        ).round()
      );
      expect(c.round()).toEqual(
        new Hex(
          a.q * 0.3 + b.q * 0.3 + c.q * 0.3,
          a.r * 0.4 + b.r * 0.3 + c.r * 0.3,
          a.s * 0.4 + b.s * 0.3 + c.s * 0.4
        ).round()
      );
    });
  });

  describe("drawing", () => {
    it("straight line from one hex center to another", () => {
      const expected = [
        new Hex(0, 0, 0),
        new Hex(0, -1, 1),
        new Hex(0, -2, 2),
        new Hex(1, -3, 2),
        new Hex(1, -4, 3),
        new Hex(1, -5, 4)
      ];
      expect(new Hex(0, 0, 0).drawLine(new Hex(1, -5, 4))).toEqual(expected);
    });
  });
});
