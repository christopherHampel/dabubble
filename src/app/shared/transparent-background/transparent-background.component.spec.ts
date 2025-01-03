import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparentBackgroundComponent } from './transparent-background.component';

describe('TransparentBackgroundComponent', () => {
  let component: TransparentBackgroundComponent;
  let fixture: ComponentFixture<TransparentBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransparentBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransparentBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
