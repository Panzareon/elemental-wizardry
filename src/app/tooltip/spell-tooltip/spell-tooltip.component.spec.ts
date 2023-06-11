import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellTooltipComponent } from './spell-tooltip.component';

describe('SpellTooltipComponent', () => {
  let component: SpellTooltipComponent;
  let fixture: ComponentFixture<SpellTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
