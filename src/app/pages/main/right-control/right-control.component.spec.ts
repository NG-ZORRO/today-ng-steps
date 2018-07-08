import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightControlComponent } from './right-control.component';

describe('RightControlComponent', () => {
  let component: RightControlComponent;
  let fixture: ComponentFixture<RightControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
