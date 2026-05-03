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
  const rawRole = authService.getRole();
  
  // Rolü string'e çeviriyoruz (Spring Boot'tan 'ROLE_ADMIN' veya [{authority: 'ROLE_ADMIN'}] gelebilir)
  const userRole = (typeof rawRole === 'string' 
    ? rawRole 
    : JSON.stringify(rawRole || '')
  ).toUpperCase();

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

  // ÇÖZÜM: Her rol için doğru varsayılan yönlendirme adresini belirliyoruz.
  let defaultRedirect = '/products'; // Normal USER için varsayılan

  if (userRole.includes('SELLER')) {
    defaultRedirect = '/seller-panel/dashboard';
  } else if (userRole.includes('ADMIN')) {
    // Admin yetkisine sahip kullanıcılar için varsayılan rotayı Admin Paneli yapıyoruz.
    // Not: Admin modülündeki anasayfa rotan neyse ona göre burayı güncelleyebilirsin (örn: '/admin')
    defaultRedirect = '/admin/dashboard';
  }

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