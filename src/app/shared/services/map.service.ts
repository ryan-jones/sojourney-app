import { MapStyles, MapOptions } from '../map.model';


let map;
declare const google;

export function setMap() {
  const myOptions = new MapOptions();
  map = new google.maps.Map(
    document.getElementById('map-canvas'),
    myOptions
  );
  const styles = new MapStyles();
  map.setOptions({ styles: styles });

  return map
}
