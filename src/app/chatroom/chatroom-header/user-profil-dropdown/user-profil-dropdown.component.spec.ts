import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilDropdownComponent } from './user-profil-dropdown.component';

describe('UserProfilDropdownComponent', () => {
  let component: UserProfilDropdownComponent;
  let fixture: ComponentFixture<UserProfilDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfilDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfilDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
