import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveBuffsComponent } from './active-buffs.component';

describe('ActiveBuffsComponent', () => {
  let component: ActiveBuffsComponent;
  let fixture: ComponentFixture<ActiveBuffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveBuffsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveBuffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
