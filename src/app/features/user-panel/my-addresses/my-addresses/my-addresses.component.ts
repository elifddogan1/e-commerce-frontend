import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Form modülleri eklendi
import { AddressService } from '../../../../shared/services/address.service';
import { AddressDTO } from '../../../../shared/models/user.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext'; // PrimeNG Input
import { CheckboxModule } from 'primeng/checkbox'; // PrimeNG Checkbox

@Component({
  selector: 'app-my-addresses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Eklendi
    CardModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    InputTextModule, // Eklendi// Eklendi
    CheckboxModule // Eklendi
  ],
  providers: [MessageService],
  templateUrl: './my-addresses.component.html',
  styleUrls: ['./my-addresses.component.scss']
})
export class MyAddressesComponent implements OnInit {
  private addressService = inject(AddressService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  addresses: AddressDTO[] = [];
  displayDialog: boolean = false;
  addressForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadAddresses();
  }

  initForm() {
    this.addressForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3)]],
      fullName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      district: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      country: ['Türkiye', [Validators.required]],
      isDefault: [false]
    });
  }

  loadAddresses() {
    this.addressService.getMyAddresses().subscribe({
      next: (data) => this.addresses = data,
      error: () => this.showError('Adresler yüklenirken bir hata oluştu.')
    });
  }

  saveAddress() {
    if (this.addressForm.valid) {
      const addressData = this.addressForm.value;
      this.addressService.createAddress(addressData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Adres başarıyla kaydedildi.' });
          this.displayDialog = false;
          this.addressForm.reset({ country: 'Türkiye', isDefault: false });
          this.loadAddresses();
        },
        error: () => this.showError('Adres kaydedilirken bir hata oluştu.')
      });
    } else {
      Object.values(this.addressForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  makeDefault(id: string) {
    this.addressService.setDefaultAddress(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Varsayılan adres güncellendi.' });
        this.loadAddresses();
      }
    });
  }

  deleteAddress(id: string) {
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'warn', summary: 'Silindi', detail: 'Adres kaldırıldı.' });
        this.loadAddresses();
      }
    });
  }

  showAddressDialog() {
    this.addressForm.reset({ country: 'Türkiye', isDefault: false });
    this.displayDialog = true;
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Hata', detail: msg });
  }
}
