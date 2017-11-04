import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap';
import { SharedModule } from 'app/shared/shared.module';

import { ItineraryPlannerComponent } from 'app/itineraries/itinerary-planner/itinerary-planner.component';
import { VisaCheckerComponent } from 'app/itineraries/visa-checker/visa-checker.component';
import { Routes } from '@angular/router/src';
import { ItineraryOverViewComponent } from 'app/itineraries/overview/overview.component';

@NgModule({
  declarations: [
    VisaCheckerComponent,
    ItineraryPlannerComponent,
    ItineraryOverViewComponent,
  ],
  imports: [SharedModule, CollapseModule.forRoot()],
  exports: [VisaCheckerComponent, ItineraryPlannerComponent, ItineraryOverViewComponent]
})
export class ItinerariesModule {}
