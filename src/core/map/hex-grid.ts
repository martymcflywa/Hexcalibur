import * as honeycomb from "honeycomb-grid";
import { UnsupportedOrientationError } from "../exceptions/unsupported-orientation-error";

/**
 * Represents a hex grid, wraps honeycomb library.
 */
export class HexGrid {
  private readonly _size: number;
  private readonly _orientation: string;
  private readonly _cols: number;
  private readonly _rows: number;
  private _grid: honeycomb.Grid;
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

    this._size = size;
    this._orientation = orientation;
    this._cols = cols;
    this._rows = rows;
    let hexFactory = honeycomb.extendHex({ size, orientation });
    let gridFactory = honeycomb.defineGrid(hexFactory);
    this._grid = gridFactory.rectangle({ width: cols, height: rows });
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
    // sideOffsetX = (tileWidth - size) / 2;
    // sideOffsetY = (tileHeight - size) / 2;
    // columnWidth = sideOffsetX + sideLengthX
    // rowHeight = sideOffsetY + sideLengthY
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
  public grid(): honeycomb.Grid {
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
  public setShouldDrawCoordinates(shouldDrawCartesian: boolean) {
    this._shouldDrawCartesian = shouldDrawCartesian;
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
