import { Component, OnInit } from '@angular/core';
import {FlightService} from '../flight.service';

declare var google: any

@Component({
  selector: 'app-my-flights',
  templateUrl: './my-flights.component.html',
  styleUrls: ['./my-flights.component.css'],
  providers: [FlightService],
})
export class MyFlightsComponent implements OnInit {

  constructor(private flightService: FlightService) { }

  departureLocation;
  arrivalLocation;
  departureView;
  arrivalView;
  searchResult;
  durations = ['result.fly_duration', 'result.return_duration'];
  checked: boolean = false;
  toggle: boolean = true;
  map: any;


  ngOnInit() {
    this.initiateMap();

    if (this.arrivalView === undefined){
      this.arrivalView = '';
    }
    let departureInput = document.getElementById('departure');
    let departureAutocomplete = new google.maps.places.Autocomplete(departureInput);

    departureAutocomplete.addListener("place_changed", ()=> {
      this.departureLocation = departureAutocomplete.getPlace();
      console.log("departure", this.departureLocation);
      this.departureView = departureAutocomplete.getPlace()
    });

    let arrivalInput = document.getElementById('arrival');
    let arrivalAutocomplete = new google.maps.places.Autocomplete(arrivalInput);

    arrivalAutocomplete.addListener("place_changed", ()=> {
      this.arrivalLocation = arrivalAutocomplete.getPlace();
      console.log('arrival', this.arrivalLocation);
      this.arrivalView = arrivalAutocomplete.getPlace();

    this.departureAutocomplete();
    this.arrivalAutocomplete();
    });
  }

  departureAutocomplete(){
    this.flightService.getLocation(this.departureLocation.name)
      .subscribe((location) => {
        console.log('location1',location);
        this.departureLocation = location[0].id;
        console.log("new departure", this.departureLocation)
    });
  }

  arrivalAutocomplete(){
    this.flightService.getLocation(this.arrivalLocation.name)
      .subscribe((location) => {
      console.log('location2', location);
      this.arrivalLocation = location[0].id;
      console.log('new arrival', this.arrivalLocation)
    });
  }

  searchFlights(){
    this.toggle = false;
    this.departureAutocomplete();
    this.arrivalAutocomplete();
    let departureDates = [];
    let returnDates = [];

    let startDateFrom = document.getElementById('departure-date-start')['valueAsDate'];
    startDateFrom = this.formatDate(startDateFrom);
    let startDateEnd = document.getElementById('departure-date-end')['valueAsDate'];
    startDateEnd = this.formatDate(startDateEnd);
    departureDates.push(startDateFrom,startDateEnd);
    console.log("departureDates", departureDates);

    let returnDateFrom = document.getElementById('return-date-start')['valueAsDate'];
    returnDateFrom = this.formatDate(returnDateFrom);
    let returnDateEnd = document.getElementById('return-date-end')['valueAsDate'];
    returnDateEnd = this.formatDate(returnDateEnd);
    returnDates.push(returnDateFrom,returnDateEnd)
    console.log("returnDates", returnDates);

    if(this.departureLocation !== undefined && this.arrivalLocation !== undefined){
      let flight = {
        from: this.departureLocation,
        to: this.arrivalLocation,
        departures: departureDates,
        returns: returnDates,
        type: 'return'
      }
      this.flightService.getFlights(flight)
      .subscribe((result) => {
      this.searchResult = result;
      console.log("result", this.searchResult)
      console.log("data", this.searchResult.data)
      console.log("data[0]", this.searchResult.data[0]);
      if (this.checked === false){
        this.checked = true;
      } else {
        this.checked = false;
      }
      this.toggle = true;
    });
    }


}

  formatDate(date){
    let dateLength = date.getMonth()
    if(dateLength <= 8){
      date = date.getDate() + '/0' + (date.getMonth()+1) + '/' + date.getFullYear();
    } else{
      date = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
    }
    console.log("formatted date", date);
    return date;
  }

  initiateMap(){

    var myOptions = {
      zoom: 2,
      center: new google.maps.LatLng(10, 0),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // initialize the map
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
        myOptions);

        var styles = [

        {
          featureType: "landscape",
          stylers: [
            { hue: "#fff" },
            { saturation: 100 }
          ]
        },{
          featureType: "road",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "administrative.land_parcel",
          stylers: [
            { visibility: "off" }
          ]
        },{
          featureType: "administrative.locality",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "administrative.neighborhood",
          stylers: [
            { visibility: "off" }
          ]
        },{
          featureType: "administrative.province",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "landscape.man_made",
          stylers: [
            { visibility: "off" }
          ]
        },{
          featureType: "landscape.natural",
          stylers: [
            { visibility: "off" }
          ]
        },{
          featureType: "poi",
          stylers: [
            { visibility: "on" }
          ]
        },{
          featureType: "transit",
          stylers: [
            { visibility: "off" }
          ]
        }
      ];

    this.map.setOptions({styles: styles});
  }
}
