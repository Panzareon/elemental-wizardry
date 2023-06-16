import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockTooltipComponent } from './unlock-tooltip.component';

describe('UnlockTooltipComponent', () => {
  let component: UnlockTooltipComponent;
  let fixture: ComponentFixture<UnlockTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnlockTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
