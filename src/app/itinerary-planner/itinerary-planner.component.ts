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

  newAddress: any;
  placeExpenditure: any;
  newPrice: any;


  diffDays: number;
  currentCost: number = 0;
  price: number = 0;
  sum: number = 0;

  checked: boolean = false;

  name: string;
  locationView: string;
  newCurrency: string = '$';
  newTransport: string = 'plane';
  namePlaceholder: string = "Create an itinerary name"
  locationPlaceholder: string = "Enter a starting location";

  itineraryDays: Array<number> = [];
  expenseArray: Array<any> = [];
  totalCostArray: Array<any> = [];
  dates: Array<any> = [];
  itineraryPrice: Array<number> = [];

  ngOnInit() {
    this.autoCompleteAddress();
  }

  autoCompleteAddress() {
    const input = document.getElementById('new-address');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener("place_changed", () => {
      this.place = autocomplete.getPlace()
      this.locationView = this.place.name;
      console.log('this.place', this.place)
    })
  }

  //adds expense to a single location in the itinerary*********************
  addExpense() {
    const newTotalExpense = this.createNewExpense();
    this.createCurrentCost(newTotalExpense);
  }

  //delete expense from list
  deleteExpense() {
    this.expenseArray.pop();
    this.totalCostArray.pop();
    let newTotalExpense = this.totalCostArray.reduce((a, b) => a + b, 0);
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
    this.expenseArray.push(newestExpense);
    this.totalCostArray.push(newestExpense.expense);
    return this.totalCostArray.reduce((a, b) => a + b, 0);
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

  //********************* Create cost total *********************
  totalPrice() {
    this.price = this.itineraryPrice.reduce((a, b) => a + b, 0);
  }

  //**************** total days*********************
  totalDays() {
    this.sum = this.itineraryDays.reduce((a, b) => a + b, 0);
  }

  //*********** whenever a user deletes a value from the itinerary
  updateTotalDays() {
    this.dates.forEach((day) => {
      let dayIndex = this.dates.indexOf(day);
      this.diffDays = (Math.abs(new Date(this.dates[dayIndex]).getTime() - new Date(this.dates[dayIndex - 1]).getTime())) / (1000 * 3600 * 24);
      if (!this.diffDays) {
        this.diffDays = 0;
      }
      this.itineraryDays.push(this.diffDays);
    })
  }



  //**********************Create a new marker and flightPath******************* */
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
    this.sendMarker(this.newAddress);
    this.resetValues();
  }

  setPlaceDetails() {
    this.place.details = this.expenseArray.length === 0 ? '' : this.expenseArray;
    console.log('place in set details', this.place)
  }

  setCurrencyAndTransport() {
    this.place.currency = this.newCurrency;
    this.place.transport = this.newTransport;
    if (!this.place.transport) {
      this.place.transport = "plane";
    }
  }

  setCountryName() {
    console.log('country name', this.place)
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
    const variableDate = document.getElementById('new-date')['valueAsDate'];
    const dateLength = variableDate.getMonth()
    if (dateLength <= 8) {
      this.place.date = variableDate.getFullYear() + '-0' + (variableDate.getMonth() + 1) + '-' + variableDate.getDate();
    } else {
      this.place.date = variableDate.getFullYear() + '-' + (variableDate.getMonth() + 1) + '-' + variableDate.getDate();
    }
    this.place.date.autocomplete;
    this.dates.push(this.place.date);
  }

  setItineraryLength() {
    console.log('dates', this.dates);
    const newFirstDate = [];
    const newSecondDate = [];

    if (this.dates.length >= 0) {
      this.diffDays = (Math.abs(new Date(this.dates[this.dates.length - 1]).getTime() - new Date(this.dates[this.dates.length - 2]).getTime())) / (1000 * 3600 * 24);
      if (isNaN(this.diffDays)) {
        this.diffDays = 0;
      }
    }
    if (this.dates.length > 1) {
      let firstDate = this.dates[this.dates.length - 1].split('/');
      let secondDate = this.dates[this.dates.length - 2].split('/');
      if (!secondDate) {
        secondDate = 0;
      }

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


  sendMarker(input) {
    const exportedValues = {
      address: input,
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
    this.totalDays();
  }

  adjustItineraryCost() {
    this.itineraryPrice = [];
    this.locations.forEach((place) => {
      this.itineraryPrice.push(place.price);
    })
    this.totalPrice();
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

  //toggles on and off note option for itinerary***********************
  toggleNote() {
    !this.checked ? this.checked = true : this.checked = false;
  }

}
