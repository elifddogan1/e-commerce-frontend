import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  private authService = inject(AuthService);

  menuItems: MenuItem[] = [
    {
      label: 'ANALİZ',
      items: [
        { label: 'İstatistikler', icon: 'pi pi-chart-bar', routerLink: '/admin/dashboard' }
      ]
    },
    {
      label: 'YÖNETİM',
      items: [
        { label: 'Kategoriler', icon: 'pi pi-tags', routerLink: '/admin/categories' },
        { label: 'Satıcı Onayları', icon: 'pi pi-user-plus', routerLink: '/admin/seller-approvals' },
        { label: 'Kullanıcı Listesi', icon: 'pi pi-users', routerLink: '/admin/users' }
      ]
    },
    {
      label: 'DİĞER',
      items: [
        { label: 'Mağazaya Dön', icon: 'pi pi-home', routerLink: '/' }
      ]
    }
  ];

  logout() {
    this.authService.logout();
  }
}