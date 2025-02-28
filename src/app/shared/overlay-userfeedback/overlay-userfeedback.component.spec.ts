import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayUserfeedbackComponent } from './overlay-userfeedback.component';

describe('OverlayUserfeedbackComponent', () => {
  let component: OverlayUserfeedbackComponent;
  let fixture: ComponentFixture<OverlayUserfeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayUserfeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayUserfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
