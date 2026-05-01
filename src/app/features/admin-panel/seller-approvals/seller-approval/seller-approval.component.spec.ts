import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerApprovalComponent } from './seller-approval.component';

describe('SellerApprovalComponent', () => {
  let component: SellerApprovalComponent;
  let fixture: ComponentFixture<SellerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerApprovalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
