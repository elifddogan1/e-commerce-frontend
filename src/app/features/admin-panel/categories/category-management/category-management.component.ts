import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Category, CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, FormsModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  mainCategories: Category[] = [];
  displayDialog = false;
  loading = true;
  newCategory: Category = { name: '' };

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.mainCategories = data.filter(c => !c.parentId);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  showAddDialog() {
    this.newCategory = { name: '', description: '', parentId: undefined };
    this.displayDialog = true;
  }

  saveCategory() {
    if (!this.newCategory.name) {
      this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: 'Kategori adı zorunludur.' });
      return;
    }

    this.categoryService.createCategory(this.newCategory).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Kategori eklendi.' });
      this.displayDialog = false;
      this.loadCategories();
    });
  }

  deleteCategory(id: string) {
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Kategori silindi.' });
        this.loadCategories();
      });
    }
  }

  getCategoryName(id?: string) {
    if (!id) return '-';
    return this.categories.find(c => c.id === id)?.name || '-';
  }
}