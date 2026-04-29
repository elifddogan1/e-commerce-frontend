import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // route.data içinden meta verileri alıyoruz
  const requiredRoles = route.data['requiredRoles'] as Array<string>;
  const forbiddenRoles = route.data['forbiddenRoles'] as Array<string>;
  const isAuthPage = route.data['isAuthPage'] as boolean;

  const isLoggedIn = authService.isLoggedIn();
  const userRole = authService.getRole()?.toUpperCase() || '';

  // --- 1. DURUM: GİRİŞ YAPILMAMIŞ (MİSAFİR) ---
  if (!isLoggedIn) {
    // Eğer sayfa yetki gerektiriyorsa (Örn: Checkout, Profil), Login'e yönlendir
    // queryParams ile gitmek istediği yeri (state.url) kaydediyoruz ki login olunca geri dönebilsin
    if (requiredRoles && requiredRoles.length > 0) {
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    // Yetki gerektirmeyen sayfalara (Sepet, Ürün Detay) izin ver
    return true;
  }

  // --- 2. DURUM: GİRİŞ YAPILMIŞ ---

  // Zaten login olan biri Login/Register sayfasına girmeye çalışırsa engelle
  if (isAuthPage) {
    router.navigate(['/products']);
    return false;
  }

  // Yasaklı Rol Kontrolü (Örn: Satıcı veya Admin sepete girmemeli)
  if (forbiddenRoles && forbiddenRoles.some(role => userRole.includes(role.toUpperCase()))) {
    router.navigate(['/products']);
    return false;
  }

  // Gerekli Rol Kontrolü (Örn: Checkout sadece 'USER' rolüne açık olmalı)
  if (requiredRoles && !requiredRoles.some(role => userRole.includes(role.toUpperCase()))) {
    router.navigate(['/products']); // Yetkisi yoksa anasayfaya at
    return false;
  }

  return true;
};
