import * as Ex from "excalibur";
import * as Honeycomb from "honeycomb-grid";
import { HexGrid } from "./hex-grid";

/**
 * Extends TileMap to include convenience functionality for hex tile maps.
 */
export class HexMap extends Ex.TileMap {
  private readonly _hexGrid: HexGrid;
  private readonly _strokeColor = Ex.Color.Black;
  private readonly _strokeWidth = 0.5;
  private readonly _highlightColor = new Ex.Color(255, 255, 255, 0.2);
  private readonly _noHighlightColor = new Ex.Color(0, 0, 0, 0);

  /**
   * Construct a hex tilemap, based on data from the hex grid.
   * @param hexGrid The hex grid which overlays the hex tile map.
   */
  constructor(hexGrid: HexGrid) {
    super({
      x: 0,
      y: 0,
      cellWidth: hexGrid.hexWidth(),
      cellHeight: hexGrid.hexHeight(),
      cols: hexGrid.columns(),
      rows: hexGrid.rows()
    });
    this._hexGrid = hexGrid;
  }

  /**
   * Draw grid elements over each iteration.
   * @param ctx
   * @param delta
   */
  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
    this.clearStroke(ctx);
    this.clearFill(ctx);
    this._hexGrid.grid().forEach(hex => {
      let point = hex.toPoint();
      let corners = hex.corners().map(corner => corner.add(point));
      this.hexPath(ctx, corners);
      this.drawHex(ctx);
      this.drawCartesian(ctx, delta, hex);
    });
    this.fillHex(ctx);
  }

  /**
   * Generate the path for a hex.
   * @param ctx
   * @param corners
   */
  private hexPath(
    ctx: CanvasRenderingContext2D,
    corners: Honeycomb.PointLike[]
  ) {
    const [firstCorner, ...otherCorners] = corners;
    ctx.moveTo(firstCorner.x, firstCorner.y);
    ctx.beginPath();
    otherCorners.forEach(({ x, y }) => {
      ctx.lineTo(x, y);
    });
    ctx.lineTo(firstCorner.x, firstCorner.y);
    ctx.closePath();
  }

  /**
   * Draws a hex outline.
   * @param ctx The canvas context.
   * @param corners The six corners of the hex to draw.
   */
  private drawHex(ctx: CanvasRenderingContext2D) {
    if (!this._hexGrid.shouldDrawGrid()) return;
    ctx.lineWidth = this._strokeWidth;
    ctx.strokeStyle = this._strokeColor.toString();
    ctx.stroke();
    ctx.save();
  }

  /**
   * Draws the cartesian coordinate for a hex.
   * @param ctx The canvas context.
   * @param delta The delta since last call.
   * @param hex The hex to draw the cartesian coordinates for.
   */
  private drawCartesian<T>(
    ctx: CanvasRenderingContext2D,
    delta: number,
    hex: Honeycomb.BaseHex<T>
  ) {
    if (!this._hexGrid.shouldDrawCartesian()) return;

    let point = hex.toPoint();
    let center = hex.center().add(point);
    let label = new Ex.Label(
      `${hex.cartesian().x},${hex.cartesian().y}`,
      center.x,
      center.y - hex.size / 2
    );
    label.textAlign = Ex.TextAlign.Center;
    label.fontSize = 16;
    label.draw(ctx, delta);
  }

  /**
   * Clears any stroke drawn on the map.
   * @param ctx
   */
  private clearStroke(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this._noHighlightColor.toRGBA();
    ctx.stroke();
    ctx.save();
  }

  /**
   * Clears any fill drawn on the map.
   * @param ctx
   */
  private clearFill(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this._noHighlightColor.toRGBA();
    ctx.fill();
    ctx.save();
  }

  /**
   * Fills the hex with color.
   * @param ctx
   * @param hex
   */
  private fillHex(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this._highlightColor.toRGBA();
    if (this._hexGrid.hexesToHighlight() == null) return;
    this._hexGrid.hexesToHighlight().forEach(hex => {
      let point = hex.toPoint();
      let corners = hex.corners().map(corner => corner.add(point));
      this.hexPath(ctx, corners);
      ctx.fill();
      ctx.save();
    });
  }

  /**
   * Handle on selection of a hex. Wraps HexGrid.onSelectHex();
   * @param x The x pixel coordinate.
   * @param y The y pixel coordinate.
   */
  public onSelectHex(x: number, y: number) {
    this._hexGrid.onSelectHex(x, y);
  }
}
