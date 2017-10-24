import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AuthRoutes } from "app/auth/auth.routes";

import { MyLoginComponent } from 'app/auth/my-login/my-login.component';
import { MySignupFormComponent } from 'app/auth/my-signup-form/my-signup-form.component';


@NgModule({
  declarations: [MyLoginComponent, MySignupFormComponent],
  imports: [AuthRoutes, SharedModule],
})
export class AuthModule {}
