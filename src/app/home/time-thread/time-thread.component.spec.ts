import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeThreadComponent } from './time-thread.component';

describe('TimeThreadComponent', () => {
  let component: TimeThreadComponent;
  let fixture: ComponentFixture<TimeThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeThreadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
