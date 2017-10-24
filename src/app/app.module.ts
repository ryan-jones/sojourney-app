//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';
import { ProfileModule } from 'app/profiles/profiles.module';
import { RoutingModule } from 'app/app-routes.module';
import { ItinerariesModule } from 'app/itineraries/itineraries.module';

//components
import { AppComponent } from './app.component';
import { MyAboutComponent } from './my-about/my-about.component';
import { MyNavComponent } from './my-nav/my-nav.component';
import { MyFlightsComponent } from './my-flights/my-flights.component';
import { HomeComponent } from './template/home-template-wrapper/home.component';
import { NotFoundComponent } from './not-found/not-found.component';


//services
import { CountryService } from './shared/services/country.service';
import { WarningService } from './shared/services/warning.service';
import { SessionService } from './shared/services/session.service';
import { UserService } from './shared/services/user.service';
import { ItineraryService } from 'app/shared/services/itinerary.service';

@NgModule({
  declarations: [
    AppComponent,
    MyAboutComponent,
    MyNavComponent,
    MyFlightsComponent,
    HomeComponent,
    NotFoundComponent,
],
  imports: [
    BrowserModule,
    RoutingModule,
    ProfileModule,
    ItinerariesModule,
    AlertModule.forRoot(),
  ],
  providers: [CountryService, WarningService, SessionService, UserService, ItineraryService],
  bootstrap: [AppComponent]
})
export class AppModule {}
