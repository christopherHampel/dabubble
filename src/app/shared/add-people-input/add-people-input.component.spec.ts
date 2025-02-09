import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPeopleInputComponent } from './add-people-input.component';

describe('AddPeopleInputComponent', () => {
  let component: AddPeopleInputComponent;
  let fixture: ComponentFixture<AddPeopleInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPeopleInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPeopleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
