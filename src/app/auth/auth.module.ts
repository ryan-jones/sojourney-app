import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { MyLoginComponent } from 'app/auth/my-login/my-login.component';
import { MySignupFormComponent } from 'app/auth/my-signup-form/my-signup-form.component';

@NgModule({
  declarations: [MyLoginComponent, MySignupFormComponent],
  imports: [SharedModule],
  exports: [MyLoginComponent, MySignupFormComponent]
})
export class AuthModule {}
