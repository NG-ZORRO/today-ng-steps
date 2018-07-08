import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftControlComponent } from './left-control.component';

describe('LeftControlComponent', () => {
  let component: LeftControlComponent;
  let fixture: ComponentFixture<LeftControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
