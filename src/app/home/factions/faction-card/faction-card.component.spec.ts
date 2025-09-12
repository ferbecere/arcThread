import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactionCardComponent } from './faction-card.component';

describe('FactionCardComponent', () => {
  let component: FactionCardComponent;
  let fixture: ComponentFixture<FactionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
