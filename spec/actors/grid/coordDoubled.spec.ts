import { CoordDoubled } from "../../../src/actors/grid/coordDoubled";
import { Hex } from "../../../src/actors/grid/hex";

describe("Coordinates doubled", () => {
  describe("from cube", () => {
    it("doubled q", () => {
      let expected = new CoordDoubled(1, 5);
      expect(CoordDoubled.qDoubledFromCube(new Hex(1, 2, -3))).toEqual(
        expected
      );
    });
    it("doubled r", () => {
      let expected = new CoordDoubled(4, 2);
      expect(CoordDoubled.rDoubledFromCube(new Hex(1, 2, -3))).toEqual(
        expected
      );
    });
  });
  describe("to cube", () => {
    let expected = new Hex(1, 2, -3);
    it("doubled q", () => {
      expect(CoordDoubled.qDoubledToCube(new CoordDoubled(1, 5))).toEqual(
        expected
      );
    });
    it("doubled r", () => {
      expect(CoordDoubled.rDoubledToCube(new CoordDoubled(4, 2))).toEqual(
        expected
      );
    });
  });
});
