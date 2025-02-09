import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewSmallComponent } from './user-view-small.component';

describe('UserViewSmallComponent', () => {
  let component: UserViewSmallComponent;
  let fixture: ComponentFixture<UserViewSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserViewSmallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
