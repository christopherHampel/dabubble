import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiquickbarComponent } from './emojiquickbar.component';

describe('EmojiquickbarComponent', () => {
  let component: EmojiquickbarComponent;
  let fixture: ComponentFixture<EmojiquickbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojiquickbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmojiquickbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
