import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


import { ProfileComponent } from '../profiles/components/profile/profile.component';
import { ProfileOverviewComponent } from '../profiles/components/profile-overview/profile-overview.component';
import { ProfileCountryVisitComponent } from '../profiles/components/profile-country-visit/profile-country-visit.component';
import { ProfileItinerariesComponent } from '../profiles/containers/profile-itineraries/profile-itineraries.component';
import { ProfileEditComponent } from '../profiles/containers/profile-edit/profile-edit.component';
import { SessionService } from 'app/shared/services/session.service';

export const profileRoutes: Routes = [
  {
    path: '',
    canActivate: [SessionService],
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(profileRoutes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
