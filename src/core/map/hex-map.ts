import * as ex from "excalibur";
import * as honeycomb from "honeycomb-grid";
import * as std from "tstl";
import { HexGrid } from "./hex-grid";

/**
 * Extends TileMap to include convenience functionality for hex tile maps.
 */
export class HexMap extends ex.TileMap {
  private readonly _hexGrid: HexGrid;
  private readonly _strokeColor = ex.Color.Black;
  private readonly _strokeWidth = 0.5;
  private readonly _highlightColor = new ex.Color(50, 50, 50, 0.5);
  private readonly _noHighlightColor = new ex.Color(0, 0, 0, 0);

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
    this._hexGrid.grid().forEach(hex => {
      let point = hex.toPoint();
      let corners = hex.corners().map(corner => corner.add(point));
      this.hexPath(ctx, corners);
      this.drawHex(ctx);
      this.drawCartesian(ctx, delta, hex);
      this.fillHighlight(ctx, hex);
    });
  }

  /**
   * Generate the path for a hex.
   * @param ctx
   * @param corners
   */
  private hexPath(
    ctx: CanvasRenderingContext2D,
    corners: honeycomb.PointLike[]
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
    hex: honeycomb.BaseHex<T>
  ) {
    if (!this._hexGrid.shouldDrawCartesian()) return;

    let point = hex.toPoint();
    let center = hex.center().add(point);
    let label = new ex.Label(
      `${hex.cartesian().x},${hex.cartesian().y}`,
      center.x,
      center.y - hex.size / 2
    );
    label.textAlign = ex.TextAlign.Center;
    label.fontSize = 16;
    label.draw(ctx, delta);
  }

  /**
   * Fills/unfills highlights for selected/unselected hex.
   * @param ctx
   * @param hex
   */
  private fillHighlight(
    ctx: CanvasRenderingContext2D,
    hex: honeycomb.BaseHex<{}>
  ) {
    const hexProperty = this._hexGrid.getProperties(hex);
    const fillStyle = hexProperty.isSelected
      ? this._highlightColor
      : this._noHighlightColor;
    ctx.fillStyle = fillStyle.toRGBA();
    ctx.fill();
    ctx.save();
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
