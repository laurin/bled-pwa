import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiModeControlsComponent } from './gui-mode-controls.component';

describe('GuiModeControlsComponent', () => {
  let component: GuiModeControlsComponent;
  let fixture: ComponentFixture<GuiModeControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiModeControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuiModeControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
