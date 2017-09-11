//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AlertModule, CollapseModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';

//components
import { AppComponent } from './app.component';
import { MyHomeViewComponent } from './my-home/my-home.component';
import { MyAboutComponent } from './my-about/my-about.component';
import { MyLoginComponent } from './my-login/my-login.component';
import { MyNavComponent } from './my-nav/my-nav.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { MySignupFormComponent } from './my-signup-form/my-signup-form.component';
import { ProfileCountryVisitComponent } from './profile-country-visit/profile-country-visit.component';
import { ProfileItinerariesComponent } from './profile-itineraries/profile-itineraries.component';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { MyFlightsComponent } from './my-flights/my-flights.component';
import { ItineraryPlannerComponent } from './itinerary-planner/itinerary-planner.component';
import { VisaCheckerComponent } from './visa-checker/visa-checker.component';
import { HomeComponent } from './containers/home/home.component';


//services
import { CountryService } from './shared/services/country.service';
import { WarningService } from './shared/services/warning.service';
import { SessionService } from './shared/services/session.service';
import { UserService } from './shared/services/user.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: MyAboutComponent },
  { path: 'signup', component: MySignupFormComponent },
  { path: 'login', component: MyLoginComponent },
  {
    path: 'user',
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

  { path: 'flights', component: MyFlightsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MyHomeViewComponent,
    MyAboutComponent,
    MyLoginComponent,
    MyNavComponent,
    ProfileEditComponent,
    ProfileOverviewComponent,
    MySignupFormComponent,
    ProfileComponent,
    ProfileCountryVisitComponent,
    ProfileItinerariesComponent,
    ProfileNavComponent,
    MyFlightsComponent,
    ItineraryPlannerComponent,
    VisaCheckerComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    RouterModule.forRoot(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD0I9Hi4pdArBe7w4bxrZfLTTKfFKp64nw',
      libraries: ['places']
    }),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot()
  ],
  providers: [CountryService, WarningService, SessionService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {}
