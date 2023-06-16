import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestellungDetailsComponent } from './bestellung-details.component';

describe('BestellungDetailsComponent', () => {
  let component: BestellungDetailsComponent;
  let fixture: ComponentFixture<BestellungDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BestellungDetailsComponent]
    });
    fixture = TestBed.createComponent(BestellungDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
