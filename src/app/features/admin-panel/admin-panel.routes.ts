import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { SellerApprovalComponent } from './seller-approvals/seller-approval/seller-approval.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CategoryManagementComponent } from './categories/category-management/category-management.component';

export const ADMIN_PANEL_ROUTES: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'categories', component: CategoryManagementComponent },
      { path: 'seller-approvals', component: SellerApprovalComponent }
    ]
  }
];
