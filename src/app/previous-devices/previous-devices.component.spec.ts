import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousDevicesComponent } from './previous-devices.component';

describe('PreviousDevicesComponent', () => {
  let component: PreviousDevicesComponent;
  let fixture: ComponentFixture<PreviousDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
