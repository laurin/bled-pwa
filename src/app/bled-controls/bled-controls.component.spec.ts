import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BledControlsComponent } from './bled-controls.component';

describe('BledControlsComponent', () => {
  let component: BledControlsComponent;
  let fixture: ComponentFixture<BledControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BledControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BledControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
