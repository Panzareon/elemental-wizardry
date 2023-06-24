import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorationTooltipComponent } from './exploration-tooltip.component';

describe('ExplorationTooltipComponent', () => {
  let component: ExplorationTooltipComponent;
  let fixture: ComponentFixture<ExplorationTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplorationTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorationTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
