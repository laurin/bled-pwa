import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceManagementControlsComponent } from './device-management-controls.component';

describe('DeviceManagementControlsComponent', () => {
  let component: DeviceManagementControlsComponent;
  let fixture: ComponentFixture<DeviceManagementControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceManagementControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceManagementControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
