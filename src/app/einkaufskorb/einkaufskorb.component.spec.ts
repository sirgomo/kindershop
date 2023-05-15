import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinkaufskorbComponent } from './einkaufskorb.component';

describe('EinkaufskorbComponent', () => {
  let component: EinkaufskorbComponent;
  let fixture: ComponentFixture<EinkaufskorbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EinkaufskorbComponent]
    });
    fixture = TestBed.createComponent(EinkaufskorbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
