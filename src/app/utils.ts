import { DataLayer } from 'app/shared/models/map.model';
import {
  MapStyles,
  MapOptions,
  Coordinate,
  Colors
} from './shared/models/map.model';
import { Destination, Export } from 'app/shared/models/itinerary.model';

let map;
declare const google;
const freeLayers = [];

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
  freeLayers.push(freeLayer);
  return freeLayer.setMap(map);
}

export function removeDataLayer() {
  freeLayers.forEach(freeLayer => {
    freeLayer.setMap(null);
  });
}

export function removeLocation(
  locations: Destination[],
  locationInput: Destination
): Destination[] {
  return locations.filter(savedLocation => {
    return savedLocation !== locationInput;
  });
}

export function createCountryName(itineraryDestination: Destination): string {
  const countryStringSplit = itineraryDestination.geoLocation.formatted_address.split(
    ','
  );
  return countryStringSplit[countryStringSplit.length - 1];
}

export function combineTransportOptions(
  details: [{ note: string; expense: number; transport: string }]
): string {
  const options = [];
  const transportOpts = details.map(detail => detail.transport);
  return accountForDuplicateTransportOptions(transportOpts);
}

export function accountForDuplicateTransportOptions(
  transportOpts: string[]
): string {
  const options = [];
  transportOpts.forEach(option => {
    if (options.indexOf(option) === -1) options.push(option);
  });
  return options.join().replace(/,/g, ' and ');
}

export function calculateDateRange(dates: string[]): number {
  const range = Math.round(
    Math.abs(
      new Date(dates[dates.length - 1]).getTime() -
        new Date(dates[dates.length - 2]).getTime()
    ) /
      (1000 * 3600 * 24)
  );
  return !range ? 0 : range;
}

export function updateDateRange(dates: string[], dayIndex: number): number {
  const range =
    Math.abs(
      new Date(dates[dayIndex]).getTime() -
        new Date(dates[dayIndex - 1]).getTime()
    ) /
    (1000 * 3600 * 24);
  return !range ? 0 : range;
}

export function aggregate(input: number[]): number {
  return input.reduce((a, b) => a + b, 0);
}

export function initialInfoWindow(
  marker: any,
  name: string,
  country: string,
  infowindow: any,
  map: any
) {
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(
      `<div><h3> Starting in ${name}, ${country} </h3></div>`
    );
    infowindow.open(map, this);
  });
}

export function supplementaryInfoWindow(
  marker: any,
  name: string,
  country: string,
  infowindow: any,
  map: any,
  days: number,
  date: string,
  transport: string,
  price: number
) {
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(
      `<div><h3> Location: ${name}, ${country} </h3></div><div><p><strong>Arriving on Day </strong> ${days} <strong> of the trip </strong></p></div> <div><p><strong>Arriving on </strong> ${date}  via  <i>${transport}</i> </p></div><div><p><strong>Price: </strong>  ${price} per person  </p></div> `
    );
    infowindow.open(map, this);
  });
}

export function buildAutocomplete(input): any {
  return new google.maps.places.Autocomplete(input);
}

export function addAutoCompleteListener(autocomplete, itineraryDestination) {
  autocomplete.addListener('place_changed', () => {
    itineraryDestination.geoLocation = autocomplete.getPlace();
  });
}
