import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluenceTooltipComponent } from './influence-tooltip.component';

describe('InfluenceTooltipComponent', () => {
  let component: InfluenceTooltipComponent;
  let fixture: ComponentFixture<InfluenceTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfluenceTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfluenceTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
