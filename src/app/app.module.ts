import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from "@angular/router"; //necessary to add on for routers
import { AppComponent } from './app.component';
import { MyHomeComponent } from './my-home/my-home.component';
import { MyAboutComponent } from './my-about/my-about.component';
import {MyLoginComponent} from './my-login/my-login.component';
import { MyNavComponent } from './my-nav/my-nav.component';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {CountryService} from './country.service';
import {WarningService} from './warning.service';
import {SessionService} from './session.service';
import {UserService} from './user.service';
import {ProfileOverviewComponent} from './profile-overview/profile-overview.component';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import { MySignupFormComponent } from './my-signup-form/my-signup-form.component';
import { ProfileCountryVisitComponent } from './profile-country-visit/profile-country-visit.component';
import { ProfileItinerariesComponent } from './profile-itineraries/profile-itineraries.component';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { AlertModule, CollapseModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MyFlightsComponent } from './my-flights/my-flights.component';
import { ItineraryPlannerComponent } from './itinerary-planner/itinerary-planner.component';
import { VisaCheckerComponent } from './visa-checker/visa-checker.component';





const routes: Routes = [
  {path: '' , component: MyHomeComponent},
  {path: 'home', component: MyHomeComponent},
  {path: 'about', component: MyAboutComponent},
  {path: 'signup', component: MySignupFormComponent},
  {path: 'login', component: MyLoginComponent},
  {path: 'user', component: ProfileOverviewComponent},
  {path: 'countries_visited', component: ProfileCountryVisitComponent},
  {path: 'itineraries', component: ProfileItinerariesComponent},
  { path: 'edit', component: ProfileEditComponent },
  {path: 'flights', component: MyFlightsComponent}
  ]



@NgModule({
  declarations: [
    AppComponent,
    MyHomeComponent,
    MyAboutComponent,
    MyLoginComponent,
    MyNavComponent,
    ProfileEditComponent,
    ProfileOverviewComponent,
    MySignupFormComponent,
    ProfileCountryVisitComponent,
    ProfileItinerariesComponent,
    ProfileNavComponent,
    MyFlightsComponent,
    ItineraryPlannerComponent,
    VisaCheckerComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    RouterModule.forRoot(routes),   //  <!-- "routes" is the array defined above
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD0I9Hi4pdArBe7w4bxrZfLTTKfFKp64nw',
      libraries: ["places"]
    }),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot()

  ],
  providers: [CountryService, WarningService, SessionService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
