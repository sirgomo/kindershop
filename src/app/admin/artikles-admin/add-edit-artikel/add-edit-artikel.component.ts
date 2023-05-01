import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iArtikel } from 'src/app/model/iArtikel';
import { iCategory } from 'src/app/model/icategory';
import { CategoriesService } from '../../categories/categories.service';
import { EMPTY, Observable } from 'rxjs';
import { ArtikelsService } from '../artikels.service';
import { isNgContainer } from '@angular/compiler';

@Component({
  selector: 'app-add-edit-artikel',
  templateUrl: './add-edit-artikel.component.html',
  styleUrls: ['./add-edit-artikel.component.scss']
})
export class AddEditArtikelComponent {
  form!: FormGroup;
  categories$ = this.catService.findAll();
  go$ = new Observable();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditArtikelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: iArtikel,
    private catService: CategoriesService,
    private artService: ArtikelsService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.data) {
      this.patchForm();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      sku: ['', Validators.required],
      ean: ['', Validators.required],
      availability: ['', Validators.required],
      weight: ['', Validators.required],
      menge: [{ value: '', disabled: true }],
      dimensions: ['', Validators.required],
      images: ['', Validators.required],
      relatedProducts: ['', Validators.required],
      reviews: [''],
      rating: [''],
      categories: ['', Validators.required]
    });

  }

  patchForm(): void {

    this.form.patchValue({
      name: this.data.name,
      description: this.data.description,
      price: this.data.price,
      brand: this.data.brand,
      model: this.data.model,
      sku: this.data.sku,
      ean: this.data.ean,
      availability: this.data.availability,
      weight: this.data.weight,
      menge: this.data.menge,
      dimensions: this.data.dimensions,
      images: this.data.images,
      relatedProducts: this.data.relatedProducts,
      reviews: this.data.reviews,
      rating: this.data.rating,
      categories:  this.data.categories[0] // assuming the first category is selected
    });

  }

  onSubmit(): Observable<any> {
    if (this.form.valid) {
      const data: iArtikel = {
        id: this.data ? this.data.id : undefined,
        name: this.form.value.name,
        description: this.form.value.description,
        price: this.form.value.price,
        brand: this.form.value.brand,
        model: this.form.value.model,
        sku: this.form.value.sku,
        ean: this.form.value.ean,
        availability: this.form.value.availability,
        weight: this.form.value.weight,
        menge: this.form.value.menge,
        dimensions: this.form.value.dimensions,
        images: this.form.value.images,
        relatedProducts: this.form.value.relatedProducts,
        reviews: this.form.value.reviews,
        rating: this.form.value.rating,
        categories:  [this.form.value.categories],
      };

      if(!this.data)
        return this.go$ = this.artService.createArtikel(data, this.dialogRef);

        data.menge = this.data.menge;
        return this.go$ = this.artService.updateArtikel(data, this.dialogRef);
    }
    return EMPTY;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
