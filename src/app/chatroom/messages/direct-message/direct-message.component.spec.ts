import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMessageComponent } from './messages.component';

describe('DirectMessageComponent', () => {
  let component: DirectMessageComponent;
  let fixture: ComponentFixture<DirectMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
