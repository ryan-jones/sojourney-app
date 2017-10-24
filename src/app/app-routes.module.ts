import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './template/home-template-wrapper/home.component';
import { MyAboutComponent } from './my-about/my-about.component';
import { NotFoundComponent } from 'app/not-found/not-found.component';
import { MyFlightsComponent } from 'app/flight-checker/my-flights/my-flights.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: MyAboutComponent },
  { path: 'flights', component: MyFlightsComponent },
  
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {}