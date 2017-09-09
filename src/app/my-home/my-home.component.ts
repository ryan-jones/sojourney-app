import { Component, OnInit } from '@angular/core';
import { CountryService } from '../country.service';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';

declare var google: any;

@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.scss'],
  providers: [CountryService, SessionService, UserService]
})
export class MyHomeComponent implements OnInit {
  user: any;
  countries: any;
  flightPath: any;
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

  colorLayers: Array<any> = [];
  layers: Array<any> = [];
  allMarkers: Array<any> = [];
  allFlightPaths: Array<any> = [];
  allTravelArray: Array<any> = [];
  locations: Array<any> = [];
  arrayOfTravel: Array<any> = [];

  constructor(
    private country: CountryService,
    private status: WarningService,
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
    let user = JSON.parse(localStorage.getItem('user'));
    !user ? (this.user = '') : this.getUser(this.user);
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
    const myOptions = {
      zoom: 2,
      center: new google.maps.LatLng(10, 0),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // initialize the map
    this.map = new google.maps.Map(
      document.getElementById('map-canvas'),
      myOptions
    );

    const styles = [
      {
        featureType: 'landscape',
        stylers: [{ hue: '#fff' }, { saturation: 100 }]
      },
      {
        featureType: 'road',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative.locality',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'administrative.neighborhood',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative.province',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'landscape.man_made',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape.natural',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }]
      }
    ];
    this.map.setOptions({ styles: styles });
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
    this.buildFlightPath(geocoder, data);
  }

  buildFlightPath(geocoder, data) {
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
        that.createFlightPath(point);
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

  createFlightPath(point) {
    this.arrayOfTravel.push(point);
    this.allTravelArray.push(this.arrayOfTravel);
    this.flightPath = new google.maps.Polyline({
      path: this.arrayOfTravel,
      geodesic: true,
      strokeColor: 'yellow',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });
    this.allFlightPaths.push(this.flightPath);
    this.flightPath.setMap(this.map);
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
    this.allMarkers.push(this.marker);
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
    this.allFlightPaths.forEach(flightPath => {
      flightPath.setMap(null);
    });
    this.allFlightPaths = [];
  }

  clearMarkers() {
    this.allMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.allMarkers = [];
  }

  resetPolylines() {
    this.arrayOfTravel = [];
    this.locations.forEach(location => {
      const point = {
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng()
      };
      this.arrayOfTravel.push(point);
      this.flightPath = new google.maps.Polyline({
        path: this.arrayOfTravel,
        geodesic: true,
        strokeColor: 'yellow',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });
      this.flightPath.setMap(this.map);
      this.allFlightPaths.push(this.flightPath);
      this.marker = new google.maps.Marker({
        position: point,
        map: this.map
      });
      this.marker.setIcon(
        'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
      );
      this.allMarkers.push(this.marker);
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
