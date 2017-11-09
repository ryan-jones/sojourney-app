import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import {
  Itinerary,
  Destination,
  Expense
} from 'app/shared/models/itinerary.model';
import {
  createCountryName,
  calculateDateRange,
  aggregate,
  updateDateRange,
  buildAutocomplete,
} from 'app/utils';
import { FlightPathBuilder } from 'app/builders/flightPath.builder';
import { FlightPathService } from 'app/shared/services/flightPath.service';

@Component({
  selector: 'itinerary-planner',
  templateUrl: './itinerary-planner.component.html',
  styleUrls: ['./itinerary-planner.component.scss']
})
export class ItineraryPlannerComponent implements AfterViewInit {
  constructor(private flightPathService: FlightPathService) {}

  @ViewChild('address') addressInput;
  @Input() locations: any;
  @Output() createMarker: EventEmitter<any> = new EventEmitter();
  @Output() onAddItinerary: EventEmitter<Itinerary> = new EventEmitter<Itinerary>();

  private itineraryDestination: Destination = new Destination();
  private newItinerary: Itinerary = new Itinerary();
  private differenceBetweenDates: number;
  private currentCost: number = 0;
  private totalPrice: number = 0;
  private totalTripDuration: number = 0;

  private checked: boolean = false;
  private isCollapsed: boolean = false;

  private namePlaceholder: string = 'Create an itinerary name';
  private locationPlaceholder: string = 'Enter a starting location';
  private arrow: string;

  private itineraryDays: number[] = [];
  private displayableExpenses: Expense[] = [];
  private accumulatedDailyExpense: number[] = [];
  private dates: string[] = [];
  private costs: number[] = [];

  //itinerary planner inputs
  private newPrice: number;
  private newAddress: string;
  private newNote: string = '';
  private autocomplete: any;

  ngAfterViewInit() {
    this.autoCompleteAddress();
    this.checkCollapsed();
  }

  autoCompleteAddress(): void {
    const input = this.addressInput.nativeElement;
    this.autocomplete = buildAutocomplete(input);
    this.addAutoComplete();
  }

  addAutoComplete(){
    this.autocomplete.addListener('place_changed', () => {
    this.itineraryDestination.geoLocation = this.autocomplete.getPlace();
  });
  }

  //adds expense to a single destination in the itinerary
  addExpense(): void {
    const newTotalExpense = this.createNewExpense();
    this.createCurrentCost(newTotalExpense);
  }

  //deletes expense from current destination
  deleteExpense(): void {
    this.displayableExpenses.pop();
    this.accumulatedDailyExpense.pop();
    const newTotalExpense = aggregate(this.accumulatedDailyExpense);
    this.createCurrentCost(newTotalExpense);
  }

  createNewExpense(): number {
    const newestExpense: Expense = {
      note: this.newNote,
      expense: this.newPrice,
      transport: this.itineraryDestination.transport
    };
    this.displayableExpenses.push(newestExpense);
    this.accumulatedDailyExpense.push(newestExpense.expense);
    return aggregate(this.accumulatedDailyExpense);
  }

  createCurrentCost(newTotalExpense: number): void {
    this.newNote = '';
    this.newPrice = null;
    this.currentCost = !newTotalExpense ? 0 : newTotalExpense;
  }

  getTotalPrice(): void {
    this.totalPrice = aggregate(this.costs);
  }

  getTotalDays(): void {
    this.totalTripDuration = aggregate(this.itineraryDays);
  }

  updateTotalDays(): void {
    this.dates.forEach(day => {
      const dayIndex = this.dates.indexOf(day);
      this.differenceBetweenDates = updateDateRange(this.dates, dayIndex);
      if (!this.differenceBetweenDates) this.differenceBetweenDates = 0;
      this.itineraryDays.push(this.differenceBetweenDates);
      this.itineraryDestination.days = this.differenceBetweenDates;
    });
  }

  //**********************Create a new marker and flightPath******************* */
  createPoint(): void {
    this.setPlaceDetails();
    this.setCountryName();
    this.setPrice();
    this.setLocations();
    this.setDates();
    this.setItineraryLength();
    this.sendMarker();
    this.resetValues();
  }

  setPlaceDetails(): void {
    this.itineraryDestination.details = !this.displayableExpenses.length
      ? ''
      : this.displayableExpenses;
  }

  setCountryName(): void {
    this.itineraryDestination.country = createCountryName(
      this.itineraryDestination
    );
  }

  setPrice(): void {
    if (this.accumulatedDailyExpense.length === 0) {
      this.itineraryDestination.price = this.newPrice ? this.newPrice : 0;
      this.currentCost = this.itineraryDestination.price;
    } else {
      this.itineraryDestination.price = this.currentCost;
    }
    this.costs.push(this.itineraryDestination.price);
    this.getTotalPrice();
  }

  setDates(): void {
    this.dates.push(this.itineraryDestination.date);
  }

  setLocations(): void {
    this.locations.push(this.itineraryDestination);
    this.newItinerary.placesAndDates.push(this.itineraryDestination);
  }

  setItineraryLength(): void {
    this.differenceBetweenDates = calculateDateRange(this.dates);
    this.itineraryDays.push(this.differenceBetweenDates);
    this.itineraryDestination.days = this.differenceBetweenDates;
    this.getTotalDays();
  }

  sendMarker(): void {
    const exportedValues = FlightPathBuilder.buildFlightPath(
      this.itineraryDestination
    );
    this.createMarker.emit(exportedValues);
  }

  deletePoint(locationInput: Destination): void {
    this.flightPathService.resetMapValues(locationInput);
    this.adjustDates();
    this.adjustItineraryCost();
  }

  adjustDates(): void {
    this.dates = [];
    this.itineraryDays = [];
    this.locations.forEach(place => {
      this.dates.push(place.date);
    });
    this.updateTotalDays();
    this.getTotalDays();
  }

  adjustItineraryCost(): void {
    this.costs = [];
    this.locations.forEach(place => {
      this.costs.push(place.price);
    });
    this.getTotalPrice();
  }

  resetValues(): void {
    this.newNote = '';
    this.newPrice = null;
    this.newAddress = '';
    this.displayableExpenses = [];
    this.accumulatedDailyExpense = [];
    this.namePlaceholder = 'Edit itinerary name';
    this.locationPlaceholder = 'Add a location';
    this.currentCost = 0;
    this.itineraryDestination = new Destination();
  }

  toggleNote(): void {
    this.checked = !this.checked;
  }

  addItinerary(): void {
    this.newItinerary.placesAndDates.push(this.itineraryDestination);
    this.onAddItinerary.emit(this.newItinerary);
  }

  checkCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.arrow = !this.isCollapsed ? '>' : 'v';
  }
}
