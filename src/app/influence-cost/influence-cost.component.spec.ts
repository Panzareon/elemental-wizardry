import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluenceCostComponent } from './influence-cost.component';

describe('InfluenceCostComponent', () => {
  let component: InfluenceCostComponent;
  let fixture: ComponentFixture<InfluenceCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfluenceCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfluenceCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
