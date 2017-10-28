declare const google;

export class MapStyles {
  constructor(
    private styles: any[] = [
      {
        featureType: 'landscape',
        stylers: [{ hue: '#fff' }, { saturation: 100 }]
      },
      {
        featureType: 'road',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative.locality',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'administrative.neighborhood',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative.province',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'landscape.man_made',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape.natural',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }]
      }
    ]
  ) {}
}

export class MapOptions {
  constructor(
    private options: any = {
      zoom: 2,
      center: new google.maps.LatLng(10, 0),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
  ) {}
}

export interface DataLayer {
  visaKindArray: any[];
  visaKindIndex: number;
  nation: any;
  index: number;
  colors: any;
  counter: number;
  countries: any;
}

export interface GeoJsonLayer {
  visaKind: string;
  nation: any;
  index: number;
  colors: Colors;
  counter: number;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Colors {
  visaFree: string[],
  visaOnArrival: string[]
}
