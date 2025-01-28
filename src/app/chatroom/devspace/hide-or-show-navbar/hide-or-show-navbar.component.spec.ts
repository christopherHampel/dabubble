import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideOrShowNavbarComponent } from './hide-or-show-navbar.component';

describe('HideOrShowNavbarComponent', () => {
  let component: HideOrShowNavbarComponent;
  let fixture: ComponentFixture<HideOrShowNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HideOrShowNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HideOrShowNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
