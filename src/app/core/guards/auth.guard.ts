import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // İlgili rotaya (sayfaya) tanımlanmış özel bir rol gereksinimi var mı?
    const expectedRole = route.data['role'];
    const currentRole = authService.getRole();

    // Beklenen rol varsa ve kullanıcının rolü bunu karşılamıyorsa anasayfaya at
    if (expectedRole && currentRole !== expectedRole) {
       router.navigate(['/']);
       return false;
    }
    return true; // Giriş yapmış ve yetkisi var
  }

  // Giriş yapmamışsa Login sayfasına yönlendir
  router.navigate(['/auth/login']);
  return false;
};
