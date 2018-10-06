export class Orientation {
  constructor(
    private readonly _f0: number,
    private readonly _f1: number,
    private readonly _f2: number,
    private readonly _f3: number,
    private readonly _b0: number,
    private readonly _b1: number,
    private readonly _b2: number,
    private readonly _b3: number,
    private readonly _startAngle: number
  ) {}

  public get f0(): number {
    return this._f0;
  }

  public get f1(): number {
    return this._f1;
  }

  public get f2(): number {
    return this._f2;
  }

  public get f3(): number {
    return this._f3;
  }

  public get b0(): number {
    return this._b0;
  }

  public get b1(): number {
    return this._b1;
  }

  public get b2(): number {
    return this._b2;
  }

  public get b3(): number {
    return this._b3;
  }

  public get startAngle(): number {
    return this._startAngle;
  }
}
