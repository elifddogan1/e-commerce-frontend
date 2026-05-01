import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { CategoryManagementComponent } from './categories/category-management.component';
import { SellerApprovalComponent } from './seller-approvals/seller-approval.component';

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
