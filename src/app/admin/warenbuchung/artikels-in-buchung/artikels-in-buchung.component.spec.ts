import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikelsInBuchungComponent } from './artikels-in-buchung.component';

describe('ArtikelsInBuchungComponent', () => {
  let component: ArtikelsInBuchungComponent;
  let fixture: ComponentFixture<ArtikelsInBuchungComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtikelsInBuchungComponent]
    });
    fixture = TestBed.createComponent(ArtikelsInBuchungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
