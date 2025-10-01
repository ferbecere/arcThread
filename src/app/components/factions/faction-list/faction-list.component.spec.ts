import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactionListComponent } from './faction-list.component';

describe('FactionListComponent', () => {
  let component: FactionListComponent;
  let fixture: ComponentFixture<FactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
