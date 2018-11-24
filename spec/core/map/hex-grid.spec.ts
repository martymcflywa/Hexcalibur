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
    let hexGrid = new HexGrid(1, "flat", 2, 2);
    describe("hex calculations", () => {
      it("width", () => {
        expect(hexGrid.hexWidth()).toEqual(2);
      });
      it("height", () => {
        expect(hexGrid.hexHeight()).toEqual(1.7320508075688772);
      });
    });
    describe("grid calculations", () => {
      it("width", () => {
        expect(hexGrid.gridWidth()).toEqual(3.5);
      });
      it("height", () => {
        expect(hexGrid.gridHeight()).toEqual(4.330127018922193);
      });
    });
  });
  describe("pointy", () => {
    let hexGrid = new HexGrid(1, "pointy", 2, 2);
    describe("hex calculations", () => {
      it("width", () => {
        expect(hexGrid.hexWidth()).toEqual(1.7320508075688772);
      });
      it("height", () => {
        expect(hexGrid.hexHeight()).toEqual(2);
      });
    });
    describe("grid calculations", () => {
      it("width", () => {
        expect(hexGrid.gridWidth()).toEqual(4.330127018922193);
      });
      it("height", () => {
        expect(hexGrid.gridHeight()).toEqual(3.5);
      });
    });
  });
});
