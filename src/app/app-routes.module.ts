import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './template/home-template-wrapper/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NotFoundComponent } from 'app/not-found/not-found.component';
import { MyFlightsComponent } from 'app/flight-checker/my-flights/my-flights.component';
import { MySignupFormComponent } from 'app/auth/my-signup-form/my-signup-form.component';
import { MyLoginComponent } from 'app/auth/my-login/my-login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'itinerary', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'flights', component: MyFlightsComponent },
  { path: 'signup', component: MySignupFormComponent },
  { path: 'login', component: MyLoginComponent },
  {
    path: 'user',
    loadChildren: './profiles/profiles.module#ProfileModule'
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
