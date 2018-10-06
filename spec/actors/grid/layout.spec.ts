import { Hex } from "../../../src/actors/grid/hex";
import { Layout } from "../../../src/actors/grid/layout";
import { Point } from "../../../src/actors/grid/point";

describe("Layout", () => {
  let expected = new Hex(3, 4, -7);
  it("flat hex", () => {
    let flat = new Layout(Layout.flat, new Point(10, 15), new Point(35, 71));
    expect(flat.pixelToHex(flat.hexToPixel(expected)).round()).toEqual(
      expected
    );
  });
  it("pointy hex", () => {
    let pointy = new Layout(
      Layout.pointy,
      new Point(10, 15),
      new Point(35, 71)
    );
    expect(pointy.pixelToHex(pointy.hexToPixel(expected)).round()).toEqual(
      expected
    );
  });
});
