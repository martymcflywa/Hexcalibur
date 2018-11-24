import * as ex from "excalibur";
import * as honeycomb from "honeycomb-grid";
import { HexGrid } from "./hex-grid";

/**
 * Extends TileMap to include convenience functionality for hex tile maps.
 */
export class HexMap extends ex.TileMap {
  private readonly _hexGrid: HexGrid;
  private readonly _strokeColor = ex.Color.Black;

  /**
   *
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

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);
    if (this._hexGrid.shouldDrawGrid()) {
      this._hexGrid.grid().forEach(hex => {
        let point = hex.toPoint();
        let corners = hex.corners().map(corner => corner.add(point));
        this.drawHex(ctx, corners);
        this.drawCartesian(ctx, delta, hex);
      });
    }
  }

  /**
   *
   * @param ctx The canvas context.
   * @param corners The six corners of the hex to draw.
   */
  private drawHex(
    ctx: CanvasRenderingContext2D,
    corners: honeycomb.PointLike[]
  ) {
    this.forEachSlice(corners, (a, b) => {
      ex.Util.DrawUtil.line(ctx, this._strokeColor, a.x, a.y, b.x, b.y);
    });
    // draw line between last and first corners
    ex.Util.DrawUtil.line(
      ctx,
      this._strokeColor,
      corners[corners.length - 1].x,
      corners[corners.length - 1].y,
      corners[0].x,
      corners[0].y
    );
  }

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

  private forEachSlice<T>(array: T[], callback: (prev: T, current: T) => any) {
    array.reduce((prev, current) => {
      callback(prev, current);
      return current;
    });
  }
}
