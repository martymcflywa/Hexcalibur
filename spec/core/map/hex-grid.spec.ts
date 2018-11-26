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
    let hexGrid = new HexGrid(1, "pointy", 2, 2);
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
    let hexGrid = new HexGrid(10, "flat", 2, 2);
    it("does exist", () => {
      let actual = hexGrid.onSelectHex(8, 11);
      let cartesian = actual.hex.cartesian();
      let isUpdated = actual.isUpdated;
      expect(cartesian.x).toBe(0);
      expect(cartesian.y).toBe(0);
      expect(isUpdated).toBe(true);
    });
    it("not exist", () => {
      let actual = hexGrid.onSelectHex(0, 0);
      let cartesian = actual.hex.cartesian();
      let isUpdated = actual.isUpdated;
      expect(cartesian.x).toBe(-1);
      expect(cartesian.y).toBe(-1);
      expect(isUpdated).toBeFalsy();
    });
  });
});
