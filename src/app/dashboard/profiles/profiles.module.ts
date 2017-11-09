import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from '../profiles/profiles.routes';
import { TabsModule } from 'ngx-bootstrap';
import { SharedModule } from 'app/shared/shared.module';

//components

import { ProfileEditComponent } from '../profiles/containers/profile-edit/profile-edit.component';
import { ProfileOverviewComponent } from '../profiles/components/profile-overview/profile-overview.component';
import { ProfileComponent } from '../profiles/components/profile/profile.component';
import { ProfileCountryVisitComponent } from '../profiles/components/profile-country-visit/profile-country-visit.component';
import { ProfileItinerariesComponent } from '../profiles/containers/profile-itineraries/profile-itineraries.component';
import { ProfileNavComponent } from '../profiles/components/profile-nav/profile-nav.component';


@NgModule({
  declarations: [
    ProfileEditComponent,
    ProfileOverviewComponent,
    ProfileComponent,
    ProfileCountryVisitComponent,
    ProfileItinerariesComponent,
    ProfileNavComponent,
  ],
  imports: [ProfileRoutingModule, TabsModule, SharedModule],
})
export class ProfileModule {}
