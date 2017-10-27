import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../shared/services/countries.service';
import { UserService } from '../../shared/services/user.service';
import { User } from 'app/shared/user.model';
import { Country } from 'app/shared/country.model';
import { MapStyles, MapOptions, Coordinate } from 'app/shared/map.model';
import { Itinerary, Destination } from 'app/shared/itinerary.model';
import {
  setMap,
  createDataLayers,
  removeLocation,
  initialInfoWindow,
  supplementaryInfoWindow
} from 'app/utils';
import { Observable } from 'rxjs/Observable';
import { FlightPathService } from 'app/shared/services/flightPath.service';

declare const google: any;

@Component({
  selector: 'my-home',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class ItineraryOverViewComponent implements OnInit {
  //google properties
  private marker: any;
  private map: any;
  private locations: any[] = [];
  private destinationCoordinates: Coordinate[] = [];

  //Defined properties
  private user: User;
  private countries$: Observable<any>;
  private newItinerary: Itinerary;

  private selectedNationalityId1: string;
  private selectedNationalityId2: string;

  constructor(
    private country: CountryService,
    private userService: UserService,
    private flightPathService: FlightPathService
  ) {
    this.countries$ = this.country.countries$;
  }

  ngOnInit() {
    this.initiateMap();
    this.authorizedUser();
  }

  ngOnDestroy(){
    this.flightPathService.clearMapValues();
  }

  authorizedUser() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    this.user = currentUser ? currentUser : new User();
  }

  initiateMap() {
    this.map = setMap();
  }

  geocodeMarker(data) {
    this.flightPathService.setGeocodeMarkers(data, this.map);
  }

  addItinerary(event) {
    this.newItinerary = Object.assign({}, event);
    this.buildItinerary(this.newItinerary);
    this.updateItinerary(this.newItinerary);
  }

  buildItinerary(newItinerary) {
    newItinerary.id = this.user._id;
    newItinerary.nationalities = [
      this.selectedNationalityId1,
      this.selectedNationalityId2
    ];
  }

  updateItinerary(newItinerary) {
    this.userService.editItinerary(newItinerary).subscribe(user => {
      this.user = user;
      alert('Itinerary saved! View in your user profile.');
    });
  }
}
