import * as Log from "typescript-logging";

Log.CategoryServiceFactory.setDefaultConfiguration(
  new Log.CategoryConfiguration(Log.LogLevel.Info)
);

export const HexGrid = new Log.Category("HexGrid");
