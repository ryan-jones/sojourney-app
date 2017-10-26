import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../shared/services/countries.service';
import { SessionService } from '../../shared/services/session.service';
import { UserService } from '../../shared/services/user.service';
import { User } from 'app/shared/user.model';
import { Country } from 'app/shared/country.model';
import { MapStyles, MapOptions, Coordinate } from 'app/shared/map.model';
import { Itinerary, Destination } from 'app/shared/itinerary.model';
import {
  setMap,
  createDataLayers,
  setPolyline,
  newPolyline,
  newMarker,
  removeLocation,
  setNewMarker
} from 'app/utils';
import { Observable } from 'rxjs/Observable';

declare const google: any;

@Component({
  selector: 'my-home',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [CountryService, SessionService, UserService]
})
export class ItineraryOverViewComponent implements OnInit {
  //google properties
  private marker: any;
  private map: any;
  private flightPathData: any;
  private layers: any[] = [];
  private mapMarkers: any[] = [];
  private itineraryPath: any[] = [];
  private locations: any[] = [];
  private destinationCoordinates: Coordinate[] = [];

  //Defined properties
  private user: User;
  private countries: Country[];
  private countries$: Observable<any>
  private newItinerary: Itinerary;

  private selectedNationalityId1: string;
  private selectedNationalityId2: string;

  constructor(
    private country: CountryService,
    private session: SessionService,
    private userService: UserService
  ) {
    this.countries$ = this.country.countries$
  }

  ngOnInit() {
    this.initiateMap();
    this.authorizeUser();
  }

  authorizeUser() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    this.user = currentUser ? currentUser : new User();
  }


  //**************** creates initial map *********
  initiateMap() {
    this.map = setMap();
  }

  loadDataLayers(event: {
    visaKind: string;
    nation: any;
    index: number;
    colors: any;
    counter: number;
  }) {
    const layer = createDataLayers(event);
    this.layers.push(layer);
  }

  geocodeMarker(data) {
    const geocoder = new google.maps.Geocoder();
    this.buildflightPath(geocoder, data);
  }

  buildflightPath(geocoder: any, data) {
    const that = this;
    const name = data.name;
    const date = data.date;
    const days = data.days;
    const transport = data.transport;
    const country = data.country;
    const price = data.price;
    const point = data.point;
    geocoder.geocode({ address: data.address }, function(results, status) {
      if (status === 'OK') {
        const infowindow = new google.maps.InfoWindow();
        that.createflightPath(point);
        that.setMarker(
          point,
          name,
          country,
          date,
          days,
          transport,
          price,
          infowindow
        );
      }
    });
  }

  createflightPath(point: Coordinate) {
    this.destinationCoordinates.push(point);
    this.flightPathData = setPolyline(this.destinationCoordinates);
    this.itineraryPath.push(this.flightPathData);
    this.flightPathData.setMap(this.map);
  }

  setMarker(
    point: any,
    name: string,
    country: string,
    date: string,
    days: number,
    transport: string,
    price: number,
    infowindow: any
  ) {
    this.marker = setNewMarker(point, this.map, name, country, date, days, transport, price)
    this.marker.setIcon(
      'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    );
    this.mapMarkers.push(this.marker);
    this.setWindowContent(
      name,
      country,
      infowindow,
      date,
      days,
      transport,
      price
    );
  }

  setWindowContent(
    name: string,
    country: string,
    infowindow: any,
    date: string,
    days: number,
    transport: string,
    price: number
  ) {
    if (this.locations.length === 1) {
      google.maps.event.addListener(this.marker, 'click', function() {
        infowindow.setContent(
          `<div><h3> Starting in ${name}, ${country} </h3></div>`
        );
        infowindow.open(this.map, this);
      });
    } else {
      google.maps.event.addListener(this.marker, 'click', function() {
        infowindow.setContent(
          `<div><h3> Location: ${name}, ${country} </h3></div><div><p><strong>Arriving on Day </strong> ${days} <strong> of the trip </strong></p></div> <div><p><strong>Arriving on </strong> ${date}  via  <i>${transport}</i> </p></div><div><p><strong>Price: </strong>  ${price} per person  </p></div> `
        );
        infowindow.open(this.map, this);
      });
    }
  }

  resetMapValues(input) {
    this.clearPolylines();
    this.clearMarkers();
    this.deleteLocation(input);
    this.resetPolylines();
  }

  clearPolylines() {
    this.itineraryPath.forEach(flightPathData => {
      flightPathData.setMap(null);
    });
    this.itineraryPath = [];
  }

  clearMarkers() {
    this.mapMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.mapMarkers = [];
  }

  resetPolylines() {
    this.destinationCoordinates = [];
    this.locations.forEach(location => {
      const point = {
        lat: location.geoLocation.geometry.location.lat(),
        lng: location.geoLocation.geometry.location.lng()
      };
      this.destinationCoordinates.push(point);
      this.resetFlightPath();
      this.buildMarkers(point);
    });
  }

  resetFlightPath() {
    this.flightPathData = newPolyline(this.destinationCoordinates);
    this.flightPathData.setMap(this.map);
    this.itineraryPath.push(this.flightPathData);
  }

  buildMarkers(point: Coordinate) {
    this.marker = newMarker(point, this.map);
    this.marker.setIcon(
      'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    );
    this.mapMarkers.push(this.marker);
  }

  deleteLocation(locationInput: Destination) {
    this.locations = removeLocation(this.locations, locationInput);
  }


  addItinerary(event) {
    this.newItinerary = Object.assign({}, event);
    this.buildItinerary(this.newItinerary);
    this.updateItinerary(this.newItinerary);
  }

  buildItinerary(newItinerary) {
    newItinerary.id = this.user._id;
    newItinerary.nationalities = [this.selectedNationalityId1, this.selectedNationalityId2]
  }

  updateItinerary(newItinerary) {
    this.userService.editItinerary(newItinerary).subscribe(user => {
      this.user = user;
      alert('Itinerary saved! View in your user profile.');
    });
  }
}
