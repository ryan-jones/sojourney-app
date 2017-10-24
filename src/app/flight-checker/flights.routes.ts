
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { MyFlightsComponent } from "app/flight-checker/my-flights/my-flights.component";

export const flightRoutes: Routes = [
    { path: 'flights', component: MyFlightsComponent },

]
@NgModule({
  imports: [
    RouterModule.forChild(flightRoutes)
  ],
  exports: [RouterModule]
})
export class FlightRoutes {}