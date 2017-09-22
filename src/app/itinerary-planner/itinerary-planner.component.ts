import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Itinerary } from 'app/shared/itinerary.model';

declare var google: any;

@Component({
  selector: 'itinerary-planner',
  templateUrl: './itinerary-planner.component.html',
  styleUrls: ['./itinerary-planner.component.scss']
})
export class ItineraryPlannerComponent {
  constructor() {}

  @Input() locations: any;
  @Output() changeAddress: EventEmitter<any> = new EventEmitter();
  @Output() createMarker: EventEmitter<any> = new EventEmitter();
  @Output() resetMapMarkers: EventEmitter<any> = new EventEmitter();
  @Output() onAddItinerary: EventEmitter<any> = new EventEmitter();

  private itineraryDestination: any;
  private newItinerary: Itinerary = new Itinerary;
  private differenceBetweenDates: number;
  private currentCost: number = 0;
  private totalPrice: number = 0;
  private totalTripDuration: number = 0;

  private checked: boolean = false;

  private locationView: string;
  private newAddress: string;
  private selectedCurrency: string = '$';
  private selectedTransport: string = 'plane';
  private namePlaceholder: string = 'Create an itinerary name';
  private locationPlaceholder: string = 'Enter a starting location';

  private itineraryDays: number[] = [];
  private displayableExpenses: any[] = [];
  private accumulatedDailyExpense: number[] = [];
  private dates: any[] = [];
  private costs: number[] = [];

  ngOnInit() {
    this.autoCompleteAddress();
  }

  autoCompleteAddress() {
    const input = document.getElementById('new-address');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
      this.itineraryDestination = autocomplete.getPlace();
      this.locationView = this.itineraryDestination.name;
    });
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
    const newTotalExpense = this.accumulatedDailyExpense.reduce(
      (a, b) => a + b,
      0
    );
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
    if (document.getElementById('new-note')) {
      document.getElementById('new-note')['value'] = '';
    }
    document.getElementById('new-price')['value'] = '';
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
    this.dates.forEach(day => {
      const dayIndex = this.dates.indexOf(day);
      this.differenceBetweenDates =
        Math.abs(
          new Date(this.dates[dayIndex]).getTime() -
            new Date(this.dates[dayIndex - 1]).getTime()
        ) /
        (1000 * 3600 * 24);
      if (!this.differenceBetweenDates) {
        this.differenceBetweenDates = 0;
      }
      this.itineraryDays.push(this.differenceBetweenDates);
    });
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
    this.itineraryDestination.details =
      !this.displayableExpenses.length ? '' : this.displayableExpenses;
  }

  setCurrencyAndTransport() {
    this.itineraryDestination.currency = this.selectedCurrency;
    this.itineraryDestination.transport = this.selectedTransport;
    if (!this.itineraryDestination.transport) this.itineraryDestination.transport = 'plane';  
  }

  setCountryName() {
    const countryStringSplit = this.itineraryDestination.formatted_address.split(',');
    this.itineraryDestination.country = countryStringSplit[countryStringSplit.length - 1];
  }

  setPrice() {
    if (this.accumulatedDailyExpense.length === 0) {
      this.itineraryDestination.price = document.getElementById('new-price')['valueAsNumber'];
      this.currentCost = this.itineraryDestination.price;
    } else {
      this.itineraryDestination.price = this.currentCost;
    }
    if (isNaN(this.itineraryDestination.price)) {
      this.itineraryDestination.price = 0;
    }
    if (isNaN(this.currentCost)) {
      this.currentCost = 0;
    }
    this.costs.push(this.itineraryDestination.price);
    this.getTotalPrice();
  }

  setDates() {
    const variableDate = document.getElementById('new-date')['valueAsDate'];
    const dateLength = variableDate.getMonth();
    const digit = dateLength <= 8 ? '-0' : '-';

    this.itineraryDestination.date =
      variableDate.getFullYear() +
      `${digit}` +
      (variableDate.getMonth() + 1) +
      '-' +
      variableDate.getDate();
    this.itineraryDestination.date.autocomplete;
    this.dates.push(this.itineraryDestination.date);
  }

  setLocations() {
    this.locations.push(this.itineraryDestination);
    this.newItinerary.placesAndDates.push(this.itineraryDestination);
  }

  setItineraryLength() {
    const newFirstDate = [];
    const newSecondDate = [];
    let returnFirstDate;
    let returnSecondDate;

    if (this.dates.length >= 0) {
      this.differenceBetweenDates = Math.round(
        Math.abs(
          new Date(this.dates[this.dates.length - 1]).getTime() -
            new Date(this.dates[this.dates.length - 2]).getTime()
        ) /
          (1000 * 3600 * 24)
      );
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
      this.differenceBetweenDates = Math.round(
        Math.abs(
          new Date(returnFirstDate).getTime() -
            new Date(returnSecondDate).getTime()
        ) /
          (1000 * 3600 * 24)
      );
    }
    this.itineraryDays.push(this.differenceBetweenDates);
    this.getTotalDays();
  }

  sendMarker(address) {
    const exportedValues = {
      address: address,
      name: this.itineraryDestination.name,
      date: this.itineraryDestination.date,
      days: this.itineraryDestination.date,
      transport: this.itineraryDestination.transport,
      country: this.itineraryDestination.country,
      price: this.itineraryDestination.price,
      point: {
        lat: this.itineraryDestination.geometry.location.lat(),
        lng: this.itineraryDestination.geometry.location.lng()
      }
    };
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
    this.locations.forEach(place => {
      this.dates.push(place.date);
    });
    this.updateTotalDays();
    this.getTotalDays();
  }

  adjustItineraryCost() {
    this.costs = [];
    this.locations.forEach(place => {
      this.costs.push(place.price);
    });
    this.getTotalPrice();
  }

  resetValues() {
    const note = document.getElementById('new-note');
    if (note) {
      document.getElementById('new-note')['value'] = '';
    }
    document.getElementById('new-price')['value'] = '';
    this.newAddress = '';
    this.displayableExpenses = [];
    this.accumulatedDailyExpense = [];
    this.namePlaceholder = 'Edit itinerary name';
    this.locationPlaceholder = 'Add a location';
    this.locationView = '';
    this.currentCost = 0;
  }

  toggleNote() {
    this.checked = !this.checked;
  }

  addItinerary() {
    this.newItinerary.placesAndDates.push(this.itineraryDestination); 
    this.onAddItinerary.emit(this.newItinerary);
  }
}
