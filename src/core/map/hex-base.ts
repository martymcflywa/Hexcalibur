/**
 * Prototype for custom hex.
 */
export class HexBase {
  public size: number;
  public orientation: "flat" | "pointy";
  public isHighlighted: boolean;

  constructor(
    size: number,
    orientation: "flat" | "pointy",
    isHighlighted: boolean
  ) {
    this.size = size;
    this.orientation = orientation;
    this.isHighlighted = isHighlighted;
  }
}
