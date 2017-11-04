import { Component, OnInit, ViewChild } from '@angular/core';
import { FlightService } from '../../shared/services/flight.service';
import { MapOptions, MapStyles, GoogleMap } from 'app/shared/models/map.model';
import {
  setMap,
  buildAutocomplete,
  formatDate,
  formatSelectDates
} from 'app/utils';
import { FlightPathService } from 'app/shared/services/flightPath.service';
import { GooglePlace } from 'app/shared/models/google.model';

declare const google: any;

@Component({
  selector: 'app-my-flights',
  templateUrl: './my-flights.component.html',
  styleUrls: ['./my-flights.component.scss']
})
export class MyFlightsComponent implements OnInit {
  constructor(
    private flightService: FlightService,
    private flightPathService: FlightPathService
  ) {}

  @ViewChild('departure') departureInput;
  @ViewChild('arrival') arrivalInput;

  map: GoogleMap;
  flightPath: any;
  searchResult: any;

  departureView: GooglePlace;
  arrivalView: GooglePlace;

  departureLocation: string;
  arrivalLocation: string;
  departureStartDate: string;
  departureEndDate: string;
  returnStartDate: string;
  returnEndDate: string;
  mapCanvas: string = 'flightChecker';

  durations: string[] = ['result.fly_duration', 'result.return_duration'];
  checked: boolean = false;
  toggle: boolean = true;

  ngOnInit() {
    this.initiateMap();
    this.setAutoCompletes();
    // this.arrivalView = !this.arrivalView ? '' : this.arrivalView;
  }

  initiateMap() {
    this.map = setMap();
  }

  setAutoCompletes() {
    this.setDepartureAutocomplete();
    this.setArrivalAutocomplete();
  }

  setDepartureAutocomplete() {
    const departureAutocomplete = buildAutocomplete(
      this.departureInput.nativeElement
    );
    departureAutocomplete.addListener('place_changed', () => {
      this.departureView = departureAutocomplete.getPlace();
      this.flightService
        .getLocation(this.departureView.name)
        .subscribe(result => (this.departureLocation = result.id));
    });
  }

  setArrivalAutocomplete() {
    const arrivalAutocomplete = buildAutocomplete(
      this.arrivalInput.nativeElement
    );
    arrivalAutocomplete.addListener('place_changed', () => {
      this.arrivalView = arrivalAutocomplete.getPlace();
      this.flightService
        .getLocation(this.arrivalView.name)
        .subscribe(result => (this.arrivalLocation = result.id));
    });
  }

  searchFlights() {
    this.toggle = false;
    const dates = [
      this.departureStartDate,
      this.departureEndDate,
      this.returnStartDate,
      this.returnEndDate
    ];
    const newDates = formatSelectDates(dates);
    this.arrangeFlightDates(newDates);
  }

  arrangeFlightDates(dates: string[]) {
    const departureDates = [dates[0], dates[1]];
    const returnDates = [dates[2], dates[3]];
    const flight = this.flightService.buildFlightPlan(
      this.departureLocation,
      this.arrivalLocation,
      departureDates,
      returnDates
    );
    this.getFlights(flight);
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
    const coordinates = this.flightService.createFlightCoordinates(routes);
    const lastRoute = routes[routes.length - 1];
    coordinates.push({ lat: lastRoute.latTo, lng: lastRoute.lngTo });
    this.flightPath = this.flightPathService.setPolyline(coordinates);
    console.log('flightPath', this.flightPath)
    this.flightPath.setMap(this.map);
  }

  removeFlightPath(index) {
    this.flightPath.setMap(null);
  }

  getFlights(flight) {
    this.flightService.getFlights(flight).subscribe(result => {
      this.searchResult = result;
      console.log('searchResult', this.searchResult)
      this.checked = !this.checked;
      this.toggle = true;
    });
  }
}
