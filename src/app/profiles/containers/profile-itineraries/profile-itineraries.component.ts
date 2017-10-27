import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
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
import { FlightPathService } from 'app/shared/services/flightPath.service';
import { FlightPathBuilder } from 'app/builders/flightPath.builder';

declare const google: any;

@Component({
  selector: 'app-profile-itineraries',
  templateUrl: './profile-itineraries.component.html',
  styleUrls: ['./profile-itineraries.component.css']
})
export class ProfileItinerariesComponent
  implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private countryService: CountryService,
    private flightPathService: FlightPathService
  ) {}

  user: User;
  map: any;
  countries: Country[];
  userItineraries: UserItinerary[];

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
      this.userItineraries = user.itineraries;
      const selectedCountries = this.countryService.identifyCountryId(
        this.userItineraries,
        this.countries
      );
      const itineraries = user.itineraries[3].placesAndDates;

      // itineraries.forEach(place => {
      //   const userData = FlightPathBuilder.buildFlightPath(place, true);
      //   this.flightPathService.setGeocodeMarkers(userData, this.map);
      // });
      // this.countryService.createDataLayersForDisplay(selectedCountries);
    });
  }
}
