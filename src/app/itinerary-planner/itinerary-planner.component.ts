import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var google: any;

@Component({
  selector: 'itinerary-planner',
  templateUrl: './itinerary-planner.component.html',
  styleUrls: ['./itinerary-planner.component.scss']
})

export class ItineraryPlannerComponent {

  constructor() { }

  @Input() locations: any;
  @Input() place: any;
  @Output() changeAddress: EventEmitter<any> = new EventEmitter();
  @Output() createMarker: EventEmitter<any> = new EventEmitter();
  @Output() resetMapMarkers: EventEmitter<any> = new EventEmitter();


  newItinerary = {
    id: '',
    name: '',
    nationality1: '',
    nationality2: '',
    placesAndDates: [],
  };

  differenceBetweenDates: number;
  currentCost: number = 0;
  totalPrice: number = 0;
  totalTripDuration: number = 0;

  checked: boolean = false;

  locationView: string;
  newAddress: string;
  selectedCurrency: string = '$';
  selectedTransport: string = 'plane';
  namePlaceholder: string = "Create an itinerary name"
  locationPlaceholder: string = "Enter a starting location";

  itineraryDays: Array<number> = [];
  displayableExpenses: Array<any> = [];
  accumulatedDailyExpense: Array<number> = [];
  dates: Array<any> = [];
  costs: Array<number> = [];

  ngOnInit() {
    this.autoCompleteAddress();
  }

  autoCompleteAddress() {
    const input = document.getElementById('new-address');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener("place_changed", () => {
      this.place = autocomplete.getPlace()
      this.locationView = this.place.name;
    })
  }

  //adds expense to a single location in the itinerary*********************
  addExpense() {
    const newTotalExpense = this.createNewExpense();
    this.createCurrentCost(newTotalExpense);
  }

  //delete expense from list
  deleteExpense() {
    this.displayableExpenses.pop();
    this.accumulatedDailyExpense.pop();
    const newTotalExpense = this.accumulatedDailyExpense.reduce((a, b) => a + b, 0);
    this.createCurrentCost(newTotalExpense);
  }

  createNewExpense() {
    let newestExpense = {
      note: '',
      expense: document.getElementById('new-price')['valueAsNumber'],
      transport: document.getElementById('new-transport')['value']
    };
    if (!document.getElementById('new-note')) {
      newestExpense.note = '';
    } else {
      newestExpense.note = document.getElementById('new-note')['value'];
    }
    this.displayableExpenses.push(newestExpense);
    this.accumulatedDailyExpense.push(newestExpense.expense);
    return this.accumulatedDailyExpense.reduce((a, b) => a + b, 0);
  }

  createCurrentCost(newTotalExpense) {
    if (document.getElementById("new-note")) {
      document.getElementById("new-note")["value"] = '';
    }
    document.getElementById("new-price")["value"] = '';
    if (!newTotalExpense || isNaN(newTotalExpense)) {
      this.currentCost = 0;
    } else {
      this.currentCost = newTotalExpense;
    }
  }

  getTotalPrice() {
    this.totalPrice = this.costs.reduce((a, b) => a + b, 0);
  }

  getTotalDays() {
    this.totalTripDuration = this.itineraryDays.reduce((a, b) => a + b, 0);
  }

  updateTotalDays() {
    this.dates.forEach((day) => {
      const dayIndex = this.dates.indexOf(day);
      this.differenceBetweenDates = (Math.abs(new Date(this.dates[dayIndex]).getTime() - new Date(this.dates[dayIndex - 1]).getTime())) / (1000 * 3600 * 24);
      if (!this.differenceBetweenDates) {
        this.differenceBetweenDates = 0;
      }
      this.itineraryDays.push(this.differenceBetweenDates);
    })
  }

  //**********************Create a new marker and flightPath******************* */
  createPoint() {
    this.setPlaceDetails();
    this.setCurrencyAndTransport();
    this.setCountryName();
    this.setPrice();
    this.setLocations();
    this.setDates();
    this.setItineraryLength();
    this.sendMarker(this.newAddress);
    this.resetValues();
  }

  setPlaceDetails() {
    this.place.details = this.displayableExpenses.length === 0 ? '' : this.displayableExpenses;
  }

  setCurrencyAndTransport() {
    this.place.currency = this.selectedCurrency;
    this.place.transport = this.selectedTransport;
    if (!this.place.transport) {
      this.place.transport = "plane";
    }
  }

  setCountryName() {
    const countryStringSplit = this.place.formatted_address.split(',');
    this.place.country = countryStringSplit[countryStringSplit.length - 1];
  }

  setPrice() {
    if (this.accumulatedDailyExpense.length === 0) {
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
    this.costs.push(this.place.price);
    this.getTotalPrice();
  }

  setDates() {
    const variableDate = document.getElementById('new-date')['valueAsDate'];
    const dateLength = variableDate.getMonth();
    const digit = (dateLength <= 8) ? '-0' : '-';

    this.place.date = variableDate.getFullYear() + `${digit}` + (variableDate.getMonth() + 1) + '-' + variableDate.getDate();
    this.place.date.autocomplete;
    this.dates.push(this.place.date);
  }

  setLocations() {
    this.locations.push(this.place);
    this.newItinerary.placesAndDates.push(this.place);
  }

  setItineraryLength() {
    const newFirstDate = [];
    const newSecondDate = [];
    let returnFirstDate;
    let returnSecondDate;

    if (this.dates.length >= 0) {
      this.differenceBetweenDates = Math.round(Math.abs(new Date(this.dates[this.dates.length - 1]).getTime() - new Date(this.dates[this.dates.length - 2]).getTime()) / (1000 * 3600 * 24));
      if (isNaN(this.differenceBetweenDates)) {
        this.differenceBetweenDates = 0;
      }
    } else {
      let firstDate = this.dates[this.dates.length - 1].split('/');
      let secondDate = this.dates[this.dates.length - 2].split('/');
      if (!secondDate) {
        secondDate = 0;
      }
      for (let i = firstDate.length - 1; i >= 0; i--) {
        newFirstDate.push(firstDate[i]);
      }
      for (var x = secondDate.length - 1; x >= 0; x--) {
        newSecondDate.push(secondDate[x]);
      }
      returnFirstDate = newFirstDate.join();
      returnSecondDate = newSecondDate.join();
      this.differenceBetweenDates = Math.round(Math.abs(new Date(returnFirstDate).getTime() - new Date(returnSecondDate).getTime()) / (1000 * 3600 * 24));
    }
    this.itineraryDays.push(this.differenceBetweenDates);
    this.getTotalDays();
  }

  sendMarker(address) {
    const exportedValues = {
      address: address,
      name: this.place.name,
      date: this.place.date,
      days: this.place.date,
      transport: this.place.transport,
      country: this.place.country,
      price: this.place.price,
      point: { lat: this.place.geometry.location.lat(), lng: this.place.geometry.location.lng() }
    }
    this.createMarker.emit(exportedValues);
  }

  deletePoint(locationInput) {
    this.resetMapMarkers.emit(locationInput);
    this.adjustDates();
    this.adjustItineraryCost();
  }

  adjustDates() {
    this.dates = [];
    this.itineraryDays = [];
    this.locations.forEach((place) => {
      this.dates.push(place.date);
    })
    this.updateTotalDays();
    this.getTotalDays();
  }

  adjustItineraryCost() {
    this.costs = [];
    this.locations.forEach((place) => {
      this.costs.push(place.price);
    })
    this.getTotalPrice();
  }


  resetValues() {
    const note = document.getElementById("new-note");
    if (note) {
      document.getElementById("new-note")["value"] = '';
    }
    document.getElementById("new-price")["value"] = '';
    this.newAddress = '';
    this.displayableExpenses = [];
    this.accumulatedDailyExpense = [];
    this.namePlaceholder = "Edit itinerary name"
    this.locationPlaceholder = "Add a location";
    this.locationView = '';
    this.currentCost = 0;
  }

  //toggles on and off note option for itinerary***********************
  toggleNote() {
    !this.checked ? this.checked = true : this.checked = false;
  }

}
