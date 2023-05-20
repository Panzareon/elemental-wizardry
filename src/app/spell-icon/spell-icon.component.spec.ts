import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellIconComponent } from './spell-icon.component';

describe('SpellIconComponent', () => {
  let component: SpellIconComponent;
  let fixture: ComponentFixture<SpellIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
