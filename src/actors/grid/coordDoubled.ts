import { Hex } from "./hex";

export class CoordDoubled {
  constructor(private readonly _col: number, private readonly _row: number) {}

  public get col(): number {
    return this._col;
  }

  public get row(): number {
    return this._row;
  }

  public static qDoubledFromCube(hex: Hex): CoordDoubled {
    let col = hex.q;
    let row = 2 * hex.r + hex.q;
    return new CoordDoubled(col, row);
  }

  public static qDoubledToCube(coord: CoordDoubled): Hex {
    let q = coord.col;
    let r = (coord.row - coord.col) / 2;
    let s = -q - r;
    return new Hex(q, r, s);
  }

  public static rDoubledFromCube(hex: Hex): CoordDoubled {
    let col = 2 * hex.q + hex.r;
    let row = hex.r;
    return new CoordDoubled(col, row);
  }

  public static rDoubledToCube(coord: CoordDoubled): Hex {
    let q = (coord.col - coord.row) / 2;
    let r = coord.row;
    let s = -q - r;
    return new Hex(q, r, s);
  }
}
