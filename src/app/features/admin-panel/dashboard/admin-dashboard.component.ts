import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AdminService, DashboardStats } from '../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="dashboard-container">
      <h1 class="page-title">Dashboard Overview</h1>
      
      <div class="stats-grid" *ngIf="stats">
        <p-card class="stat-card total-users">
          <div class="stat-content">
            <div class="stat-icon"><i class="pi pi-users"></i></div>
            <div class="stat-details">
              <span class="label">Total Users</span>
              <span class="value">{{stats.totalUsers}}</span>
            </div>
          </div>
        </p-card>

        <p-card class="stat-card total-sellers">
          <div class="stat-content">
            <div class="stat-icon"><i class="pi pi-briefcase"></i></div>
            <div class="stat-details">
              <span class="label">Total Sellers</span>
              <span class="value">{{stats.totalSellers}}</span>
            </div>
          </div>
        </p-card>

        <p-card class="stat-card pending-sellers">
          <div class="stat-content">
            <div class="stat-icon"><i class="pi pi-user-plus"></i></div>
            <div class="stat-details">
              <span class="label">Pending Approvals</span>
              <span class="value text-amber-500">{{stats.pendingSellers}}</span>
            </div>
          </div>
        </p-card>

        <p-card class="stat-card total-orders">
          <div class="stat-content">
            <div class="stat-icon"><i class="pi pi-shopping-cart"></i></div>
            <div class="stat-details">
              <span class="label">Total Orders</span>
              <span class="value">{{stats.totalOrders}}</span>
            </div>
          </div>
        </p-card>

        <p-card class="stat-card total-products">
          <div class="stat-content">
            <div class="stat-icon"><i class="pi pi-box"></i></div>
            <div class="stat-details">
              <span class="label">Active Products</span>
              <span class="value">{{stats.totalProducts}}</span>
            </div>
          </div>
        </p-card>
      </div>

      <div class="charts-container mt-8">
        <!-- Future: Add charts here -->
        <p-card class="glass-card welcome-card">
           <h2>Welcome back, Admin!</h2>
           <p>Everything is looking good today. You have <strong>{{stats?.pendingSellers}}</strong> sellers waiting for your approval.</p>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      animation: fadeIn 0.5s ease-out;
    }
    .page-title {
      color: #fff;
      font-size: 2rem;
      margin-bottom: 2rem;
      font-weight: 700;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .stat-card {
      ::ng-deep .p-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        transition: transform 0.3s ease;
        &:hover {
          transform: translateY(-5px);
          border-color: rgba(56, 189, 248, 0.3);
        }
      }
    }
    .stat-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(56, 189, 248, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 1.5rem;
        color: #38bdf8;
      }
    }
    .stat-details {
      display: flex;
      flex-direction: column;
      .label {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .value {
        color: #fff;
        font-size: 1.5rem;
        font-weight: 700;
      }
    }
    .welcome-card {
      h2 { color: #38bdf8; margin-top: 0; }
      p { color: rgba(255, 255, 255, 0.7); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats?: DashboardStats;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe(data => {
      this.stats = data;
      this.cdr.detectChanges();
    });
  }
}
