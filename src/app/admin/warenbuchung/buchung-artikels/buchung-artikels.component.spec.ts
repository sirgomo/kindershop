import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuchungArtikelsComponent } from './buchung-artikels.component';

describe('BuchungArtikelsComponent', () => {
  let component: BuchungArtikelsComponent;
  let fixture: ComponentFixture<BuchungArtikelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuchungArtikelsComponent]
    });
    fixture = TestBed.createComponent(BuchungArtikelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
