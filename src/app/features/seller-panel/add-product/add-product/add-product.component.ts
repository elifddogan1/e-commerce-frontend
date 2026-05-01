import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryDTO } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  // Sadece hatasız çalışan temel modülleri bıraktık
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  productForm!: FormGroup;
  categories: CategoryDTO[] = [];
  selectedFiles: File[] = [];
  isSubmitting = false;

  ngOnInit(): void {
    this.buildForm();
    this.loadCategories();
  }

  private buildForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      basePrice: [null, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      variants: this.fb.array([]),
    });
  }

  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  addVariant(): void {
    const variantGroup = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
    });
    this.variants.push(variantGroup);
  }

  removeVariant(idx: number): void {
    this.variants.removeAt(idx);
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files) as File[];
    }
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (c) => (this.categories = c),
      error: (err) => console.error('Hata:', err)
    });
  }

  submit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (res) => {
        if (this.selectedFiles.length > 0) this.uploadImages(res.id);
        else this.handleSuccess();
      },
      error: () => {
        this.isSubmitting = false;
        alert('Hata oluştu.');
      }
    });
  }

  private uploadImages(id: string): void {
    this.productService.uploadImages(id, this.selectedFiles).subscribe(() => this.handleSuccess());
  }

  private handleSuccess(): void {
    this.isSubmitting = false;
    this.router.navigate(['/seller/products']);
  }
}