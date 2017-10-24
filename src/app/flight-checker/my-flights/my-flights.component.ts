import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../shared/services/flight.service';
import { setMap } from '../../shared/services/map.service';
import { MapOptions, MapStyles } from 'app/shared/map.model';

declare var google: any;

@Component({
  selector: 'app-my-flights',
  templateUrl: './my-flights.component.html',
  styleUrls: ['./my-flights.component.css'],
})
export class MyFlightsComponent implements OnInit {
  constructor(private flightService: FlightService) {}

  departureLocation: any;
  arrivalLocation: any;
  departureView: string;
  arrivalView: string;
  searchResult: any;
  durations = ['result.fly_duration', 'result.return_duration'];
  checked: boolean = false;
  toggle: boolean = true;
  map: any;
  flightPath;

  ngOnInit() {
    this.initiateMap();

    this.arrivalView = !this.arrivalView ? '' : this.arrivalView;

    const departureInput = document.getElementById('departure');
    const departureAutocomplete = new google.maps.places.Autocomplete(
      departureInput
    );

    departureAutocomplete.addListener('place_changed', () => {
      this.departureLocation = departureAutocomplete.getPlace();
      this.departureView = departureAutocomplete.getPlace();
    });

    const arrivalInput = document.getElementById('arrival');
    const arrivalAutocomplete = new google.maps.places.Autocomplete(
      arrivalInput
    );

    arrivalAutocomplete.addListener('place_changed', () => {
      this.arrivalLocation = arrivalAutocomplete.getPlace();
      this.arrivalView = arrivalAutocomplete.getPlace();

      this.departureAutocomplete();
      this.arrivalAutocomplete();
    });
  }

  departureAutocomplete() {
    this.flightService
      .getLocation(this.departureLocation.name)
      .subscribe(location => {
        this.departureLocation = location[0].id;
      });
  }

  arrivalAutocomplete() {
    this.flightService
      .getLocation(this.arrivalLocation.name)
      .subscribe(location => {
        this.arrivalLocation = location[0].id;
      });
  }

  searchFlights() {
    this.toggle = false;
    this.departureAutocomplete();
    this.arrivalAutocomplete();
    const departureDates = [];
    const returnDates = [];

    let startDateFrom = document.getElementById('departure-date-start')[
      'valueAsDate'
    ];
    startDateFrom = this.formatDate(startDateFrom);
    let startDateEnd = document.getElementById('departure-date-end')[
      'valueAsDate'
    ];
    startDateEnd = this.formatDate(startDateEnd);
    departureDates.push(startDateFrom, startDateEnd);

    let returnDateFrom = document.getElementById('return-date-start')[
      'valueAsDate'
    ];
    returnDateFrom = this.formatDate(returnDateFrom);
    let returnDateEnd = document.getElementById('return-date-end')[
      'valueAsDate'
    ];
    returnDateEnd = this.formatDate(returnDateEnd);
    returnDates.push(returnDateFrom, returnDateEnd);

    if (this.departureLocation && this.arrivalLocation) {
      let flight = {
        from: this.departureLocation,
        to: this.arrivalLocation,
        departures: departureDates,
        returns: returnDates,
        type: 'return'
      };
      this.flightService.getFlights(flight).subscribe(result => {
        this.searchResult = result;
        this.checked = !this.checked;
        this.toggle = true;
      });
    }
  }

  formatDate(date) {
    let dateLength = date.getMonth();
    if (dateLength <= 8) {
      date =
        date.getDate() +
        '/0' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear();
    } else {
      date =
        date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }
    return date;
  }

  initiateMap() {
    this.map = setMap();
  }

  hover() {
    let hoverItem = document.getElementsByClassName('results');
    for (let i = 0; i < hoverItem.length; i++) {
      hoverItem[i].addEventListener('mouseover', this.addFlightPath);
      hoverItem[i].addEventListener('mouseout', this.removeFlightPath);
    }
  }

  addFlightPath(index) {
    const routes = this.searchResult.data[index].route;
    const coordinates = [];
    let that = this;
    routes.forEach(route => {
      const routeLatLng = { lat: route.latFrom, lng: route.lngFrom };
      coordinates.push(routeLatLng);
    });
    const lastRoute = routes[routes.length - 1];
    const lastRouteLatLng = { lat: lastRoute.latTo, lng: lastRoute.lngTo };
    coordinates.push(lastRouteLatLng);

    this.flightPath = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: 'yellow',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });
    this.flightPath.setMap(this.map);
  }

  removeFlightPath(index) {
    this.flightPath.setMap(null);
  }
}
