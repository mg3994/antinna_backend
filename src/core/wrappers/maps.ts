export interface IMapsWrapper {
  newDirectionFinder(): GoogleAppsScript.Maps.DirectionFinder;
  newGeocoder(): GoogleAppsScript.Maps.Geocoder;
}

export class AppsScriptMaps implements IMapsWrapper {
  public newDirectionFinder(): GoogleAppsScript.Maps.DirectionFinder {
    return Maps.newDirectionFinder();
  }

  public newGeocoder(): GoogleAppsScript.Maps.Geocoder {
    return Maps.newGeocoder();
  }
}
