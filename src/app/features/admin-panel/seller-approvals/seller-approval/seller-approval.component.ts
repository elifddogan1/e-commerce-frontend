import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-seller-approval',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './seller-approval.component.html',
  styleUrl: './seller-approval.component.scss'
})
export class SellerApprovalComponent implements OnInit {
  private adminService = inject(AdminService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  pendingSellers: any[] = [];
  loading: boolean = true;

  ngOnInit() {
    this.loadPendingSellers();
  }

  loadPendingSellers() {
    this.loading = true;
    this.adminService.getPendingSellers().subscribe({
      next: (data) => {
        this.pendingSellers = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approveSeller(userId: string) {
    this.adminService.approveSeller(userId).subscribe({
      next: (msg) => {
        this.messageService.add({ severity: 'success', summary: 'Onaylandı', detail: msg });
        this.loadPendingSellers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Satıcı onaylanamadı.' });
      }
    });
  }

  deactivateSeller(userId: string) {
    this.adminService.deactivateSeller(userId).subscribe({
      next: (msg) => {
        this.messageService.add({ severity: 'warn', summary: 'Reddedildi', detail: msg });
        this.loadPendingSellers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız.' });
      }
    });
  }
}