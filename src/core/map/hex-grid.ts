import * as Honeycomb from "honeycomb-grid";
import * as Log from "../log/log-config";
import { HexBase } from "./hex-base";
import { UnsupportedOrientationError } from "../exceptions/unsupported-orientation-error";

/**
 * Represents a hex grid, wraps honeycomb library.
 */
export class HexGrid {
  private readonly _orientation: string;
  private readonly _cols: number;
  private readonly _rows: number;
  private readonly _gridFactory: Honeycomb.GridFactory<Honeycomb.Hex<HexBase>>;
  private _grid: Honeycomb.Grid<Honeycomb.Hex<HexBase>>;
  private _hexesToHighlight: Honeycomb.Hex<HexBase>[];
  private _shouldDrawGrid: boolean;
  private _shouldDrawCartesian: boolean;

  /**
   * Construct a honeycomb grid and populate fields used for map calculation.
   * @param size The hex's size.
   * @param orientation The orientation of the hex, either flat or pointy.
   * @param cols Number of columns in grid.
   * @param rows Number of rows in grid.
   * @param shouldDrawGrid Whether or not grid should be drawn.
   * @param shouldDrawCartesian Whether or not cartesian coordinates should be drawn.
   */
  constructor(
    size: number,
    orientation: "flat" | "pointy",
    cols: number,
    rows: number,
    shouldDrawGrid?: boolean,
    shouldDrawCartesian?: boolean
  ) {
    if (cols < 2 || rows < 2)
      throw new RangeError("HexGrid cols and rows must be greater than one");

    this._orientation = orientation;
    this._cols = cols;
    this._rows = rows;
    let hexFactory = Honeycomb.extendHex(new HexBase(size, orientation, false));
    this._gridFactory = Honeycomb.defineGrid(hexFactory);
    this._grid = this._gridFactory.rectangle({ width: cols, height: rows });
    this._shouldDrawGrid = shouldDrawGrid || true;
    this._shouldDrawCartesian = shouldDrawCartesian || true;
  }

  /**
   * Return number of columns in grid.
   */
  public columns(): number {
    return this._cols;
  }

  /**
   * Return number of rows in grid.
   */
  public rows(): number {
    return this._rows;
  }

  /**
   * Return hex width in pixels.
   */
  public hexWidth(): number {
    return this._grid[0].width();
  }

  /**
   * Return hex height in pixels.
   */
  public hexHeight(): number {
    return this._grid[0].height();
  }

  /**
   * Return grid width in pixels.
   */
  public gridWidth(): number {
    switch (this._orientation) {
      case "flat":
        return (
          this._cols * (this.hexWidth() - this.cornerOffset()) +
          this.cornerOffset()
        );
      case "pointy":
        return this._cols * this.hexWidth() + this.edgeOffset();
      default:
        throw new UnsupportedOrientationError(this._orientation);
    }
  }

  /**
   * Return grid height in pixels.
   */
  public gridHeight(): number {
    switch (this._orientation) {
      case "flat":
        return this._rows * this.hexHeight() + this.edgeOffset();
      case "pointy":
        return (
          this._rows * (this.hexHeight() - this.cornerOffset()) +
          this.cornerOffset()
        );
      default:
        throw new UnsupportedOrientationError(this._orientation);
    }
  }

  /**
   * Get honeycomb grid.
   */
  public grid(): Honeycomb.Grid<Honeycomb.Hex<HexBase>> {
    return this._grid;
  }

  /**
   * Whether or not grid should be rendered/drawn.
   */
  public shouldDrawGrid(): boolean {
    return this._shouldDrawGrid;
  }

  /**
   * Set whether or not hex grid should be rendered/drawn.
   * @param shouldDrawGrid
   */
  public setShouldDrawGrid(shouldDrawGrid: boolean) {
    this._shouldDrawGrid = shouldDrawGrid;
  }

  /**
   * Whether or not cartesian coordinates should be drawn.
   */
  public shouldDrawCartesian(): boolean {
    return this._shouldDrawCartesian;
  }

  /**
   * Set whether or not cartesian coordinates should be drawn.
   * @param shouldDrawCartesian
   */
  public setShouldDrawCartesian(shouldDrawCartesian: boolean) {
    this._shouldDrawCartesian = shouldDrawCartesian;
  }

  /**
   * If hex exists in grid, returns selected hex from pixel coordinates, else
   * returns null.
   * @param x The x pixel coordinate.
   * @param y The y pixel coordinate.
   * @returns The hex if selectable.
   */
  public onSelectHex(x: number, y: number): Honeycomb.Hex<HexBase> {
    const hex = this.pointToHex(x, y);
    if (!hex) return null;
    this._hexesToHighlight = this.getRange(hex, 2);
    return hex;
  }

  /**
   * Returns hexes within range of selected center hex
   * @param hex
   * @param range
   */
  public getRange(hex: Honeycomb.Hex<HexBase>, range: number) {
    if (!hex) return null;
    return this._grid.hexesInRange(hex, range, true);
  }

  /**
   * Retrieve the array of hexes to highlight.
   */
  public hexesToHighlight(): Honeycomb.Hex<HexBase>[] {
    return this._hexesToHighlight;
  }

  /**
   * Convert pixel coordinates to a hex in the grid. Returns the hex if
   * converted from pixel coordinates, else returns null.
   * @returns The hex if converted from pixel coordinates, else returns null.
   */
  private pointToHex(x: number, y: number): Honeycomb.Hex<HexBase> {
    let key = this._gridFactory.pointToHex(x, y);
    let hex = this._grid.get(key);
    if (!hex) {
      Log.HexGrid.debug(() => `Hex not found at px(${x},${y})`);
      return null;
    }
    let coordinates = hex.cartesian();
    Log.HexGrid.debug(
      () => `Converted px(${x},${y}) to hex(${coordinates.x},${coordinates.y})`
    );
    return hex;
  }

  /**
   * Return corner offset in pixels.
   */
  private cornerOffset(): number {
    return this._grid[0].oppositeCornerDistance() / 4;
  }

  /**
   * Return edge offset in pixels.
   */
  private edgeOffset(): number {
    return this._grid[0].oppositeSideDistance() / 2;
  }
}
