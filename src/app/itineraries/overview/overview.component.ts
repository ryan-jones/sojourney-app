import {
  Component,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CountryLayersService } from '../../shared/services/country-layers.service';
import { UserService } from '../../shared/services/user.service';
import { User } from 'app/shared/models/user.model';
import { Country } from 'app/shared/models/country.model';
import { MapStyles, MapOptions, Coordinate } from 'app/shared/models/map.model';
import { Itinerary, Destination } from 'app/shared/models/itinerary.model';
import {
  setMap,
  createDataLayers,
  removeLocation,
  initialInfoWindow,
  supplementaryInfoWindow
} from 'app/utils';
import { Observable } from 'rxjs/Observable';
import { FlightPathService } from 'app/shared/services/flightPath.service';


@Component({
  selector: 'my-home',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class ItineraryOverViewComponent implements AfterViewInit, OnDestroy {

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
    private countryService: CountryLayersService,
    private userService: UserService,
    private flightPathService: FlightPathService
  ) {
    this.countries$ = this.countryService.countries$;
  }

  ngAfterViewInit(){
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
