import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../shared/services/session.service';
import { UserService } from '../shared/services/user.service';
import { CountryService } from '../shared/services/country.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TabsetComponent } from 'ngx-bootstrap';
import { setMap, createDataLayers } from 'app/shared/services/map.service';

declare var google: any;

@Component({
  selector: 'app-profile-itineraries',
  templateUrl: './profile-itineraries.component.html',
  styleUrls: ['./profile-itineraries.component.css']
})
export class ProfileItinerariesComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;

  user: any;
  userItineraries: any;
  map: any;
  nation;

  constructor(
    private router: Router,
    private session: SessionService,
    private userService: UserService,
    private countryService: CountryService
  ) {}

  selectedNationalityId1;
  selectedNationalityId2;
  countries;
  countries2;
  countryName1;
  countryName2;
  address: any;
  newAddress: any;
  geocoder;
  flightPathData;

  place: any;
  differenceBetweenDates: number;
  totalItinerary;
  totalPrice: number;
  deleteLocation;
  marker;
  locations: any[] = [];
  itineraryDays: any[] = [];
  dates = [];
  destinationCoordinates = [];
  itineraryPath: any[] = [];
  mapMarkers: any[] = [];
  allItineraries: any[] = [];
  colorLayers: any[] = [];
  layers: any[] = [];
  coordinates: any[] = [];

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));

    this.userService.getTest(user._id).subscribe(user => {
      this.userItineraries = user;
      console.log('user itinerary', this.userItineraries);
      const date = [];

      this.userItineraries.arr.forEach((itinerary, index) => {
        this.selectedNationalityId1 = !itinerary.nationality1
          ? ''
          : itinerary.nationality1;
        this.selectedNationalityId2 = !itinerary.nationality3
          ? ''
          : itinerary.nationality2;

        this.locations.push(itinerary.placesAndDates);

        itinerary.placesAndDates.forEach(place => {
          this.coordinates.push(place.geometry.location);
          date.push(place.date);
        });

        this.destinationCoordinates.push(this.coordinates);
        this.dates.push(date);

        this.allItineraries.push(itinerary);
        console.log('allItineraries', this.allItineraries)
        console.log('destinationCoordinates', this.destinationCoordinates)
        console.log('dates', this.dates);

        this.initiateMap();
        // this.loadCountries(this.selectedNationalityId1, this.selectedNationalityId2)
        // this.loadPolylines(this.coordinates);
        // this.differenceInDays();
      });
    });

    this.countryService.getList().subscribe(countries => {
      this.countries = countries;
      this.countries2 = countries;
    });
    this.countryName1 = !this.countryName1 ? '' : this.countryName1;
    this.countryName2 = !this.countryName2 ? '' : this.countryName2;

    this.totalPrice = 0;
  }

  initiateMap() {
    this.map = setMap();
  }

  showCountries(selectedCountries, colors, index) {
    if (index === 2) {
      return;
    }
    this.setDataLayersForSelectedCountry(selectedCountries, index, colors);
  }

  setDataLayersForSelectedCountry(selectedCountries, index, colors) {
    this.countryService.getCountry(selectedCountries[index]).subscribe(nation => {
      this.setDataLayers(nation, index, colors, selectedCountries);
    });
  }

  setDataLayers(nation, index, colors, countries) {
    const visaKindArray = ['visaFree', 'visaOnArrival'];
    let visaKindIndex = 0;
    let counter = 0;
    index === 0 ? (this.countryName1 = nation) : (this.countryName2 = nation);

    this.loadDataLayers(
      visaKindArray,
      visaKindIndex,
      nation,
      index,
      colors,
      counter,
      countries
    );
  }

  loadDataLayers(
    visaKindArray: any[],
    visaKindIndex: number,
    nation: any,
    index: number,
    colors: any,
    counter: number,
    countries: any
  ) {
    const visaKind = visaKindArray[visaKindIndex];
    let dataLayerData = {
      visaKind,
      nation,
      index,
      colors,
      counter
    };
    const layer = createDataLayers(dataLayerData);
    counter++;
    if (counter === nation[visaKind].length) {
      counter = 0;
      if (visaKind === 'visaOnArrival') {
        index++;
        this.showCountries(countries, colors, index);
      } else {
        visaKindIndex++;
        this.loadDataLayers(
          visaKindArray,
          visaKindIndex,
          nation,
          index,
          colors,
          counter,
          countries
        );
      }
    } else {
      this.loadDataLayers(
        visaKindArray,
        visaKindIndex,
        nation,
        index,
        colors,
        counter,
        countries
      );
    }
  }

  selectTab(tab_id: number) {
    this.staticTabs.tabs[tab_id].active = true;
  }
}
