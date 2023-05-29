import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBuchungComponent } from './edit-buchung.component';

describe('EditBuchungComponent', () => {
  let component: EditBuchungComponent;
  let fixture: ComponentFixture<EditBuchungComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBuchungComponent]
    });
    fixture = TestBed.createComponent(EditBuchungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
