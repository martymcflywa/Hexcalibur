export class UnsupportedOrientationError extends TypeError {
  constructor(orientation: string) {
    super(`${orientation} is unsupported`);
  }
}
