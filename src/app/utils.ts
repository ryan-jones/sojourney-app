import { DataLayer } from 'app/shared/map.model';
import { MapStyles, MapOptions, Coordinate, Colors } from './shared/map.model';
import { Destination } from 'app/shared/itinerary.model';

let map;
declare const google;

export const COLORS = {
  visaFree: ['red', 'blue'],
  visaOnArrival: ['yellow', 'green']
};

export interface GeoJsonLayer {
  visaKind: string;
  nation: any;
  index: number;
  colors: Colors;
  counter: number;
}

export function setMap(): any {
  const myOptions = new MapOptions();
  map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
  const styles = new MapStyles();
  map.setOptions({ styles: styles });
  return map;
}

export function setPolyline(destinationCoordinates: Coordinate[]): any {
  return new google.maps.Polyline({
    path: destinationCoordinates,
    geodesic: true,
    strokeColor: 'yellow',
    strokeOpacity: 1.0,
    strokeWeight: 4
  });
}

export function setNewMarker(
  position,
  map,
  name,
  country,
  date,
  days,
  transport,
  price
): any {
  return new google.maps.Marker({
    position,
    map,
    name,
    country,
    date,
    days,
    transport,
    price
  });
}

export function initializeDataLayer(
  nation: any,
  index: number,
  colors = COLORS,
  countries: string[]
): DataLayer {
  const visaKindArray = ['visaFree', 'visaOnArrival'];
  let visaKindIndex = 0;
  let counter = 0;

  return {
    visaKindArray,
    visaKindIndex,
    nation,
    index,
    colors,
    counter,
    countries
  };
}

export function buildDataLayer(layer): any {
  const newLayer = Object.assign({}, layer);
  newLayer.visaKind = layer.visaKindArray[layer.visaKindIndex];
  delete newLayer.visaKindArray;
  delete newLayer.visaKindIndex;
  return newLayer;
}

export function createDataLayers(e: GeoJsonLayer): any {
  const freeLayer = new google.maps.Data();
  freeLayer.loadGeoJson(
    'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' +
      e.nation[e.visaKind][e.counter] +
      '.geo.json'
  );
  freeLayer.setStyle({
    fillColor: e.colors[e.visaKind][e.index],
    fillOpacity: 0.5,
    title: e.nation[e.visaKind][e.counter]
  });
  return freeLayer.setMap(map);
}

export function newPolyline(destinationCoordinates: Coordinate[]): any {
  return new google.maps.Polyline({
    path: destinationCoordinates,
    geodesic: true,
    strokeColor: 'yellow',
    strokeOpacity: 1.0,
    strokeWeight: 4
  });
}

export function newMarker(point: Coordinate, map: any): any {
  return new google.maps.Marker({
    map,
    position: point
  });
}

export function removeLocation(
  locations: Destination[],
  locationInput: Destination
): any[] {
  return locations.filter(savedLocation => {
    return savedLocation !== locationInput;
  });
}
