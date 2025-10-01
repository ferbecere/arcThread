import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFormModalComponent } from './card-form-modal.component';

describe('CardFormModalComponent', () => {
  let component: CardFormModalComponent;
  let fixture: ComponentFixture<CardFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
