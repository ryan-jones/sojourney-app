import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Country } from 'app/shared/models/country.model';
import { UserItinerary, User } from 'app/shared/models/user.model';
import { CountryLayersService } from 'app/shared/services/country-layers.service';
import {
  setMap,
  createDataLayers,
  initializeDataLayer,
  COLORS,
  buildDataLayer,
  removeDataLayer
} from 'app/utils';
import { DataLayer, Coordinate, Colors } from 'app/shared/models/map.model';
import { FlightPathService } from 'app/shared/services/flightPath.service';
import { FlightPathBuilder } from 'app/builders/flightPath.builder';
import { Destination } from 'app/shared/models/itinerary.model';

declare const google: any;

@Component({
  selector: 'app-profile-itineraries',
  templateUrl: './profile-itineraries.component.html',
  styleUrls: ['./profile-itineraries.component.css']
})
export class ProfileItinerariesComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private countryService: CountryLayersService,
    private flightPathService: FlightPathService
  ) {}

  user: User;
  map: any;
  countries: Country[];
  userItineraries: UserItinerary[];
  tabActive: string;
  activeItinerary: any;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.initiateMap();
    this.countryService.countries$.subscribe(countries => {
      this.countries = countries;
      this.getUserItineraries();
    });
  }

  ngOnDestroy() {
    this.flightPathService.clearMapValues();
  }

  initiateMap() {
    this.map = setMap();
  }

  getUserItineraries() {
    this.userService.getUser(this.user._id).subscribe(user => {
      this.setInitialValues(user);
      const selectedCountries = this.countryService.identifyCountryId(this.userItineraries, this.countries, 0);
      const itineraries = user.itineraries[0].placesAndDates;
      this.setFlightPathAndLayers(itineraries, selectedCountries);
    });
  }

  setInitialValues(user: User) {
    this.userItineraries = user.itineraries;
    this.activeItinerary = this.userItineraries[0];
  }

  setActiveTab(itinerary: UserItinerary) {
    this.removeFlightPathAndLayers();
    this.tabActiveEquals(itinerary);
    this.activeItineraryEquals(itinerary);
    const index = this.indexEquals(itinerary);
    const itineraryDestinations = this.itineraryDestinationsEquals(index);
    const selectedCountries = this.countryService.identifyCountryId(
      this.userItineraries,
      this.countries,
      index
    );
    this.setFlightPathAndLayers(itineraryDestinations, selectedCountries);
  }

  setFlightPathAndLayers(
    itineraries: Destination[],
    selectedCountries: string[]
  ) {
    itineraries.forEach(place => {
      const userData = FlightPathBuilder.buildFlightPath(place, true);
      this.flightPathService.setGeocodeMarkers(userData, this.map);
    });
    this.countryService.createDataLayersForDisplay(selectedCountries);
  }

  removeFlightPathAndLayers() {
    removeDataLayer();
    this.flightPathService.clearMapValues();
  }

  tabActiveEquals(itinerary: UserItinerary) {
    this.tabActive = itinerary.name;
  }

  activeItineraryEquals(itinerary: UserItinerary) {
    this.activeItinerary = itinerary;
  }

  indexEquals(itinerary: UserItinerary): number {
    return this.userItineraries.indexOf(itinerary);
  }

  itineraryDestinationsEquals(index: number): Destination[] {
    return this.userItineraries[index].placesAndDates;
  }
}
