import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditKreditorenComponent } from './add-edit-kreditoren.component';

describe('AddEditKreditorenComponent', () => {
  let component: AddEditKreditorenComponent;
  let fixture: ComponentFixture<AddEditKreditorenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditKreditorenComponent]
    });
    fixture = TestBed.createComponent(AddEditKreditorenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
