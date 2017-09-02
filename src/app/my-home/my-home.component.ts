import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from '../country.service';
import { WarningService } from '../warning.service';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';
import { FileUploader } from "ng2-file-upload";

declare var google: any;

@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.css'],
  providers: [CountryService, WarningService, SessionService, UserService]
})

export class MyHomeComponent implements OnInit {



  newItinerary = {
    id: '',
    name: '',
    nationality1: '',
    nationality2: '',
    placesAndDates: [],
  };


  selectedNationalityId1: string;
  selectedNationalityId2: string;
  user;
  countries: any;
  countries2: any;
  warnings;
  nation;
  nation2;
  countryName1: string;
  countryName2: string;
  freeLayer;
  freeLayer2;
  address;
  flightPath;
  totalItinerary;
  marker;
  indexTarget;
  locationIndex;
  locationView: string;
  passableValue;
  currentCost: number = 0;
  arrow: string;
  checked: boolean = false;
  isCollapsed: boolean = false;
  feedback: string;
  map: any;
  diffDays: number;
  place: any;
  placeExpenditure: any;
  sum: number = 0;
  price: number = 0;
  newAddress: any;
  newPrice: any;
  newCurrency: string = '$';
  newTransport: string = 'plane';
  namePlaceholder: string = "Create an itinerary name"
  locationPlaceholder: string = "Enter a starting location";
  arrayOfTravel = [];
  dates = [];
  locations: Array<any> = [];
  itineraryDays: Array<any> = [];
  itineraryPrice: Array<any> = [];
  allMarkers: Array<any> = [];
  allFlightPaths: Array<any> = [];
  allTravelArray: Array<any> = [];
  colorLayers: Array<any> = [];
  layers: Array<any> = [];
  totalCostArray: Array<any> = [];
  expenseArray: Array<any> = [];

  selectedAddress: any;




  constructor(private country: CountryService, private status: WarningService, private session: SessionService, private userService: UserService) { }



  ngOnInit() {
    this.initiateMap();
    this.authorizeUser();
    this.getCountries();
    this.autoCompleteAddress();

    this.countryName1 = !this.countryName1 ? (this.countryName1 = '') : this.countryName1;
    this.countryName2 = !this.countryName2 ? (this.countryName2 = '') : this.countryName2;
    !this.isCollapsed ? this.arrow = ">" : this.arrow = "v";
    this.place = {};
  }




  authorizeUser() {
    let user = JSON.parse(localStorage.getItem("user"))
    !user ? this.user = '' : this.getUser(this.user);
  }

  getUser(user) {
    this.userService.get(user._id)
      .subscribe((user) => {
        this.user = user
      });
  }

  getCountries() {
    this.country.getList()
      .subscribe((countries) => {
        this.countries = countries;
        this.countries2 = countries;
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
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
      myOptions);

    const styles = [

      {
        featureType: "landscape",
        stylers: [
          { hue: "#fff" },
          { saturation: 100 }
        ]
      }, {
        featureType: "road",
        stylers: [
          { visibility: "on" }
        ]
      }, {
        featureType: "administrative.land_parcel",
        stylers: [
          { visibility: "off" }
        ]
      }, {
        featureType: "administrative.locality",
        stylers: [
          { visibility: "on" }
        ]
      }, {
        featureType: "administrative.neighborhood",
        stylers: [
          { visibility: "off" }
        ]
      }, {
        featureType: "administrative.province",
        stylers: [
          { visibility: "on" }
        ]
      }, {
        featureType: "landscape.man_made",
        stylers: [
          { visibility: "off" }
        ]
      }, {
        featureType: "landscape.natural",
        stylers: [
          { visibility: "off" }
        ]
      }, {
        featureType: "poi",
        stylers: [
          { visibility: "on" }
        ]
      }, {
        featureType: "transit",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];

    this.map.setOptions({ styles: styles });
  }


  autoCompleteAddress() {
    let input = document.getElementById('new-address');
    let autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", () => {
      this.place = autocomplete.getPlace()
      this.locationView = this.place.name;
      console.log("this.place", this.place)
    })
  }

  //**************** total days*********************
  totalDays() {
    console.log("totalDays()", this.itineraryDays)
    const total = this.itineraryDays.reduce((a, b) => a + b, 0);
    console.log("total", total)
    isNaN(total) ? (this.sum = 0) : this.sum = total;
  }

  //********************* Create cost total *********************
  totalPrice() {
    const totalPrice = this.itineraryPrice.reduce((a, b) => a + b, 0);
    if (!totalPrice || isNaN(totalPrice)) {
      this.price = 0;
    } else {
      this.price = totalPrice;
    }
  }


  //********************** shows country layers *************
  loadCountries(selectedNationalityId1, selectedNationalityId2) {
    const selectedCountries = [selectedNationalityId1, selectedNationalityId2]
    const colors = {
      visaFree: ['red', 'blue'],
      visaOnArrival: ['yellow', 'green']
    }
    let index = 0
    this.showCountries(selectedCountries, colors, index);
  }


  //********************   creates country data layers ***************
  showCountries(selectedCountries, colors, index) {
    if (index === 2) {
      return
    }
    this.setDataLayersForSelectedCountry(selectedCountries, index, colors);
  }

  setDataLayersForSelectedCountry(selectedCountries, index, colors) {
    this.country.get(selectedCountries[index])
      .subscribe((nation) => {
        this.nation = nation;
        this.setDataLayers(this.nation, index, colors, selectedCountries);
      })
  }

  setDataLayers(nation, index, colors, countries) {
    const visaKindArray = ['visaFree', 'visaOnArrival'];
    let visaKindIndex = 0;
    let counter = 0;
    index === 0 ? (this.countryName1 = nation) : (this.countryName2 = nation)

    this.loadDataLayers(visaKindArray, visaKindIndex, nation, index, colors, counter, countries)
  }

  loadDataLayers(visaKindArray: any, visaKindIndex: number, nation: any, index: number, colors: any, counter: number, countries: any) {
    let visaKind = visaKindArray[visaKindIndex];
    this.createDataLayers(visaKind, nation, index, colors, counter);
    counter++
    console.log('counter', counter, 'this.nation[visaKind].length', this.nation[visaKind].length)
    if (counter === this.nation[visaKind].length) {
      counter = 0
      if (visaKind === 'visaOnArrival') {
        index++
        this.showCountries(countries, colors, index);
      } else {
        visaKindIndex++
        this.loadDataLayers(visaKindArray, visaKindIndex, nation, index, colors, counter, countries)
      }
    } else {
      this.loadDataLayers(visaKindArray, visaKindIndex, nation, index, colors, counter, countries)
    }
  }

  createDataLayers(visaKind: string, nation: any, index: number, colors: any, counter: number) {
    const freeLayer = new google.maps.Data();
    freeLayer.loadGeoJson('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' + nation[visaKind][counter] + '.geo.json');
    freeLayer.setStyle({ fillColor: colors[visaKind][index], fillOpacity: 0.5, title: nation[visaKind][counter] });
    freeLayer.setMap(this.map);
    this.layers.push(freeLayer);
  }

  createPoint() {
    // checks to see if there are any details/notes for the itinerary
    this.setPlaceDetails();
    //assigns currency and transport method
    this.setCurrencyAndTransport();
    //get country value
    this.setCountryName();
    // price input field
    this.setPrice();
    //add place to the locations array(used to create itinerary) and newItinerary object (used for saving itinerary)
    this.locations.push(this.place);
    this.newItinerary.placesAndDates.push(this.place);
    //date input field
    this.setDates();
    this.setItineraryLength();
    //geocodes the address, creates a marker and polyline segment
    this.geocodeMarker(this.newAddress);
    this.resetValues();
  }

  setPlaceDetails() {
    this.expenseArray.length === 0 ? this.place.details = '' : this.place.details = this.expenseArray;
  }

  setCurrencyAndTransport() {
    this.place.currency = this.newCurrency;
    this.place.transport = this.newTransport;
    if (this.place.transport == null || this.place.transport == undefined) {
      this.place.transport = "plane";
    }
  }

  setCountryName() {
    let countryStringSplit = this.place.formatted_address.split(',');
    this.place.country = countryStringSplit[countryStringSplit.length - 1];
  }

  setPrice() {
    if (this.totalCostArray.length === 0) {
      this.place.price = document.getElementById('new-price')['valueAsNumber'];
      this.currentCost = this.place.price;
    } else {
      this.place.price = this.currentCost;
    }
    if (isNaN(this.place.price)) {
      this.place.price = 0;
    }
    if (isNaN(this.currentCost)) {
      this.currentCost = 0;
    }
    this.itineraryPrice.push(this.place.price);
    this.totalPrice();
  }

  setDates() {
    let variableDate = document.getElementById('new-date')['valueAsDate'];
    let dateLength = variableDate.getMonth()
    if (dateLength <= 8) {
      this.place.date = variableDate.getFullYear() + '-0' + (variableDate.getMonth() + 1) + '-' + variableDate.getDate();
    } else {
      this.place.date = variableDate.getFullYear() + '-' + (variableDate.getMonth() + 1) + '-' + variableDate.getDate();
    }
    this.place.date.autocomplete;
    this.dates.push(this.place.date);
  }

  setItineraryLength() {
    if (this.dates.length >= 0) {
      this.diffDays = (Math.abs(new Date(this.dates[this.dates.length - 1]).getTime() - new Date(this.dates[this.dates.length - 2]).getTime())) / (1000 * 3600 * 24);
      if (isNaN(this.diffDays)) {
        this.diffDays = 0;
      }
    }
    if (this.dates.length > 1) {
      let firstDate = this.dates[this.dates.length - 1].split('/');
      let newFirstDate = [];
      let secondDate = this.dates[this.dates.length - 2].split('/');
      if (secondDate == undefined) {
        secondDate = 0;
      }
      let newSecondDate = [];

      for (let i = firstDate.length - 1; i >= 0; i--) {
        newFirstDate.push(firstDate[i]);
      }
      var returnFirstDate = newFirstDate.join();

      for (var x = secondDate.length - 1; x >= 0; x--) {
        newSecondDate.push(secondDate[x]);
      }
      var returnSecondDate = newSecondDate.join();
    }
    this.diffDays = (Math.abs(new Date(returnFirstDate).getTime() - new Date(returnSecondDate).getTime())) / (1000 * 3600 * 24);
    if (isNaN(this.diffDays)) {
      this.diffDays = 0;
    }
    this.itineraryDays.push(this.diffDays);
    this.totalDays();
  }

  geocodeMarker(address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status === 'OK') {
        const point = { lat: this.place.geometry.location.lat(), lng: this.place.geometry.location.lng() }
        const infowindow = new google.maps.InfoWindow();
        const name = this.place.name;
        const country = this.place.country;
        const date = this.place.date;
        const days = this.diffDays;
        const transport = this.place.transport;
        const price = this.place.price;

        this.arrayOfTravel.push(point);
        this.allTravelArray.push(this.arrayOfTravel);

        this.flightPath = new google.maps.Polyline({
          path: this.arrayOfTravel,
          geodesic: true,
          strokeColor: 'yellow',
          strokeOpacity: 1.0,
          strokeWeight: 4,

        });

        this.allFlightPaths.push(this.flightPath)
        this.flightPath.setMap(this.map);
        this.marker = new google.maps.Marker({
          position: point,
          map: this.map,
          name: name,
          country: country,
          date: date,
          days: days,
          transport: transport,
          price: price
        })
        this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
        this.allMarkers.push(this.marker)

        if (this.locations.length == 1) {
          google.maps.event.addListener(this.marker, 'click', function () {
            infowindow.setContent(`<div><h3> Starting in ${name}, ${country} </h3></div>`);
            infowindow.open(this.map, this);
            console.log(infowindow);
          });
        } else {
          google.maps.event.addListener(this.marker, 'click', function () {
            infowindow.setContent(`<div><h3> Location: ${name}, ${country} </h3></div><div><p><strong>Arriving on Day </strong> ${days} <strong> of the trip </strong></p></div> <div><p><strong>Arriving on </strong> ${date}  via  <i>${transport}</i> </p></div><div><p><strong>Price: </strong>  ${price} per person  </p></div> `);
            infowindow.open(this.map, this);
            console.log(infowindow);
          });
        }
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  resetValues() {
    const note = document.getElementById("new-note");
    if (note) {
      document.getElementById("new-note")["value"] = '';
    }
    document.getElementById("new-price")["value"] = '';
    this.newAddress = '';
    this.expenseArray = [];
    this.totalCostArray = [];
    this.namePlaceholder = "Edit itinerary name"
    this.locationPlaceholder = "Add a location";
    this.locationView = '';
    this.currentCost = 0;
  }


  deletePoint(locationInput) {

    // clear polylines and reset allFlightPaths array
    this.clearPolylines();

    this.clearMarkers();

    this.deleteLocation(locationInput);

    this.resetDates();

    //reconfigures the total price of trip
    this.itineraryPrice = [];
    this.locations.forEach((place) => {
      this.itineraryPrice.push(place.price);
    })
    this.totalPrice();

    //creates new polyline path and markers
    this.arrayOfTravel = [];
    this.locations.forEach((location) => {

      var point = { lat: location.geometry.location.lat(), lng: location.geometry.location.lng() }

      this.arrayOfTravel.push(point);

      this.flightPath = new google.maps.Polyline({
        path: this.arrayOfTravel,
        geodesic: true,
        strokeColor: 'yellow',
        strokeOpacity: 1.0,
        strokeWeight: 4,

      });
      this.flightPath.setMap(this.map);
      this.allFlightPaths.push(this.flightPath)
      this.marker = new google.maps.Marker({
        position: point,
        map: this.map
      })
      this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
      this.allMarkers.push(this.marker)
    })

  }

  clearPolylines(){
    this.allFlightPaths.forEach((flightPath) => {
      flightPath.setMap(null)
    })
    this.allFlightPaths = []
  }

  clearMarkers() {
    this.allMarkers.forEach((marker) => {
      marker.setMap(null);
    })
    this.allMarkers = [];
  }
  
  deleteLocation(locationInput) {
    this.locations = this.locations.filter((savedLocation) => {
      return savedLocation.id != locationInput.value
    })
  }
  
  resetDates() {
    //reconfigures the total number of days
  this.dates = [];
  this.itineraryDays = [];
  this.locations.forEach((place) => {
    this.dates.push(place.date);
  })
  this.updateTotalDays();
  this.totalDays();
  }


  //*********** whenever a user deletes a value from the itinerary
  updateTotalDays() {

    this.dates.forEach((day) => {
      console.log('day', day)
      let dayIndex = this.dates.indexOf(day);
      console.log('dayIndex', dayIndex)
      this.diffDays = (Math.abs(new Date(this.dates[dayIndex]).getTime() - new Date(this.dates[dayIndex - 1]).getTime())) / (1000 * 3600 * 24);
      if (isNaN(this.diffDays)) {
        this.diffDays = 0;
      }
      console.log('this.diffDays', this.diffDays);
      this.itineraryDays.push(this.diffDays);
    })
  }


  //toggles on and off note option for itinerary***********************
  toggleNote() {
    if (this.checked === false) {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }


  //adds expense to a single location in the itinerary*********************
  addExpense() {
    let newestExpense = {
      note: '',
      expense: Number,
      transport: ''
    };

    newestExpense.expense = document.getElementById('new-price')['valueAsNumber'];
    newestExpense.transport = document.getElementById('new-transport')['value']

    if (document.getElementById('new-note') == null) {
      newestExpense.note = '';
    } else {
      newestExpense.note = document.getElementById('new-note')['value'];
    }
    this.expenseArray.push(newestExpense);
    console.log("after", this.expenseArray);

    this.totalCostArray.push(newestExpense.expense);



    let newTotalExpense = this.totalCostArray.reduce((a, b) => a + b, 0);

    if (document.getElementById("new-note") !== null) {
      document.getElementById("new-note")["value"] = '';
    }
    document.getElementById("new-price")["value"] = '';

    if (newTotalExpense === 0 || newTotalExpense === NaN || newTotalExpense === undefined) {
      this.currentCost === 0;
      return this.currentCost;
    } else {
      this.currentCost = newTotalExpense;
      return this.currentCost;
    }

  }

  //delete expense from list
  deleteExpense() {
    this.expenseArray.pop();
    this.totalCostArray.pop();

    let newTotalExpense = this.totalCostArray.reduce((a, b) => a + b, 0);
    console.log("newTotalExpense", newTotalExpense);
    if (document.getElementById("new-note") !== null) {
      document.getElementById("new-note")["value"] = '';
    }
    document.getElementById("new-price")["value"] = '';

    if (newTotalExpense == 0 || newTotalExpense === NaN || newTotalExpense === undefined) {
      this.currentCost = 0;
      return this.currentCost;
    } else {
      this.currentCost = newTotalExpense;
      return this.currentCost;
    }
  }
  //saving to user profile in the database
  addItinerary() {
    this.newItinerary.id = this.user._id
    this.newItinerary.nationality1 = this.selectedNationalityId1;
    this.newItinerary.nationality2 = this.selectedNationalityId2;

    this.userService.editItinerary(this.newItinerary)
      .subscribe((user) => {
        this.user = user;
        console.log("user", user);
        alert("Itinerary saved! View in your user profile.");
      })
  }


}
