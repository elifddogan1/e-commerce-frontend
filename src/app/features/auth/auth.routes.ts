import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from '../../core/guards/auth.guard'; // Guard import edildi

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Giriş Yap | E-Ticaret',
    component: LoginComponent,
    canActivate: [authGuard],
    data: { isAuthPage: true } // Login olanı buradan kovmak için flag
  },
  {
    path: 'register',
    title: 'Kayıt Ol | E-Ticaret',
    component: RegisterComponent,
    canActivate: [authGuard],
    data: { isAuthPage: true }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
