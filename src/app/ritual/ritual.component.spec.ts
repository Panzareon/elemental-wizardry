import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RitualComponent } from './ritual.component';

describe('RitualComponent', () => {
  let component: RitualComponent;
  let fixture: ComponentFixture<RitualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RitualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RitualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
