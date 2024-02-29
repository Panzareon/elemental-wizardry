import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RitualCircleComponent } from './ritual-circle.component';

describe('RitualCircleComponent', () => {
  let component: RitualCircleComponent;
  let fixture: ComponentFixture<RitualCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RitualCircleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RitualCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
