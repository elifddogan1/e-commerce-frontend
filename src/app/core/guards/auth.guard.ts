import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string>;
  const forbiddenRoles = route.data['forbiddenRoles'] as Array<string>;
  const isLoggedIn = authService.isLoggedIn();
  const userRole = authService.getRole()?.toUpperCase() || '';

  // 1. Durum: Giriş Yapılmamışsa
  if (!isLoggedIn) {
    // Eğer gidilecek sayfa özel bir rol gerektiriyorsa (örn: Profil) login'e at
    if (requiredRoles && requiredRoles.length > 0) {
      router.navigate(['/auth/login']);
      return false;
    }
    // Sepet gibi misafire açık sayfalara izin ver
    return true;
  }

  // 2. Durum: Giriş Yapılmışsa

  // Zaten login olan biri tekrar Login/Register sayfasına gidemesin
  if (route.data['isAuthPage']) {
    router.navigate(['/products']);
    return false;
  }

  // Yasaklı Rol Kontrolü (Seller/Admin sepete giremez)
  if (forbiddenRoles && forbiddenRoles.some(role => userRole.includes(role.toUpperCase()))) {
    router.navigate(['/products']);
    return false;
  }

  // Gerekli Rol Kontrolü (Sadece belli bir role açık sayfalar)
  if (requiredRoles && !requiredRoles.some(role => userRole.includes(role.toUpperCase()))) {
    router.navigate(['/products']);
    return false;
  }

  return true;
};
