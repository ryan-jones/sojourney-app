import { Component,OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'itinerary-planner',
  templateUrl: './itinerary-planner.component.html'
})

export class ItineraryPlannerComponent implements OnInit {

  constructor() {}

  namePlaceholder: string;
  locationPlaceholder: string;

  @Output() changeAddress: EventEmitter<any> = new EventEmitter;

  ngOnInit() {
    this.namePlaceholder = "Create an itinerary name"
    this.locationPlaceholder = "Enter a starting location";
  }

  newAddress(event) {
    this.changeAddress.emit(event);
  }

}
