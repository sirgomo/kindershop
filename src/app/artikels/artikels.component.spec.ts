import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikelsComponent } from './artikels.component';

describe('ArtikelsComponent', () => {
  let component: ArtikelsComponent;
  let fixture: ComponentFixture<ArtikelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtikelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtikelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
