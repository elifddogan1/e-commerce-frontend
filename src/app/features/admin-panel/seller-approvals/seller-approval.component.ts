import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-seller-approval',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="seller-approval-container">
      <h1 class="page-title">Pending Seller Approvals</h1>

      <p-table [value]="pendingSellers" [rows]="10" [paginator]="true" styleClass="p-datatable-glass mt-4">
        <ng-template pTemplate="header">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Store Name</th>
            <th>Joined At</th>
            <th style="width: 250px">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-seller>
          <tr>
            <td>{{seller.firstName}} {{seller.lastName}}</td>
            <td>{{seller.email}}</td>
            <td>{{seller.store?.name || 'N/A'}}</td>
            <td>{{seller.createdAt | date:'medium'}}</td>
            <td>
              <div class="flex gap-2">
                <p-button label="Approve" icon="pi pi-check" severity="success" [rounded]="true" [text]="true" (onClick)="approveSeller(seller.id)"></p-button>
                <p-button label="Decline" icon="pi pi-times" severity="danger" [rounded]="true" [text]="true" (onClick)="deactivateSeller(seller.id)"></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="5" class="text-center p-5">
              <span class="text-gray-400">No pending seller registrations found.</span>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
    <p-toast></p-toast>
  `,
  styles: [`
    .page-title { color: #fff; font-size: 2rem; margin-bottom: 2rem; font-weight: 700; }
    :host ::ng-deep {
      .p-datatable-glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        
        .p-datatable-thead > tr > th {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .p-datatable-tbody > tr {
          background: transparent;
          color: #fff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          &:hover { background: rgba(255, 255, 255, 0.02); }
        }
      }
    }
  `]
})
export class SellerApprovalComponent implements OnInit {
  pendingSellers: any[] = [];

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadPendingSellers();
  }

  loadPendingSellers() {
    this.adminService.getPendingSellers().subscribe(data => {
      this.pendingSellers = data;
      this.cdr.detectChanges();
    });
  }

  approveSeller(userId: string) {
    this.adminService.approveSeller(userId).subscribe({
      next: (msg) => {
        this.messageService.add({ severity: 'success', summary: 'Approved', detail: msg });
        this.loadPendingSellers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve seller' });
      }
    });
  }

  deactivateSeller(userId: string) {
    this.adminService.deactivateSeller(userId).subscribe({
      next: (msg) => {
        this.messageService.add({ severity: 'warn', summary: 'Deactivated', detail: msg });
        this.loadPendingSellers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to deactivate seller' });
      }
    });
  }
}
