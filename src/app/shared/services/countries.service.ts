import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Colors, DataLayer } from 'app/shared/map.model';
import {
  initializeDataLayer,
  createDataLayers,
  buildDataLayer,
  COLORS
} from 'app/utils';

@Injectable()
export class CountryService {
  // BASE_URL: string = 'https://sojourney.herokuapp.com';
  BASE_URL: string = 'http://localhost:3000';

  constructor(private http: Http) {}

  countries: any;
  countryName1: string;
  countryName2: string;
  dataLayer: DataLayer;
  colors: Colors = COLORS;

  countries$: Observable<Response> = this.http
    .get(`${this.BASE_URL}/api/countries`)
    .map(res => res.json());

  identifyCountryId(userItineraries, countries): string[] {
    const nationalities = userItineraries[3].nationalities[0]
      ? userItineraries[3].nationalities
      : ['Taiwan', 'United States'];

    return nationalities.map(nationality => {
      const country = countries.find(country => country.name === nationality);
      return country._id;
    });
  }

  createDataLayersForDisplay(selectedCountries: string[]) {
    this.countries$.subscribe(countries => {
      this.countries = countries;
      let index = 0;
      this.showCountries(selectedCountries, this.colors, index);
    });
  }

  showCountries(selectedCountries: string[], colors: Colors, index: number) {
    if (index === 2) {
      return;
    }
    this.setLayersForSelectedCountry(selectedCountries, index, colors);
  }

  setLayersForSelectedCountry(
    selectedCountries: string[],
    index: number,
    colors: Colors
  ) {
    const nation = this.countries.find(
      country => country._id === selectedCountries[index]
    );
    this.setDataLayers(nation, index, colors, selectedCountries);
  }

  setDataLayers(
    nation: any,
    index: number,
    colors: Colors,
    countries: string[]
  ) {
    index === 0 ? (this.countryName1 = nation) : (this.countryName2 = nation);
    this.dataLayer = initializeDataLayer(nation, index, colors, countries);
    this.loadDataLayers(this.dataLayer);
  }

  loadDataLayers(dataLayer: DataLayer) {
    const editedLayer = buildDataLayer(dataLayer);
    this.buildDataLayers(editedLayer);
    dataLayer.counter++;
    this.checkCountryIndexValues(dataLayer);
  }

  checkCountryIndexValues(layer: DataLayer) {
    const visaKind = layer.visaKindArray[layer.visaKindIndex];
    if (layer.counter === layer.nation[visaKind].length) {
      layer.counter = 0;
      if (visaKind === 'visaOnArrival') {
        layer.index++;
        this.showCountries(layer.countries, layer.colors, layer.index);
      } else {
        layer.visaKindIndex++;
        this.loadDataLayers(layer);
      }
    } else {
      this.loadDataLayers(layer);
    }
  }

  buildDataLayers(event: {
    visaKind: string;
    nation: any;
    index: number;
    colors: any;
    counter: number;
  }) {
    const layer = event.nation ? createDataLayers(event) : '';
  }
}
