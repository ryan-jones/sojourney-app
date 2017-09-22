import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './containers/home/home.component';
import { MyAboutComponent } from './my-about/my-about.component';
import { MyLoginComponent } from './my-login/my-login.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { MySignupFormComponent } from './my-signup-form/my-signup-form.component';
import { ProfileCountryVisitComponent } from './profile-country-visit/profile-country-visit.component';
import { ProfileItinerariesComponent } from './profile-itineraries/profile-itineraries.component';
import { MyFlightsComponent } from './my-flights/my-flights.component';
import { NotFoundComponent } from 'app/not-found/not-found.component';
import { SessionService } from "app/shared/services/session.service";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: MyAboutComponent },
  { path: 'signup', component: MySignupFormComponent },
  { path: 'login', component: MyLoginComponent },
  {
    path: 'user', canActivate: [SessionService],
    component: ProfileComponent,
    children: [
      { path: ':id', component: ProfileOverviewComponent },
      {
        path: ':id/countries_visited',
        component: ProfileCountryVisitComponent
      },
      { path: ':id/itineraries', component: ProfileItinerariesComponent },
      { path: ':id/edit', component: ProfileEditComponent }
    ]
  },
  { path: 'flights', component: MyFlightsComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {}
