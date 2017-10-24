import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { MyFlightsComponent } from 'app/flight-checker/my-flights/my-flights.component';
import { FlightRoutes } from 'app/flight-checker/flights.routes';

@NgModule({
  declarations: [MyFlightsComponent],
  imports: [FlightRoutes, SharedModule]
})
export class FlightsModule {}
