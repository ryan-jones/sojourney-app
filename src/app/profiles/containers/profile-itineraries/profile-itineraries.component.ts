import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TabsetComponent } from 'ngx-bootstrap';
import { Country } from 'app/shared/country.model';
import { UserItinerary, User } from 'app/shared/user.model';
import { CountryService } from 'app/shared/services/countries.service';
import {
  setMap,
  createDataLayers,
  initializeDataLayer,
  COLORS,
  buildDataLayer
} from 'app/utils';
import { DataLayer, Coordinate, Colors } from 'app/shared/map.model';

declare const google: any;

@Component({
  selector: 'app-profile-itineraries',
  templateUrl: './profile-itineraries.component.html',
  styleUrls: ['./profile-itineraries.component.css']
})
export class ProfileItinerariesComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;

  constructor(
    private userService: UserService,
    private countryService: CountryService
  ) {}

  user: User;
  colors: Colors = COLORS;
  dataLayer: DataLayer;

  //google objects
  marker: any;
  map: any;
  geocoder: any;

  selectedNationalityId1: string;
  selectedNationalityId2: string;
  countryName1: string;
  countryName2: string;

  differenceBetweenDates: number;
  totalPrice: number;

  countries: any;
  userItineraries: UserItinerary[];
  coordinates: Coordinate[] = [];
  destinationCoordinates: Coordinate[] = [];

  locations: any[] = [];
  itineraryDays: any[] = [];
  dates: any[] = [];
  itineraryPath: any[] = [];
  mapMarkers: any[] = [];
  allItineraries: any[] = [];
  flightPathData: any[] = [];
  layers: any[] = [];

  ngOnInit() {
    this.countryService.countries$.subscribe(countries => {
      this.countries = countries;
      this.initiateMap();
      this.getUserItineraries();
    });
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  initiateMap() {
    this.map = setMap();
  }

  getUserItineraries() {
    this.userService.getUser(this.user._id).subscribe(user => {
      this.userItineraries = user.itineraries;
      const selectedCountries = this.countryService.identifyCountryId(
        this.userItineraries,
        this.countries
      );
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
    const editedLayer = buildDataLayer(dataLayer)
    this.buildDataLayers(editedLayer)
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
    const layer = createDataLayers(event);
    this.layers.push(layer);
  }

  selectTab(tab_id: number) {
    this.staticTabs.tabs[tab_id].active = true;
  }
}
