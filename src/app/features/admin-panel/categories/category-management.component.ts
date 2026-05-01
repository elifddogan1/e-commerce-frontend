import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CategoryService, Category } from '../services/category.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, FormsModule, ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="category-container">
      <div class="header">
        <h1 class="page-title">Category Management</h1>
        <button class="add-btn" (click)="showAddDialog()">
          <i class="pi pi-plus"></i>
          Add Category
        </button>
      </div>

      <p-table [value]="categories" [rows]="10" [paginator]="true" styleClass="p-datatable-glass mt-4">
        <ng-template pTemplate="header">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Parent</th>
            <th style="width: 150px">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-category>
          <tr>
            <td>{{category.name}}</td>
            <td>{{category.description}}</td>
            <td>{{getCategoryName(category.parentId)}}</td>
            <td>
              <div class="flex gap-2">
                <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [text]="true" (onClick)="deleteCategory(category.id)"></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog [(visible)]="displayDialog" [header]="'Add New Category'" [modal]="true" [style]="{width: '450px'}" styleClass="glass-dialog">
        <div class="glass-form">
          <div class="field">
            <label for="name">Name</label>
            <input pInputText id="name" [(ngModel)]="newCategory.name" class="custom-glass-input" placeholder="Kategori adı..." />
          </div>

          <div class="field">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              [(ngModel)]="newCategory.description" 
              class="custom-glass-input" 
              rows="4" 
              placeholder="Açıklama yazın...">
            </textarea>
          </div>

          <div class="field">
            <label for="parent">Parent Category</label>
            <div class="select-wrapper">
              <select id="parent" [(ngModel)]="newCategory.parentId" class="custom-glass-input">
                <option [value]="undefined">None (Main Category)</option>
                <option *ngFor="let cat of mainCategories" [value]="cat.id">
                  {{cat.name}}
                </option>
              </select>
              <i class="pi pi-chevron-down"></i>
            </div>
          </div>
        </div>
        
        <ng-template pTemplate="footer">
          <div class="dialog-footer">
            <p-button label="Cancel" icon="pi pi-times" [text]="true" (onClick)="displayDialog = false" styleClass="p-button-secondary"></p-button>
            <button class="save-btn" (click)="saveCategory()">
              <i class="pi pi-check"></i> Save Category
            </button>
          </div>
        </ng-template>
      </p-dialog>
    </div>
    <p-toast></p-toast>
  `,
  styles: [`
    .category-container { padding: 1rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-title { color: #fff; font-size: 2rem; margin: 0; font-weight: 700; letter-spacing: -1px; }

    /* Custom Buttons */
    .add-btn, .save-btn {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4); }
    }

    /* Glass Form Elements */
    .glass-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      label { color: rgba(255, 255, 255, 0.7); font-size: 0.9rem; font-weight: 500; margin-left: 4px; }
    }

    .custom-glass-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 12px;
      padding: 12px 15px;
      color: white !important;
      font-family: inherit;
      transition: all 0.3s ease;
      outline: none;
      &:focus { border-color: #38bdf8 !important; background: rgba(255, 255, 255, 0.1) !important; }
    }

    textarea.custom-glass-input { resize: none; }

    /* Custom Dropdown Wrapper */
    .select-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      select { appearance: none; cursor: pointer; option { background: #1e293b; color: white; } }
      i { position: absolute; right: 15px; pointer-events: none; color: #38bdf8; font-size: 0.8rem; }
    }

    /* Table Glass Styling */
    :host ::ng-deep {
      .p-datatable-glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        
        .p-datatable-thead > tr > th {
          background: rgba(255, 255, 255, 0.05);
          color: #38bdf8;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.2rem;
        }
        .p-datatable-tbody > tr {
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          &:hover { background: rgba(255, 255, 255, 0.02); }
        }
      }

      /* Dialog Styling */
      .glass-dialog .p-dialog-content {
        background: #0f172a; /* Koyu arka plan çakışmayı önler */
        color: white;
      }
      .glass-dialog .p-dialog-header {
        background: #1e293b;
        color: white;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
    }

    .dialog-footer { display: flex; justify-content: flex-end; gap: 1rem; align-items: center; }
  `]
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  mainCategories: Category[] = [];
  displayDialog = false;
  newCategory: Category = { name: '' };

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
      this.mainCategories = data.filter(c => !c.parentId);
      this.cdr.detectChanges();
    });
  }

  showAddDialog() {
    this.newCategory = { name: '', description: '', parentId: undefined };
    this.displayDialog = true;
  }

  saveCategory() {
    if (!this.newCategory.name) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Name is required' });
      return;
    }

    this.categoryService.createCategory(this.newCategory).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category created' });
      this.displayDialog = false;
      this.loadCategories();
    });
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category deleted' });
      this.loadCategories();
    });
  }

  getCategoryName(id?: string) {
    if (!id) return '-';
    return this.categories.find(c => c.id === id)?.name || '-';
  }
}