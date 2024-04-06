import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuffTooltipComponent } from './buff-tooltip.component';

describe('BuffTooltipComponent', () => {
  let component: BuffTooltipComponent;
  let fixture: ComponentFixture<BuffTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuffTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuffTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
