/**
 * Prototype for custom hex.
 */
export class HexBase {
  public size: number;
  public orientation: "flat" | "pointy";
  public isSelected: boolean;

  constructor(
    size: number,
    orientation: "flat" | "pointy",
    isSelected: boolean
  ) {
    this.size = size;
    this.orientation = orientation;
    this.isSelected = isSelected;
  }
}
