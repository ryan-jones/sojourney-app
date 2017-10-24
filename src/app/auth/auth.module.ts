import { NgModule } from '@angular/core';
import { MyLoginComponent } from 'app/auth/my-login/my-login.component';
import { MySignupFormComponent } from 'app/auth/my-signup-form/my-signup-form.component';
import { Routes, RouterModule } from '@angular/router';

export const authRoutes: Routes = [
  { path: 'signup', component: MySignupFormComponent },
  { path: 'login', component: MyLoginComponent },
]
@NgModule({
  declarations: [MyLoginComponent, MySignupFormComponent],
  imports: [RouterModule.forChild(authRoutes)],
  exports: [authRoutes]
})
export class AuthModule {}
