
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { MySignupFormComponent } from 'app/auth/my-signup-form/my-signup-form.component';
import { MyLoginComponent } from 'app/auth/my-login/my-login.component';

const authRoutes: Routes = [
  { path: 'signup', component: MySignupFormComponent },
  { path: 'login', component: MyLoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [RouterModule]
})

export class AuthRoutes {}