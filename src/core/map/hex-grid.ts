import * as honeycomb from "honeycomb-grid";
import * as std from "tstl";
import * as Log from "../log/log-config";
import { HashMap } from "tstl";
import { HexProperties } from "./hex-properties";
import { HexUpdate } from "./hex-update";
import { UnsupportedOrientationError } from "../exceptions/unsupported-orientation-error";

/**
 * Represents a hex grid, wraps honeycomb library.
 */
export class HexGrid {
  private readonly _size: number;
  private readonly _orientation: string;
  private readonly _cols: number;
  private readonly _rows: number;
  private readonly _gridFactory: honeycomb.GridFactory<honeycomb.BaseHex<{}>>;
  private _grid: honeycomb.Grid;
  private _hexProperties: std.HashMap<string, HexProperties>;
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
    this._gridFactory = honeycomb.defineGrid(hexFactory);
    this._grid = this._gridFactory.rectangle({ width: cols, height: rows });
    this._shouldDrawGrid = shouldDrawGrid || true;
    this._shouldDrawCartesian = shouldDrawCartesian || true;
    this.initHexProperties(this._grid);
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
  public setShouldDrawCartesian(shouldDrawCartesian: boolean) {
    this._shouldDrawCartesian = shouldDrawCartesian;
  }

  /**
   * Initializes lookup map for hex properties.
   * @param grid Use cartesian for each hex as key.
   */
  private initHexProperties(grid: honeycomb.Grid) {
    this._hexProperties = new HashMap();
    grid.forEach(hex => {
      const key = this.hexToKey(hex);
      this._hexProperties.insert(new std.Pair(key, { isSelected: false }));
    });
  }

  /**
   * Handle on selection of a hex. If the hex is currently selected,
   * will set isSelected to false, else true. Returns true if successfully
   * updated status, else returns false.
   * @param x The x pixel coordinate.
   * @param y The y pixel coordinate.
   * @returns True if successfully updated isSelected, else returns false.
   */
  public onSelectHex(x: number, y: number): HexUpdate {
    const hex = this.pointToHex(x, y);
    if (!hex) return { hex: null, isUpdated: false };
    let properties = this.getProperties(hex);
    if (!properties) return { hex: hex, isUpdated: false };
    properties.isSelected = !properties.isSelected;
    this.setProperties(hex, properties);
    return { hex: hex, isUpdated: true };
  }

  /**
   * Convert pixel coordinates to a hex in the grid.
   */
  private pointToHex(x: number, y: number): honeycomb.BaseHex<{}> {
    let hex = this._gridFactory.pointToHex({ x: x, y: y });
    if (!hex) {
      Log.HexGrid.debug(() => `Hex not found at px(${x},${y})`);
      return;
    }
    let coordinates = hex.cartesian();
    Log.HexGrid.debug(
      () => `Converted px(${x},${y}) to hex(${coordinates.x},${coordinates.y})`
    );
    return hex;
  }

  /**
   * Retrieve the properties of a hex, use cartesian to lookup.
   * @param hex The hex to lookup.
   * @returns the properties of a hex, if found, else null.
   */
  public getProperties(hex: honeycomb.BaseHex<{}>): HexProperties {
    const key = this.hexToKey(hex);
    if (!this._hexProperties.has(key)) {
      Log.HexGrid.debug(() => `Properties for hex(${key}) not found`);
      return;
    }
    return this._hexProperties.get(key);
  }

  /**
   * Set the properties of a hex.
   * @param hex
   * @param value
   */
  private setProperties(hex: honeycomb.BaseHex<{}>, value: HexProperties) {
    const key = this.hexToKey(hex);
    this._hexProperties.set(key, value);
  }

  /**
   * Convert a hex to its string key.
   * @param hex
   */
  private hexToKey(hex: honeycomb.BaseHex<{}>): string {
    return `${hex.cartesian().x},${hex.cartesian().y}`;
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
