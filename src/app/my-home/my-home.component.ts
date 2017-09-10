import { Component, OnInit } from '@angular/core';
import { CountryService } from '../shared/services/country.service';
import { SessionService } from '../shared/services/session.service';
import { UserService } from '../shared/services/user.service';
import { User } from 'app/shared/user.model';
import { Country } from 'app/shared/country.model';
import { MapStyles, MapOptions } from 'app/shared/map.model';
import { setMap } from 'app/shared/services/map.service';

declare var google: any;

@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.scss'],
  providers: [CountryService, SessionService, UserService]
})
export class MyHomeComponent implements OnInit {
  user = new User;
  countries: Country[];
  flightPathData: any;
  marker: any;
  newItinerary: any;
  map: any;
  place: any;
  selectedAddress: any;

  nation;
  address;
  locationView: string;
  arrow: string;
  checked: boolean = false;
  isCollapsed: boolean = false;

  selectedNationalityId1: string;
  selectedNationalityId2: string;

  layers: any[] = [];
  mapMarkers: any[] = [];
  itineraryPath: any[] = [];
  locations: any[] = [];
  destinationCoordinates: any[] = [];

  constructor(
    private country: CountryService,
    private session: SessionService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initiateMap();
    this.authorizeUser();
    this.getCountries();
    this.checkCollapsed();
  }

  checkCollapsed() {
    this.isCollapsed = !this.isCollapsed;
    !this.isCollapsed ? (this.arrow = '>') : (this.arrow = 'v');
  }

  authorizeUser() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser) this.getUser(this.user);
  }

  getUser(user) {
    this.userService.get(user._id).subscribe(user => {
      this.user = user;
    });
  }

  getCountries() {
    this.country.getList().subscribe(countries => {
      this.countries = countries;
    });
  }

  //**************** creates initial map *********
  initiateMap() {
    this.map = setMap();
  }

  createDataLayers(event: {
    visaKind: string;
    nation: any;
    index: number;
    colors: any;
    counter: number;
  }) {
    const visaKind = event.visaKind;
    const nation = event.nation;
    const index = event.index;
    const colors = event.colors;
    const counter = event.counter;
    const freeLayer = new google.maps.Data();
    freeLayer.loadGeoJson(
      'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' +
        nation[visaKind][counter] +
        '.geo.json'
    );
    freeLayer.setStyle({
      fillColor: colors[visaKind][index],
      fillOpacity: 0.5,
      title: nation[visaKind][counter]
    });
    freeLayer.setMap(this.map);
    this.layers.push(freeLayer);
  }

  geocodeMarker(data) {
    const geocoder = new google.maps.Geocoder();
    this.buildflightPath(geocoder, data);
  }

  buildflightPath(geocoder, data) {
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

  createflightPath(point) {
    this.destinationCoordinates.push(point);

    this.flightPathData = new google.maps.Polyline({
      path: this.destinationCoordinates,
      geodesic: true,
      strokeColor: 'yellow',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });
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
    this.marker = new google.maps.Marker({
      position: point,
      map: this.map,
      name: name,
      country: country,
      date: date,
      days: days,
      transport: transport,
      price: price
    });
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
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng()
      };
      this.destinationCoordinates.push(point);
      this.flightPathData = new google.maps.Polyline({
        path: this.destinationCoordinates,
        geodesic: true,
        strokeColor: 'yellow',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });
      this.flightPathData.setMap(this.map);
      this.itineraryPath.push(this.flightPathData);
      this.marker = new google.maps.Marker({
        position: point,
        map: this.map
      });
      this.marker.setIcon(
        'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
      );
      this.mapMarkers.push(this.marker);
    });
  }

  deleteLocation(locationInput) {
    this.locations = this.locations.filter(savedLocation => {
      return savedLocation.id != locationInput.value;
    });
  }

  //saving to user profile in the database
  addItinerary(event) {
    this.newItinerary = event;
    this.buildItinerary(this.newItinerary);
    this.updateItinerary(this.newItinerary);
  }

  buildItinerary(newItinerary) {
    newItinerary.id = this.user._id;
    newItinerary.nationality1 = this.selectedNationalityId1;
    newItinerary.nationality2 = this.selectedNationalityId2;
  }

  updateItinerary(newItinerary) {
    this.userService.editItinerary(newItinerary).subscribe(user => {
      this.user = user;
      alert('Itinerary saved! View in your user profile.');
    });
  }
}
