import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule],
  template: `
    <div class="admin-container">
      <!-- Custom Glass Sidebar -->
      <aside class="glass-sidebar">
        <div class="sidebar-header">
          <div class="logo-icon">
            <i class="pi pi-shield"></i>
          </div>
          <span class="brand-name">ADMIN<span>CORE</span></span>
        </div>

        <nav class="menu-wrapper">
          <p-menu [model]="menuItems" styleClass="custom-admin-menu"></p-menu>
        </nav>

        <div class="sidebar-footer">
           <button class="logout-btn">
             <i class="pi pi-power-off"></i>
             <span>Sign Out</span>
           </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <header class="top-bar glass-card">
           <span class="page-title">Management Console</span>
        </header>
        <section class="content-body">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [`
    /* Ana Layout */
    .admin-container {
      display: flex;
      min-height: 100vh;
      background: radial-gradient(circle at top left, #1e293b, #0f172a);
      color: #f8fafc;
      padding: 1.5rem;
      gap: 1.5rem;
    }

    /* Modern Glass Sidebar */
    .glass-sidebar {
      width: 280px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      padding: 2rem 1rem;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 1rem 2.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      
      .logo-icon {
        background: linear-gradient(135deg, #38bdf8, #818cf8);
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        i { font-size: 1.2rem; color: white; }
      }

      .brand-name {
        font-weight: 800;
        font-size: 1.2rem;
        letter-spacing: 1px;
        span { color: #38bdf8; }
      }
    }

    .menu-wrapper {
      flex: 1;
      padding-top: 2rem;
    }

    /* PrimeNG Menu Override */
    :host ::ng-deep .custom-admin-menu.p-menu {
      background: transparent;
      border: none;
      width: 100%;

      .p-menuitem-link {
        padding: 1rem 1.25rem;
        margin-bottom: 0.5rem;
        border-radius: 12px;
        transition: all 0.2s ease-in-out;

        .p-menuitem-icon { color: #94a3b8; font-size: 1.1rem; }
        .p-menuitem-text { color: #94a3b8; font-weight: 500; }

        &:hover {
          background: rgba(56, 189, 248, 0.08);
          .p-menuitem-text, .p-menuitem-icon { color: #38bdf8; }
        }
      }

      .p-menuitem-link-active {
        background: linear-gradient(90deg, rgba(56, 189, 248, 0.15), transparent) !important;
        border-left: 3px solid #38bdf8;
        .p-menuitem-text, .p-menuitem-icon { color: #38bdf8 !important; }
      }
    }

    /* Content Area */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .top-bar {
      height: 70px;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      .page-title { font-size: 1.1rem; font-weight: 600; color: #cbd5e1; }
    }

    .sidebar-footer {
      padding: 1rem;
      .logout-btn {
        width: 100%;
        padding: 0.8rem;
        border-radius: 12px;
        border: 1px solid rgba(244, 63, 94, 0.2);
        background: rgba(244, 63, 94, 0.05);
        color: #fb7185;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: 0.3s;
        &:hover { background: rgba(244, 63, 94, 0.2); }
      }
    }
  `]
})
export class AdminPanelComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/admin/dashboard' },
    { label: 'Categories', icon: 'pi pi-tags', routerLink: '/admin/categories' },
    { label: 'Seller Approvals', icon: 'pi pi-user-plus', routerLink: '/admin/seller-approvals' },
    { separator: true },
    { label: 'Back to Shop', icon: 'pi pi-home', routerLink: '/' }
  ];
}