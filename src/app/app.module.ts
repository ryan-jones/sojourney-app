//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';
import { ProfileModule } from 'app/profiles/profiles.module';
import { RoutingModule } from 'app/app-routes.module';
import { ItinerariesModule } from 'app/itineraries/itineraries.module';
import { AuthModule } from 'app/auth/auth.module';
import { FlightsModule } from 'app/flight-checker/flights.module';

//components
import { AppComponent } from './app.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './template/home-template-wrapper/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

//services
import { CountryService } from './shared/services/country.service';
import { WarningService } from './shared/services/warning.service';
import { SessionService } from './shared/services/session.service';
import { UserService } from './shared/services/user.service';
import { ItineraryService } from './shared/services/itinerary.service';
import { FlightService } from 'app/shared/services/flight.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    HeaderComponent,
    HomeComponent,
    NotFoundComponent
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    AuthModule,
    ProfileModule,
    ItinerariesModule,
    FlightsModule,
    AlertModule.forRoot()
  ],
  providers: [
    CountryService,
    WarningService,
    SessionService,
    UserService,
    ItineraryService,
    FlightService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
