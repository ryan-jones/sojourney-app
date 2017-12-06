//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RoutingModule } from 'app/app-routes.module';
import { AuthModule } from 'app/auth/auth.module';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileModule } from 'app/dashboard/profiles/profiles.module';
import { CollapseModule } from 'ngx-bootstrap';



//components
import { AppComponent } from './app.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VisaCheckerComponent } from 'app/dashboard/home-dashboard/components/visa-checker/visa-checker.component';
import { ItineraryPlannerComponent } from 'app/dashboard/home-dashboard/components/itinerary-planner/itinerary-planner.component';
import { ItineraryOverViewComponent } from 'app/dashboard/home-dashboard/containers/overview/overview.component';
import { MyFlightsComponent } from 'app/dashboard/home-dashboard/components/flight-checker/flight-checker.component';
import { OverviewNavComponent } from 'app/dashboard/home-dashboard/components/overview-nav/overview-nav.component';

//services
import { WarningService } from './shared/services/warning.service';
import { SessionService } from './shared/services/session.service';
import { UserService } from './shared/services/user.service';
import { FlightService } from 'app/shared/services/flight.service';
import { FlightPathService } from 'app/shared/services/flightPath.service';
import { CountryLayersService } from 'app/shared/services/country-layers.service';
import { VisaCheckerService } from 'app/dashboard/home-dashboard/components/visa-checker/visa-checker.service';




@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    HeaderComponent,
    NotFoundComponent,
    VisaCheckerComponent,
    ItineraryPlannerComponent,
    ItineraryOverViewComponent,
    MyFlightsComponent,
    OverviewNavComponent
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    AuthModule,
    ProfileModule,
    SharedModule,
    CollapseModule
  ],
  providers: [
    CountryLayersService,
    WarningService,
    SessionService,
    UserService,
    FlightService,
    FlightPathService,
    VisaCheckerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
