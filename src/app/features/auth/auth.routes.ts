import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Giriş Yap | E-Ticaret',
    component: LoginComponent
  },
  {
    path: 'register',
    title: 'Kayıt Ol | E-Ticaret',
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
