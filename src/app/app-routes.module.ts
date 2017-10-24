import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './template/home-template-wrapper/home.component';
import { MyAboutComponent } from './my-about/my-about.component';
import { MyFlightsComponent } from './my-flights/my-flights.component';
import { NotFoundComponent } from 'app/not-found/not-found.component';
import { SessionService } from "app/shared/services/session.service";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
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