import { MapStyles, MapOptions } from '../map.model';

let map;
declare const google;

export function setMap() {
  const myOptions = new MapOptions();
  map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
  const styles = new MapStyles();
  map.setOptions({ styles: styles });

  return map;
}

export function createDataLayers(event: {
  visaKind: string;
  nation: any;
  index: number;
  colors: any;
  counter: number;
}) {
  const visaKind = event.visaKind;
  const nation = event.nation;
  const index = event.index;
  const colors = event.colors;
  const counter = event.counter;
  const freeLayer = new google.maps.Data();
  freeLayer.loadGeoJson(
    'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' +
      nation[visaKind][counter] +
      '.geo.json'
  );
  freeLayer.setStyle({
    fillColor: colors[visaKind][index],
    fillOpacity: 0.5,
    title: nation[visaKind][counter]
  });
  return freeLayer.setMap(map);
}




