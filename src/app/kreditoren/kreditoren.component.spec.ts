import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KreditorenComponent } from './kreditoren.component';

describe('KreditorenComponent', () => {
  let component: KreditorenComponent;
  let fixture: ComponentFixture<KreditorenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KreditorenComponent]
    });
    fixture = TestBed.createComponent(KreditorenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
