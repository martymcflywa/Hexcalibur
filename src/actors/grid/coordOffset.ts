import { Hex } from "./hex";

export class CoordOffset {
  constructor(private readonly _col: number, private readonly _row: number) {}

  public static readonly even = 1;
  public static readonly odd = -1;

  public get col(): number {
    return this._col;
  }

  public get row(): number {
    return this._row;
  }

  public static qOffsetFromCube(offset: number, hex: Hex): CoordOffset {
    let col = hex.q;
    let row = hex.r + (hex.q + offset * (hex.q & 1)) / 2;
    return new CoordOffset(col, row);
  }

  public static qOffsetToCube(offset: number, coord: CoordOffset): Hex {
    let q = coord.col;
    let r = coord.row - (coord.col + offset * (coord.col & 1)) / 2;
    let s = -q - r;
    return new Hex(q, r, s);
  }

  public static rOffsetFromCube(offset: number, hex: Hex): CoordOffset {
    let col = hex.q + (hex.r + offset * (hex.r & 1)) / 2;
    let row = hex.r;
    return new CoordOffset(col, row);
  }

  public static rOffsetToCube(offset: number, coord: CoordOffset): Hex {
    let q = coord.col - (coord.row + offset * (coord.row & 1)) / 2;
    let r = coord.row;
    let s = -q - r;
    return new Hex(q, r, s);
  }
}
