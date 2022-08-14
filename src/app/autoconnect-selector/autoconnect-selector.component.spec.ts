import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoconnectSelectorComponent } from './autoconnect-selector.component';

describe('AutoconnectSelectorComponent', () => {
  let component: AutoconnectSelectorComponent;
  let fixture: ComponentFixture<AutoconnectSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoconnectSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoconnectSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
