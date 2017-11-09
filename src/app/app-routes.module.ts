import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NotFoundComponent } from 'app/not-found/not-found.component';
import { MyFlightsComponent } from 'app/dashboard/home-dashboard/components/flight-checker/flight-checker.component';
import { MySignupFormComponent } from 'app/auth/my-signup-form/my-signup-form.component';
import { MyLoginComponent } from 'app/auth/my-login/my-login.component';
import { ItineraryOverViewComponent } from 'app/dashboard/home-dashboard/containers/overview/overview.component';
import { SessionService } from "app/shared/services/session.service";
import { VisaCheckerComponent } from "app/dashboard/home-dashboard/components/visa-checker/visa-checker.component";
import { ItineraryPlannerComponent } from "app/dashboard/home-dashboard/components/itinerary-planner/itinerary-planner.component";

const routes: Routes = [
  {
    path: '',
    component: ItineraryOverViewComponent,
    children: [
      { path: '', component: ItineraryPlannerComponent},
      { path: 'visas', component: VisaCheckerComponent },
      {
        path: 'itinerary',
        component: ItineraryPlannerComponent
      },
      { path: 'flights', component: MyFlightsComponent },
    ]
  },
  { path: 'about', component: AboutUsComponent },
  { path: 'signup', component: MySignupFormComponent },
  { path: 'login', component: MyLoginComponent },
  {
    path: 'user',
    loadChildren: './dashboard/profiles/profiles.module#ProfileModule'
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class RoutingModule {}
