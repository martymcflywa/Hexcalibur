import { Orientation } from "./orientation";
import { Point } from "./point";
import { Hex } from "./hex";

export class Layout {
  constructor(
    private readonly _orientation: Orientation,
    private readonly _size: Point,
    private readonly _origin: Point
  ) {}

  public get orientation(): Orientation {
    return this._orientation;
  }

  public get size(): Point {
    return this._size;
  }

  public get origin(): Point {
    return this._origin;
  }

  public static readonly pointy = new Orientation(
    Math.sqrt(3.0),
    Math.sqrt(3.0) / 2.0,
    0.0,
    3.0 / 2.0,
    Math.sqrt(3.0) / 3.0,
    -1.0 / 3.0,
    0.0,
    2.0 / 3.0,
    0.5
  );

  public static readonly flat = new Orientation(
    3.0 / 2.0,
    0.0,
    Math.sqrt(3.0) / 2.0,
    Math.sqrt(3.0),
    2.0 / 3.0,
    0.0,
    -1.0 / 3.0,
    Math.sqrt(3.0) / 3.0,
    0.0
  );

  public hexToPixel(hex: Hex): Point {
    let o = this.orientation;
    let x = (o.f0 * hex.q + o.f1 * hex.r) * this.size.x;
    let y = (o.f2 * hex.q + o.f3 * hex.r) * this.size.y;
    return new Point(x + this.origin.x, y + this.origin.y);
  }

  public pixelToHex(point: Point): Hex {
    let o = this.orientation;
    let p = new Point(
      (point.x - this.origin.x) / this.size.x,
      (point.y - this.origin.y) / this.size.y
    );
    let q = o.b0 * p.x + o.b1 * p.y;
    let r = o.b2 * p.x + o.b3 * p.y;
    return new Hex(q, r, -q - r);
  }

  public cornerOffset(corner: number): Point {
    let o = this.orientation;
    let angle = (2.0 * Math.PI * (o.startAngle - corner)) / 6;
    return new Point(
      this.size.x * Math.cos(angle),
      this.size.y * Math.sin(angle)
    );
  }

  public polygonCorners(hex: Hex): Point[] {
    let corners = [] as Point[];
    let center = this.hexToPixel(hex);
    for (let i = 0; i < 6; i++) {
      let offset = this.cornerOffset(i);
      corners.push(new Point(center.x + offset.x, center.y + offset.y));
    }
    return corners;
  }
}
