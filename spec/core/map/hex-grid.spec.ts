import * as Honeycomb from "honeycomb-grid";
import { HexBase } from "../../../src/core/map/hex-base";
import { HexGrid } from "../../../src/core/map/hex-grid";

describe("HexGrid", () => {
  describe("constructor", () => {
    it("throw when cols and rows less than 2", () => {
      expect(() => {
        new HexGrid(1, "flat", 0, 0);
      }).toThrow();
    });
  });
  describe("flat", () => {
    const hexGrid = new HexGrid(1, "flat", 2, 2);
    describe("hex calculations", () => {
      it("width", () => {
        expect(hexGrid.hexWidth()).toBe(2);
      });
      it("height", () => {
        expect(hexGrid.hexHeight()).toBe(1.7320508075688772);
      });
    });
    describe("grid calculations", () => {
      it("width", () => {
        expect(hexGrid.gridWidth()).toBe(3.5);
      });
      it("height", () => {
        expect(hexGrid.gridHeight()).toBe(4.330127018922193);
      });
    });
  });
  describe("pointy", () => {
    const hexGrid = new HexGrid(1, "pointy", 2, 2);
    describe("hex calculations", () => {
      it("width", () => {
        expect(hexGrid.hexWidth()).toBe(1.7320508075688772);
      });
      it("height", () => {
        expect(hexGrid.hexHeight()).toBe(2);
      });
    });
    describe("grid calculations", () => {
      it("width", () => {
        expect(hexGrid.gridWidth()).toBe(4.330127018922193);
      });
      it("height", () => {
        expect(hexGrid.gridHeight()).toBe(3.5);
      });
    });
  });
  describe("on select hex", () => {
    const hexGrid = new HexGrid(10, "flat", 5, 5);
    it("does exist", () => {
      const actual = hexGrid.onSelectHex(8, 11);
      expect(actual.cartesian().x).toBe(0);
      expect(actual.cartesian().y).toBe(0);
      expect(actual.isHighlighted).toBeTruthy;
    });
    it("not exist", () => {
      const actual = hexGrid.onSelectHex(0, 0);
      expect(actual).toBeNull();
    });
    describe("range of 2", () => {
      it("returns hexes within range", () => {
        const hex = hexGrid.onSelectHex(43, 43);
        const actual = hexGrid.getRange(hex, 2);
        const grid = Honeycomb.defineGrid(
          Honeycomb.extendHex(
            new HexBase(hex.size, hex.orientation, hex.isHighlighted)
          )
        );
        const expected = grid.hexagon({ radius: 2, center: { x: 2, y: 2 } });
        expect(actual).toEqual(expected);
      });
    });
  });
});
