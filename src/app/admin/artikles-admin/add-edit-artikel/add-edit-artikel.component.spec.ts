import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditArtikelComponent } from './add-edit-artikel.component';

describe('AddEditArtikelComponent', () => {
  let component: AddEditArtikelComponent;
  let fixture: ComponentFixture<AddEditArtikelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditArtikelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditArtikelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
