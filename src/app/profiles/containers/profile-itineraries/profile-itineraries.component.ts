import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TabsetComponent } from 'ngx-bootstrap';
import { Country } from 'app/shared/country.model';
import { UserItinerary, User } from 'app/shared/user.model';
import { CountryService } from 'app/shared/services/country.service';
import { setMap, createDataLayers, initializeDataLayer } from 'app/utils';
import { Colors, DataLayer } from 'app/shared/map.model';

declare var google: any;

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

  marker: any;
  user: User;
  userItineraries: UserItinerary[];
  dataLayer: DataLayer;
  map: any;
  geocoder: any;
  flightPathData: any;

  selectedNationalityId1: string;
  selectedNationalityId2: string;
  countryName1: string;
  countryName2: string;

  differenceBetweenDates: number;
  totalPrice: number;

  countries: Country[];

  locations: any[] = [];
  itineraryDays: any[] = [];
  dates: any[] = [];
  destinationCoordinates = [];
  itineraryPath: any[] = [];
  mapMarkers: any[] = [];
  allItineraries: any[] = [];

  layers: any[] = [];
  coordinates: any[] = [];

  colors = {
    visaFree: ['red', 'blue'],
    visaOnArrival: ['yellow', 'green']
  };

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.initiateMap();
    this.getUserItineraries();
  }

  initiateMap() {
    this.map = setMap();
  }

  getUserItineraries() {
    this.userService.getUser(this.user._id).subscribe(user => {
      this.userItineraries = user.itineraries;
      console.log('userItineraries', this.userItineraries);
      const selectedCountries = this.userItineraries[0].nationalities.length
        ? this.userItineraries[0].nationalities
        : ['United States', 'Taiwan'];
      let index = 0;
      this.showCountries(selectedCountries, this.colors, index);
    });
  }

  showCountries(selectedCountries, colors, index) {
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
    this.countryService
      .getCountry(selectedCountries[index])
      .subscribe(nation => {
        this.setDataLayers(nation, index, colors, selectedCountries);
      });
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
