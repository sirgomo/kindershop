import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { UserComponent } from './user/user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ArtikelsComponent } from './artikels/artikels.component';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { RegisterComponent } from './register/register.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AdminComponent } from './admin/admin.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { ArtiklesAdminComponent } from './admin/artikles-admin/artikles-admin.component';
import {MatTableModule} from '@angular/material/table';
import { AddCategoryComponent } from './admin/categories/add-category/add-category.component';
import { LoaderComponent } from './loader/loader.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AddEditArtikelComponent } from './admin/artikles-admin/add-edit-artikel/add-edit-artikel.component';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { EinkaufskorbComponent } from './einkaufskorb/einkaufskorb.component';
import { SearchpanelComponent } from './searchpanel/searchpanel.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ArtikelDetailsComponent } from './artikels/artikel-details/artikel-details.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ShippingaddressComponent } from './einkaufskorb/shippingaddress/shippingaddress.component';
import { PaymentComponent } from './einkaufskorb/payment/payment.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { KreditorenComponent } from './admin/kreditoren/kreditoren.component';
import { AddEditKreditorenComponent } from './admin/kreditoren/add-edit-kreditoren/add-edit-kreditoren.component';
import { WarenbuchungComponent } from './admin/warenbuchung/warenbuchung.component';
import { EditBuchungComponent } from './admin/warenbuchung/edit-buchung/edit-buchung.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    ArtikelsComponent,
    RegisterComponent,
    AdminComponent,
    CategoriesComponent,
    ArtiklesAdminComponent,
    AddCategoryComponent,
    LoaderComponent,
    AddEditArtikelComponent,
    ChangePasswordComponent,
    EinkaufskorbComponent,
    SearchpanelComponent,
    PaginationComponent,
    ArtikelDetailsComponent,
    ShippingaddressComponent,
    PaymentComponent,
    KreditorenComponent,
    AddEditKreditorenComponent,
    WarenbuchungComponent,
    EditBuchungComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatProgressBarModule,
    MatStepperModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
  ],
  providers: [ {
    provide : HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  },
  MatDatepickerModule,
],
  bootstrap: [AppComponent]
})
export class AppModule { }
