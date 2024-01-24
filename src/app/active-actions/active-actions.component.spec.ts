import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveActionsComponent } from './active-actions.component';

describe('ActiveActionsComponent', () => {
  let component: ActiveActionsComponent;
  let fixture: ComponentFixture<ActiveActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
