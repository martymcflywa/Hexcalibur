export class Hex {
  constructor(private _q: number, private _r: number, private _s: number) {
    if (Math.round(_q + _r + _s) !== 0)
      throw new Error("Sum of q, r and s must be zero");
  }

  public get q(): number {
    return this._q;
  }

  public get r(): number {
    return this._r;
  }

  public get s(): number {
    return this._s;
  }

  private static readonly directions: Hex[] = [
    new Hex(1, 0, -1),
    new Hex(1, -1, 0),
    new Hex(0, -1, 1),
    new Hex(-1, 0, 1),
    new Hex(-1, 1, 0),
    new Hex(0, 1, -1)
  ];

  private static readonly diagonals: Hex[] = [
    new Hex(2, -1, -1),
    new Hex(1, -2, 1),
    new Hex(-1, -1, 2),
    new Hex(-2, 1, 1),
    new Hex(-1, 2, -1),
    new Hex(1, 1, -2)
  ];

  public add(hex: Hex): Hex {
    return new Hex(this.q + hex.q, this.r + hex.r, this.s + hex.s);
  }

  public subtract(hex: Hex): Hex {
    return new Hex(this.q - hex.q, this.r - hex.r, this.s - hex.s);
  }

  public multiply(k: number): Hex {
    return new Hex(this.q * k, this.r * k, this.s * k);
  }

  public rotateLeft(): Hex {
    return new Hex(-this.s, -this.q, -this.r);
  }

  public rotateRight(): Hex {
    return new Hex(-this.r, -this.s, -this.q);
  }

  private length(): number {
    return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
  }

  public distance(hex: Hex): number {
    return this.subtract(hex).length();
  }

  public neighbor(direction: number): Hex {
    return this.add(Hex.directions[direction]);
  }

  public diagonalNeighbor(direction: number): Hex {
    return this.add(Hex.diagonals[direction]);
  }

  public round(): Hex {
    let qi = Math.round(this.q);
    let ri = Math.round(this.r);
    let si = Math.round(this.s);

    let qd = Math.abs(qi - this.q);
    let rd = Math.abs(ri - this.r);
    let sd = Math.abs(si - this.s);

    if (qd > rd && qd > sd) qi = -ri - si;
    else if (rd > sd) ri = -qi - si;
    else si = -qi - ri;

    return new Hex(qi, ri, si);
  }

  public linterpolate(hex: Hex, t: number): Hex {
    return new Hex(
      this.q * (1 - t) + hex.q * t,
      this.r * (1 - t) + hex.r * t,
      this.s * (1 - t) + hex.s * t
    );
  }

  public drawLine(hex: Hex): Hex[] {
    const n = this.distance(hex);
    let aNudge = new Hex(
      this.q + 0.000001,
      this.r + 0.000001,
      this.s - 0.000002
    );
    let bNudge = new Hex(hex.q + 0.000001, hex.r + 0.000001, hex.s - 0.000002);
    let results = [] as Hex[];
    let step = 1.0 / Math.max(n, 1);
    for (let i = 0; i <= n; i++)
      results.push(aNudge.linterpolate(bNudge, step * i).round());
    return results;
  }
}
