import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { AuthService } from '../../../core/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    ToggleButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    isSeller: [false]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { isSeller, ...formData } = this.registerForm.value;

    const request$ = isSeller
      ? this.authService.registerSeller(formData)
      : this.authService.registerUser(formData);

    request$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Kayıt işlemi başarısız oldu.';
        console.error('Register error', err);
      }
    });
  }
}