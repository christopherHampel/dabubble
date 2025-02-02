import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadRouterOutletComponent } from './thread-router-outlet.component';

describe('ThreadRouterOutletComponent', () => {
  let component: ThreadRouterOutletComponent;
  let fixture: ComponentFixture<ThreadRouterOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadRouterOutletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadRouterOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
