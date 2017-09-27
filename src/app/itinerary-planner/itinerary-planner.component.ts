import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { Itinerary, Destination } from 'app/shared/itinerary.model';
import {
  Expense,
  ItineraryService
} from 'app/shared/services/itinerary.service';

declare var google: any;

@Component({
  selector: 'itinerary-planner',
  templateUrl: './itinerary-planner.component.html',
  styleUrls: ['./itinerary-planner.component.scss']
})
export class ItineraryPlannerComponent implements AfterViewInit {
  constructor(private itineraryService: ItineraryService) {}

  @ViewChild('address') addressInput;
  @Input() locations: any;
  @Output() changeAddress: EventEmitter<any> = new EventEmitter();
  @Output() createMarker: EventEmitter<any> = new EventEmitter();
  @Output() resetMapMarkers: EventEmitter<any> = new EventEmitter();
  @Output() onAddItinerary: EventEmitter<any> = new EventEmitter();

  private itineraryDestination: Destination = new Destination;
  private newItinerary: Itinerary = new Itinerary();
  private differenceBetweenDates: number;
  private currentCost: number = 0;
  private totalPrice: number = 0;
  private totalTripDuration: number = 0;

  private checked: boolean = false;


  private namePlaceholder: string = 'Create an itinerary name';
  private locationPlaceholder: string = 'Enter a starting location';

  private itineraryDays: number[] = [];
  private displayableExpenses: Expense[] = [];
  private accumulatedDailyExpense: number[] = [];
  private dates: any[] = [];
  private costs: number[] = [];

  //itinerary planner inputs
  private newPrice: number;
  private newAddress: string;
  private newNote: string = '';

  ngAfterViewInit() {
    this.autoCompleteAddress();
  }

  autoCompleteAddress() {
    const input = this.addressInput.nativeElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
      this.itineraryDestination.geoLocation = autocomplete.getPlace();
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

  createNewExpense():number {
    const newestExpense: Expense = {
      note: this.newNote,
      expense: this.newPrice,
      transport: this.itineraryDestination.transport
    };
    this.displayableExpenses.push(newestExpense);
    this.accumulatedDailyExpense.push(newestExpense.expense);
    return this.accumulatedDailyExpense.reduce((a, b) => a + b, 0);
  }

  createCurrentCost(newTotalExpense):void {
    this.newNote = '';
    this.newPrice = null;
    this.currentCost = (!newTotalExpense ? 0 : newTotalExpense)
  }

  getTotalPrice():void {
    this.totalPrice = this.costs.reduce((a, b) => a + b, 0);
  }

  getTotalDays():void {
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
    this.setCountryName();
    this.setPrice();
    this.setLocations();
    this.setDates();
    this.setItineraryLength();
    this.sendMarker(this.newAddress);
    this.resetValues();
  }

  setPlaceDetails() {
    this.itineraryDestination.details = !this.displayableExpenses.length
      ? ''
      : this.displayableExpenses;
  }


  setCountryName() {
    const countryStringSplit = this.itineraryDestination.geoLocation.formatted_address.split(
      ','
    );
    this.itineraryDestination.country =
      countryStringSplit[countryStringSplit.length - 1];
  }

  setPrice() {
    if (this.accumulatedDailyExpense.length === 0) {
      this.itineraryDestination.price = this.newPrice;
      this.currentCost = this.newPrice;
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
      this.differenceBetweenDates = this.itineraryService.calculateDateRange(
        this.dates
      );
      if (!this.differenceBetweenDates) {
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
    const exportedValues = this.itineraryService.buildExportValue(
      address,
      this.itineraryDestination
    );
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
    this.newNote = '';
    this.newPrice = null;
    this.newAddress = '';
    this.displayableExpenses = [];
    this.accumulatedDailyExpense = [];
    this.namePlaceholder = 'Edit itinerary name';
    this.locationPlaceholder = 'Add a location';
    this.currentCost = 0;
    this.itineraryDestination = new Destination;
  }

  toggleNote() {
    this.checked = !this.checked;
  }

  addItinerary() {
    this.newItinerary.placesAndDates.push(this.itineraryDestination);
    this.onAddItinerary.emit(this.newItinerary);
  }
}
