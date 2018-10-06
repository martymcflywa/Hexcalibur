import { CoordOffset } from "../../../src/actors/grid/coordOffset";
import { Hex } from "../../../src/actors/grid/hex";

describe("Coordinates offset", () => {
  describe("from cube", () => {
    it("even q", () => {
      let expected = new CoordOffset(1, 3);
      expect(
        CoordOffset.qOffsetFromCube(CoordOffset.even, new Hex(1, 2, -3))
      ).toEqual(expected);
    });
    it("odd q", () => {
      let expected = new CoordOffset(1, 2);
      expect(
        CoordOffset.qOffsetFromCube(CoordOffset.odd, new Hex(1, 2, -3))
      ).toEqual(expected);
    });
  });
  describe("to cube", () => {
    it("even q", () => {
      let expected = new Hex(1, 2, -3);
      expect(
        CoordOffset.qOffsetToCube(CoordOffset.even, new CoordOffset(1, 3))
      ).toEqual(expected);
    });
    it("odd q", () => {
      let expected = new Hex(1, 2, -3);
      expect(
        CoordOffset.qOffsetToCube(CoordOffset.odd, new CoordOffset(1, 2))
      ).toEqual(expected);
    });
  });
  describe("round trip", () => {
    describe("cube to offset to cube", () => {
      let expected = new Hex(3, 4, -7);
      it("even q", () => {
        expect(
          CoordOffset.qOffsetToCube(
            CoordOffset.even,
            CoordOffset.qOffsetFromCube(CoordOffset.even, expected)
          )
        ).toEqual(expected);
      });
      it("odd q", () => {
        expect(
          CoordOffset.qOffsetToCube(
            CoordOffset.odd,
            CoordOffset.qOffsetFromCube(CoordOffset.odd, expected)
          )
        ).toEqual(expected);
      });
      it("even r", () => {
        expect(
          CoordOffset.rOffsetToCube(
            CoordOffset.even,
            CoordOffset.rOffsetFromCube(CoordOffset.even, expected)
          )
        ).toEqual(expected);
      });
      it("odd r", () => {
        expect(
          CoordOffset.rOffsetToCube(
            CoordOffset.odd,
            CoordOffset.rOffsetFromCube(CoordOffset.odd, expected)
          )
        ).toEqual(expected);
      });
    });
    describe("offset to cube to offset", () => {
      let expected = new CoordOffset(1, -3);
      it("even q", () => {
        expect(
          CoordOffset.qOffsetFromCube(
            CoordOffset.even,
            CoordOffset.qOffsetToCube(CoordOffset.even, expected)
          )
        ).toEqual(expected);
      });
      it("odd q", () => {
        expect(
          CoordOffset.qOffsetFromCube(
            CoordOffset.odd,
            CoordOffset.qOffsetToCube(CoordOffset.odd, expected)
          )
        ).toEqual(expected);
      });
      it("even r", () => {
        expect(
          CoordOffset.rOffsetFromCube(
            CoordOffset.even,
            CoordOffset.rOffsetToCube(CoordOffset.even, expected)
          )
        ).toEqual(expected);
      });
      it("odd r", () => {
        expect(
          CoordOffset.rOffsetFromCube(
            CoordOffset.odd,
            CoordOffset.rOffsetToCube(CoordOffset.odd, expected)
          )
        ).toEqual(expected);
      });
    });
  });
});
