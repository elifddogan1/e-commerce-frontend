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
    // Eğer sayfa yetki gerektiriyorsa (Örn: Checkout, Satıcı Paneli), Login'e yönlendir
    // queryParams ile gitmek istediği yeri (state.url) kaydediyoruz ki login olunca geri dönebilsin
    if (requiredRoles && requiredRoles.length > 0) {
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    // Yetki gerektirmeyen sayfalara (Sepet, Ürün Detay) izin ver
    return true;
  }

  // --- 2. DURUM: GİRİŞ YAPILMIŞ ---

  // Dinamik Yönlendirme Rotası: Satıcıysa kendi paneline, değilse anasayfaya (ürünlere) at.
  const isSeller = userRole.includes('SELLER');
  const defaultRedirect = isSeller ? '/seller-panel/dashboard' : '/products';

  // Zaten login olan biri Login/Register sayfasına girmeye çalışırsa engelle
  if (isAuthPage) {
    router.navigate([defaultRedirect]);
    return false;
  }

  // Yasaklı Rol Kontrolü (Örn: Satıcı public /products veya /cart sayfasına girmemeli)
  if (forbiddenRoles && forbiddenRoles.some(role => userRole.includes(role.toUpperCase()))) {
    router.navigate([defaultRedirect]);
    return false;
  }

  // Gerekli Rol Kontrolü (Örn: Seller Panel sadece 'SELLER' rolüne açık olmalı)
  if (requiredRoles && !requiredRoles.some(role => userRole.includes(role.toUpperCase()))) {
    router.navigate([defaultRedirect]);
    return false;
  }

  return true;
};