import * as Ex from "excalibur";
import { HexGrid } from "./core/map/hex-grid";
import { HexLevel } from "./scenes/hex-level";
import { HexMap } from "./core/map/hex-map";
import { Resources } from "./resources";

class Game extends Ex.Engine {
  constructor() {
    super({ width: 800, height: 600, displayMode: Ex.DisplayMode.FullScreen });
  }

  public start(loader: Ex.Loader) {
    return super.start(loader);
  }
}

const hexGrid = new HexGrid(50, "flat", 10, 10);
const hexMap = new HexMap(hexGrid);
const hexLevel = new HexLevel();
const game = new Game();

hexLevel.add(hexMap);
game.add("hexLevel", hexLevel);

let loader = new Ex.Loader();
for (let key in Resources) {
  loader.addResource(Resources[key]);
}

game.start(loader).then(() => {
  game.goToScene("hexLevel");
});

game.input.pointers.primary.on("down", (e: Ex.Input.PointerEvent) => {
  if (!game.scenes["hexLevel"].isCurrentScene()) return;
  hexMap.onSelectHex(e.pos.x, e.pos.y);
});
