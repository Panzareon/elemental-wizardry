import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationActionComponent } from './duration-action.component';

describe('DurationActionComponent', () => {
  let component: DurationActionComponent;
  let fixture: ComponentFixture<DurationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DurationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
